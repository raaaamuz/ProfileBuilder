import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PreviewContext } from '../../admin/PreviewContext';
import api from '../../../services/api';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalSkills } from '../../../templates/minimal';
import { CyberSkills } from '../../../templates/cyber';
import { GlassSkills } from '../../../templates/glass';
import { GradientSkills } from '../../../templates/gradient';
import { ClassicSkills } from '../../../templates/classic';
import { DeveloperSkills } from '../../../templates/developer';

// Import legacy component
import SkillsSection from './SkillsSection';

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
 * SkillsByStyle - Renders skills using the selected template's component
 *
 * Priority:
 * 1. If user explicitly selected a design layout (badges, list, etc.), use SkillsSection
 * 2. Otherwise, if template is selected, use template component
 * 3. Fallback to SkillsSection for default rendering
 */
const SkillsByStyle = ({ isAdminPreview = false, globalFont = null }) => {
  const { selectedTemplate, liveSkillsData, liveSkillsDesign } = useContext(PreviewContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [skills, setSkills] = useState([]);

  const templateStyle = selectedTemplate?.style || null;
  const isInAdminPreview = isAdminPreview || (!username && window.location.pathname.includes('/dashboard/'));

  // Fetch skills data
  useEffect(() => {
    if (isInAdminPreview && liveSkillsData && liveSkillsData.length > 0) {
      setSkills(liveSkillsData);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setSkills(response.data.skills || []);
        } else if (token) {
          const response = await api.get('/career/skill/', {
            headers: { Authorization: `Token ${token}` }
          });
          setSkills(Array.isArray(response.data) ? response.data : response.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchData();
  }, [username, isInAdminPreview, liveSkillsData]);

  const displayData = isInAdminPreview && liveSkillsData?.length > 0 ? liveSkillsData : skills;

  // Check if user has explicitly selected a design layout
  // liveSkillsDesign with layoutType means user selected from design picker
  const hasUserDesignSelection = liveSkillsDesign && liveSkillsDesign.layoutType;

  // If user selected a specific design layout, use SkillsSection which supports all layouts
  // This allows design selection to override template's fixed layout
  if (hasUserDesignSelection) {
    return <SkillsSection isAdminPreview={isAdminPreview} globalFont={globalFont} />;
  }

  // If no template selected, use original SkillsSection
  if (!templateStyle) {
    return <SkillsSection isAdminPreview={isAdminPreview} globalFont={globalFont} />;
  }

  // Get template component
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '');
  const SkillsComponent = styleComponents[normalized] || styleComponents.minimal;

  // Pass AI-generated design colors if available
  const accentColor = liveSkillsDesign?.accentColor || '#6366f1';
  const backgroundColor = liveSkillsDesign?.backgroundColor;

  return <SkillsComponent data={displayData} accentColor={accentColor} backgroundColor={backgroundColor} isAdminPreview={isAdminPreview} />;
};

export default SkillsByStyle;
