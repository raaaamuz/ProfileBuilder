import React, { useContext } from 'react';
import { PreviewContext } from '../../admin/PreviewContext';
import { getProfileComponent } from './styles';
import BioSection from './BioSection';

/**
 * ProfileByStyle - Renders the appropriate profile component based on selected template style
 *
 * IMPORTANT - PROFILE PICTURE HANDLING (DO NOT MODIFY WITHOUT UNDERSTANDING):
 * ============================================================================
 * The profile picture can come from two sources:
 * 1. profile_picture_preview: Base64 data URL when user uploads a new image (temporary preview)
 * 2. profile_picture: URL from backend when image is already saved
 *
 * Template components (ProfileGradient, ProfileGlass, etc.) expect BOTH fields separately
 * and use: displayImage = profile_picture_preview || profile_picture
 *
 * This allows previewing a newly selected image before save, while falling back to saved image.
 * DO NOT combine these fields into one - it will break the preview functionality.
 * ============================================================================
 */
const ProfileByStyle = ({ isAdminPreview = false, globalFont = null }) => {
  const { selectedTemplate, liveProfileData, liveProfileDesign } = useContext(PreviewContext);

  const templateStyle = selectedTemplate?.style || null;

  // If no template selected, use original BioSection (which supports AI design customization)
  if (!templateStyle) {
    return <BioSection isAdminPreview={isAdminPreview} globalFont={globalFont} />;
  }

  // Get the appropriate profile component for this style
  const ProfileComponent = getProfileComponent(templateStyle);

  const templateConfig = selectedTemplate?.config || {};
  const globalConfig = templateConfig.global || {};
  const profileConfig = templateConfig.profile || {};

  const accentColor = liveProfileDesign?.accentColor || profileConfig.accentColor || globalConfig.accentColor || '#6366f1';
  const backgroundColor = liveProfileDesign?.backgroundColor || profileConfig.backgroundColor || globalConfig.gradient || null;
  const gradientBg = profileConfig.gradient || globalConfig.gradient || null;

  /**
   * PROFILE DATA CONSTRUCTION
   * -------------------------
   * profile_picture_preview: New image being previewed (base64 from file input)
   * profile_picture: Saved image URL from backend
   *
   * BOTH must be passed separately - templates handle the fallback logic internally:
   * displayImage = profile_picture_preview || profile_picture
   */
  const profileData = {
    name: liveProfileData?.name || 'Your Name',
    email: liveProfileData?.email || '',
    phone: liveProfileData?.phone || '',
    location: liveProfileData?.location || '',
    bio: liveProfileData?.bio || '',
    // CRITICAL: Pass BOTH picture fields separately for proper preview/fallback behavior
    profile_picture: liveProfileData?.profile_picture || null,
    profile_picture_preview: liveProfileData?.profile_picture_preview || null,
    job_title: liveProfileData?.job_title || liveProfileData?.title || 'Professional',
    linkedin: liveProfileData?.linkedin || '',
    twitter: liveProfileData?.twitter || '',
    facebook: liveProfileData?.facebook || '',
    github: liveProfileData?.github || '',
    website: liveProfileData?.website || '',
    cv: liveProfileData?.cv || null,
    show_availability: liveProfileData?.show_availability || false,
    show_download_cv: liveProfileData?.show_download_cv !== false,
    years_of_experience: liveProfileData?.years_of_experience || liveProfileData?.years_experience || '',
  };

  return (
    <ProfileComponent
      profileData={profileData}
      accentColor={accentColor}
      backgroundColor={backgroundColor}
      gradientBg={gradientBg}
      isAdminPreview={isAdminPreview}
    />
  );
};

export default ProfileByStyle;
