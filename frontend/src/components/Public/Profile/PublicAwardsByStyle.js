import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicTemplateContext } from '../../../context/PublicTemplateContext';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalAwards } from '../../../templates/minimal';
import { CyberAwards } from '../../../templates/cyber';
import { GlassAwards } from '../../../templates/glass';
import { GradientAwards } from '../../../templates/gradient';
import { ClassicAwards } from '../../../templates/classic';
import { DeveloperAwards } from '../../../templates/developer';

// Map template styles to components
const styleComponents = {
  minimal: MinimalAwards,
  cyber: CyberAwards,
  dark: CyberAwards,
  glass: GlassAwards,
  glassmorphism: GlassAwards,
  gradient: GradientAwards,
  classic: ClassicAwards,
  professional: ClassicAwards,
  developer: DeveloperAwards,
};

/**
 * PublicAwardsByStyle - For public profile pages
 */
const PublicAwardsByStyle = () => {
  const { templateStyle } = useContext(PublicTemplateContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUsername || cachedCustomDomainUser;
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setAwards(response.data.awards || []);
        }
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };
    fetchData();
  }, [username]);

  // Get template component - use MinimalAwards as default
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '') || 'minimal';
  const AwardsComponent = styleComponents[normalized] || styleComponents.minimal;

  return <AwardsComponent data={awards} />;
};

export default PublicAwardsByStyle;
