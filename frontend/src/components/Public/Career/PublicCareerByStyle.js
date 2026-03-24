import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicTemplateContext } from '../../../context/PublicTemplateContext';
import api from '../../../services/api';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalCareer } from '../../../templates/minimal';
import { CyberCareer } from '../../../templates/cyber';
import { GlassCareer } from '../../../templates/glass';
import { GradientCareer } from '../../../templates/gradient';
import { ClassicCareer } from '../../../templates/classic';
import { DeveloperCareer } from '../../../templates/developer';

// Import legacy component
import CareerTimeline from './CareerTimeline';

// Map template styles to components
const styleComponents = {
  minimal: MinimalCareer,
  cyber: CyberCareer,
  dark: CyberCareer,
  glass: GlassCareer,
  glassmorphism: GlassCareer,
  gradient: GradientCareer,
  classic: ClassicCareer,
  professional: ClassicCareer,
  developer: DeveloperCareer,
};

/**
 * PublicCareerByStyle - For public profile pages, uses template from PublicTemplateContext
 */
const PublicCareerByStyle = () => {
  const { templateStyle } = useContext(PublicTemplateContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [careerData, setCareerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setCareerData(response.data.career_entries || response.data.careerEntries || []);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
      }
    };
    fetchData();
  }, [username]);

  // Get template component - use MinimalCareer as default
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '') || 'minimal';
  const CareerComponent = styleComponents[normalized] || styleComponents.minimal;

  return <CareerComponent data={careerData} />;
};

export default PublicCareerByStyle;
