import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PreviewContext } from '../../admin/PreviewContext';
import { getEducationComponent } from './styles';
import Education from './Education';
import api from '../../../services/api';
import { getSubdomainUsername } from '../../../utils/subdomain';

/**
 * EducationByStyle - Renders the appropriate education component based on selected template style
 *
 * Priority:
 * 1. If user explicitly selected a design (layoutType), use Education component which supports all layouts
 * 2. Otherwise, if template is selected, use template component
 * 3. Fallback to Education for default rendering
 */
const EducationByStyle = ({ isAdminPreview = false, globalFont = null }) => {
  const { selectedTemplate, liveEducationData, liveEducationDesign } = useContext(PreviewContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [educationData, setEducationData] = useState([]);

  const templateStyle = selectedTemplate?.style || null;
  const isInAdminPreview = isAdminPreview || (!username && window.location.pathname.includes('/dashboard/'));

  // Fetch education data
  useEffect(() => {
    if (isInAdminPreview && liveEducationData && liveEducationData.length > 0) {
      setEducationData(liveEducationData);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setEducationData(response.data?.educationEntries || response.data?.education_entries || []);
        } else if (token) {
          const response = await api.get('/education/entries/', {
            headers: { Authorization: `Token ${token}` }
          });
          setEducationData(Array.isArray(response.data) ? response.data : (response.data?.education_entries || []));
        }
      } catch (error) {
        console.error("Error fetching education:", error);
      }
    };
    fetchData();
  }, [username, isInAdminPreview, liveEducationData]);

  // Use live data in admin preview
  const displayData = isInAdminPreview && liveEducationData?.length > 0 ? liveEducationData : educationData;

  // If no template selected, use original Education component (supports full design customization)
  if (!templateStyle) {
    return <Education liveDesignConfig={liveEducationDesign} liveEducationData={displayData} globalFont={globalFont} isAdminPreview={isInAdminPreview} />;
  }

  // Get the appropriate education component for this template style
  const EducationComponent = getEducationComponent(templateStyle);

  // Pass AI-generated design colors if available
  const accentColor = liveEducationDesign?.accentColor || '#6366f1';
  const backgroundColor = liveEducationDesign?.backgroundColor;

  return (
    <EducationComponent
      educationData={displayData}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      designConfig={liveEducationDesign}
      isAdminPreview={isInAdminPreview}
    />
  );
};

export default EducationByStyle;
