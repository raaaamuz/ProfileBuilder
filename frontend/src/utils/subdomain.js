import { useParams } from 'react-router-dom';

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
 * Custom hook to get username from URL params OR subdomain
 */
export const useUsername = () => {
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  return urlUsername || subdomainUsername || null;
};
