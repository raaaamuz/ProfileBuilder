import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicTemplateContext } from '../../../context/PublicTemplateContext';
import api from '../../../services/api';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalEducation } from '../../../templates/minimal';
import { CyberEducation } from '../../../templates/cyber';
import { GlassEducation } from '../../../templates/glass';
import { GradientEducation } from '../../../templates/gradient';
import { ClassicEducation } from '../../../templates/classic';
import { DeveloperEducation } from '../../../templates/developer';

// Import legacy component
import Education from './Education';

// Map template styles to components
const styleComponents = {
  minimal: MinimalEducation,
  cyber: CyberEducation,
  dark: CyberEducation,
  glass: GlassEducation,
  glassmorphism: GlassEducation,
  gradient: GradientEducation,
  classic: ClassicEducation,
  professional: ClassicEducation,
  developer: DeveloperEducation,
};

/**
 * PublicEducationByStyle - For public profile pages
 */
const PublicEducationByStyle = () => {
  const { templateStyle } = useContext(PublicTemplateContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setEducationData(response.data.education_entries || response.data.educationEntries || []);
        }
      } catch (error) {
        console.error("Error fetching education:", error);
      }
    };
    fetchData();
  }, [username]);

  // Get template component - use MinimalEducation as default
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '') || 'minimal';
  const EducationComponent = styleComponents[normalized] || styleComponents.minimal;

  return <EducationComponent data={educationData} />;
};

export default PublicEducationByStyle;
