import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ============================================================================
// DOMAIN DETECTION UTILITIES
// ============================================================================
// This file handles both subdomain detection (username.profile2connect.com)
// and custom domain detection (user's own domain like portfolio.example.com)
// ============================================================================

// Cache for custom domain username lookup
let customDomainCache = {
  hostname: null,
  username: null,
  checked: false,
};

/**
 * Detects if the current request is from a subdomain
 * Returns the username from subdomain or null if on main domain
 */
export const getSubdomainUsername = () => {
  const hostname = window.location.hostname;

  // Check if it's a subdomain of profile2connect.com
  const match = hostname.match(/^([^.]+)\.profile2connect\.com$/);

  if (match && match[1] !== 'www') {
    return match[1]; // Return the subdomain as username
  }

  return null; // Not a subdomain
};

export const isSubdomain = () => {
  return getSubdomainUsername() !== null;
};

/**
 * Check if current hostname might be a custom domain
 * (not localhost, not profile2connect.com)
 */
export const isPotentialCustomDomain = () => {
  const hostname = window.location.hostname;

  // Not a custom domain if it's localhost or local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return false;
  }

  // Not a custom domain if it's the main domain or a subdomain
  if (hostname.includes('profile2connect.com')) {
    return false;
  }

  // Could be a custom domain
  return true;
};

/**
 * Async function to fetch username from custom domain via API
 * @param {string} hostname - The custom domain hostname
 * @returns {Promise<string|null>} - The username or null if not found
 */
export const fetchCustomDomainUsername = async (hostname) => {
  // Return cached result if available
  if (customDomainCache.hostname === hostname && customDomainCache.checked) {
    return customDomainCache.username;
  }

  try {
    // Use the current origin for API calls
    const apiBase = window.location.origin;
    const response = await fetch(`${apiBase}/api/profile/domain-lookup/?domain=${encodeURIComponent(hostname)}`);

    if (response.ok) {
      const data = await response.json();
      customDomainCache = {
        hostname,
        username: data.username || null,
        checked: true,
      };
      return data.username || null;
    }
  } catch (error) {
    console.error('Error fetching custom domain username:', error);
  }

  // Cache the failed lookup
  customDomainCache = {
    hostname,
    username: null,
    checked: true,
  };
  return null;
};

/**
 * Get username synchronously (only works for subdomains or cached custom domains)
 */
export const getUsernameSyncOnly = () => {
  // First check subdomain
  const subdomainUser = getSubdomainUsername();
  if (subdomainUser) return subdomainUser;

  // Check cached custom domain
  const hostname = window.location.hostname;
  if (customDomainCache.hostname === hostname && customDomainCache.checked) {
    return customDomainCache.username;
  }

  return null;
};

/**
 * Custom hook to get username from URL params, subdomain, or custom domain
 * Returns the username string (or null) for backward compatibility
 * Also checks cached custom domain username (resolved by App.js on page load)
 */
export const useUsername = () => {
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();

  return urlUsername || subdomainUsername || cachedCustomDomainUser || null;
};

/**
 * Hook to detect domain type and get username with loading state
 * Used by App.js for routing decisions
 */
export const useDomainDetection = () => {
  const [state, setState] = useState({
    username: null,
    domainType: 'checking', // 'main', 'subdomain', 'custom', 'checking'
    loading: true,
  });

  useEffect(() => {
    const detect = async () => {
      // Check subdomain first (synchronous)
      const subdomainUser = getSubdomainUsername();
      if (subdomainUser) {
        setState({
          username: subdomainUser,
          domainType: 'subdomain',
          loading: false,
        });
        return;
      }

      // Check if it might be a custom domain
      if (isPotentialCustomDomain()) {
        const customUser = await fetchCustomDomainUsername(window.location.hostname);
        if (customUser) {
          setState({
            username: customUser,
            domainType: 'custom',
            loading: false,
          });
          return;
        }
      }

      // It's the main domain
      setState({
        username: null,
        domainType: 'main',
        loading: false,
      });
    };

    detect();
  }, []);

  return state;
};
