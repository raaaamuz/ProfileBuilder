import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicTemplateContext } from '../../../context/PublicTemplateContext';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalSkills } from '../../../templates/minimal';
import { CyberSkills } from '../../../templates/cyber';
import { GlassSkills } from '../../../templates/glass';
import { GradientSkills } from '../../../templates/gradient';
import { ClassicSkills } from '../../../templates/classic';
import { DeveloperSkills } from '../../../templates/developer';

// Map template styles to components
const styleComponents = {
  minimal: MinimalSkills,
  cyber: CyberSkills,
  dark: CyberSkills,
  glass: GlassSkills,
  glassmorphism: GlassSkills,
  gradient: GradientSkills,
  classic: ClassicSkills,
  professional: ClassicSkills,
  developer: DeveloperSkills,
};

/**
 * PublicSkillsByStyle - For public profile pages
 */
const PublicSkillsByStyle = () => {
  const { templateStyle } = useContext(PublicTemplateContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUsername || cachedCustomDomainUser;
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setSkills(response.data.skills || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchData();
  }, [username]);

  // Get template component - use MinimalSkills as default
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '') || 'minimal';
  const SkillsComponent = styleComponents[normalized] || styleComponents.minimal;

  return <SkillsComponent data={skills} />;
};

export default PublicSkillsByStyle;
