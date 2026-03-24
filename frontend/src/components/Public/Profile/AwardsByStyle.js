import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PreviewContext } from '../../admin/PreviewContext';
import api from '../../../services/api';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalAwards } from '../../../templates/minimal';
import { CyberAwards } from '../../../templates/cyber';
import { GlassAwards } from '../../../templates/glass';
import { GradientAwards } from '../../../templates/gradient';
import { ClassicAwards } from '../../../templates/classic';
import { DeveloperAwards } from '../../../templates/developer';

// Import legacy component
import AwardsSection from './AwardsSection';

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
 * AwardsByStyle - Renders awards using the selected template's component
 *
 * Priority:
 * 1. If user explicitly selected a design layout, use AwardsSection
 * 2. Otherwise, if template is selected, use template component
 * 3. Fallback to AwardsSection for default rendering
 */
const AwardsByStyle = ({ isAdminPreview = false, globalFont = null }) => {
  const { selectedTemplate, liveAwardsData, liveAwardsDesign } = useContext(PreviewContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [awards, setAwards] = useState([]);

  const templateStyle = selectedTemplate?.style || null;
  const isInAdminPreview = isAdminPreview || (!username && window.location.pathname.includes('/dashboard/'));

  // Fetch awards data
  useEffect(() => {
    if (isInAdminPreview && liveAwardsData && liveAwardsData.length > 0) {
      setAwards(liveAwardsData);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setAwards(response.data.awards || []);
        } else if (token) {
          const response = await api.get('/achievements/', {
            headers: { Authorization: `Token ${token}` }
          });
          setAwards(Array.isArray(response.data) ? response.data : response.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };
    fetchData();
  }, [username, isInAdminPreview, liveAwardsData]);

  const displayData = isInAdminPreview && liveAwardsData?.length > 0 ? liveAwardsData : awards;

  // Check if user has explicitly selected a design layout
  const hasUserDesignSelection = liveAwardsDesign && liveAwardsDesign.layoutType;

  // If user selected a specific design layout, use AwardsSection which supports all layouts
  if (hasUserDesignSelection) {
    return <AwardsSection isAdminPreview={isAdminPreview} globalFont={globalFont} />;
  }

  // If no template selected, use original AwardsSection
  if (!templateStyle) {
    return <AwardsSection isAdminPreview={isAdminPreview} globalFont={globalFont} />;
  }

  // Get template component
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '');
  const AwardsComponent = styleComponents[normalized] || styleComponents.minimal;

  // Pass AI-generated design colors if available
  const accentColor = liveAwardsDesign?.accentColor || '#6366f1';
  const backgroundColor = liveAwardsDesign?.backgroundColor;

  return <AwardsComponent data={displayData} accentColor={accentColor} backgroundColor={backgroundColor} isAdminPreview={isAdminPreview} />;
};

export default AwardsByStyle;
