import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';

/**
 * MinimalLayout - Clean layout for standalone pages like Blog, Stories
 * Has a simple back button and consistent footer, no full navbar
 * Supports: URL params, subdomains (username.profile2connect.com), and custom domains
 */
const MinimalLayout = ({ children }) => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUser || cachedCustomDomainUser;

  const handleBack = () => {
    if (username) {
      navigate(`/public/profile/${username}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#fff',
    }}>
      {/* Header with back button */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4rem',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        zIndex: 100,
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        >
          <ArrowLeft size={18} />
          Back to Portfolio
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        paddingTop: '5rem',
        paddingBottom: '4rem',
        minHeight: 'calc(100vh - 9rem)',
      }}>
        {children}
      </main>

      {/* Persistent Footer Bar */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3rem',
        background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.8))',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        zIndex: 99,
        padding: '0 2rem',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} All rights reserved
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <a
          href="https://profile2connect.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#6366f1', fontSize: '0.75rem', textDecoration: 'none' }}
        >
          Powered by Profile2Connect
        </a>
      </footer>
    </div>
  );
};

export default MinimalLayout;
