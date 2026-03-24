import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';

// Import layout components
import VerticalProfilePage from '../VerticalSlider/VerticalProfilePage';
import CardStackLayout from '../Layouts/CardStackLayout';
import HorizontalScrollLayout from '../Layouts/HorizontalScrollLayout';
import DefaultProfileLayout from '../Layouts/DefaultProfileLayout';

/**
 * PortfolioRouter - Automatically routes to user's preferred layout
 * Fetches user's public_layout setting and renders the appropriate component
 * Supports: URL params, subdomains (username.profile2connect.com), and custom domains
 */
const PortfolioRouter = () => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  // Also check for cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUser || cachedCustomDomainUser;

  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayoutPreference = async () => {
      try {
        if (username) {
          const res = await api.get(`/public/settings/${username}/`);
          const settings = res.data?.settings || {};
          setLayout(settings.public_layout || 'default');
        } else {
          setLayout('default');
        }
      } catch (err) {
        console.error('Error fetching layout preference:', err);
        setLayout('default');
      } finally {
        setLoading(false);
      }
    };
    fetchLayoutPreference();
  }, [username]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  // Render the appropriate layout based on user preference
  switch (layout) {
    case 'vertical':
      return <VerticalProfilePage />;
    case 'horizontal':
      return <HorizontalScrollLayout />;
    case 'cards':
      return <CardStackLayout />;
    case 'default':
    default:
      return <DefaultProfileLayout />;
  }
};

export default PortfolioRouter;
