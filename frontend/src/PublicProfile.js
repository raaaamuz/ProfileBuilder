// PublicProfile.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicTokenProvider } from './PublicTokenContext';
import PublicProfileContent from './PublicProfileContent';

function PublicProfile() {
  // Get the token from the URL
  const { publicToken } = useParams();

  return (
    <PublicTokenProvider token={publicToken}>
      <PublicProfileContent />
    </PublicTokenProvider>
  );
}

export default PublicProfile;
