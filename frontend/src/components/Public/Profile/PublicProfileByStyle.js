import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicTemplateContext } from '../../../context/PublicTemplateContext';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';

// Import from unified templates
import { MinimalProfile } from '../../../templates/minimal';
import { CyberProfile } from '../../../templates/cyber';
import { GlassProfile } from '../../../templates/glass';
import { GradientProfile } from '../../../templates/gradient';
import { ClassicProfile } from '../../../templates/classic';
import { DeveloperProfile } from '../../../templates/developer';

// MinimalProfile is used as the default fallback

// Map template styles to components
const styleComponents = {
  minimal: MinimalProfile,
  cyber: CyberProfile,
  dark: CyberProfile,
  glass: GlassProfile,
  glassmorphism: GlassProfile,
  gradient: GradientProfile,
  classic: ClassicProfile,
  professional: ClassicProfile,
  developer: DeveloperProfile,
};

/**
 * PublicProfileByStyle - For public profile pages
 *
 * PROFILE PICTURE HANDLING (DO NOT MODIFY WITHOUT UNDERSTANDING):
 * ================================================================
 * Profile picture from API may be:
 * - Full URL: https://example.com/media/profile.jpg
 * - Relative path: /media/profile.jpg
 *
 * We normalize to full URL and pass as BOTH profile_picture and
 * profile_picture_preview for template compatibility.
 * Templates use: displayImage = profile_picture_preview || profile_picture
 * ================================================================
 */
const PublicProfileByStyle = () => {
  const { templateStyle } = useContext(PublicTemplateContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUsername || cachedCustomDomainUser;
  const [profileData, setProfileData] = useState(null);

  // DEBUG
  console.log('PublicProfileByStyle:', { username, urlUsername, subdomainUsername, templateStyle });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          // Get profile data from userProfile nested object
          const userProfile = response.data.userProfile || response.data.user_profile || {};
          // Get home content for name/title
          const homeContent = response.data.homeContent || response.data.home_content || {};
          // ============================================================================
          // CRITICAL FIX - DO NOT MODIFY WITHOUT UNDERSTANDING
          // ============================================================================
          // This code handles profile picture URLs for BOTH main domain and subdomains.
          //
          // WHY window.location.origin?
          // - Works on profile2connect.com AND *.profile2connect.com subdomains
          // - Avoids CORS issues by using same-origin URLs
          // - No dependency on environment variables that may not be set in production
          //
          // DO NOT use process.env.REACT_APP_BACKEND_URL here - it defaults to localhost
          // and breaks production deployments on subdomains!
          // ============================================================================
          const currentOrigin = window.location.origin; // e.g., https://raamamoorthy.profile2connect.com
          const resumeDownloadUrl = `${currentOrigin}/api/profile/resume/public/${username}/`;

          // Profile picture URL normalization
          // Backend returns paths like "/media/profiles/image.jpg"
          // We prepend the current origin to create a full URL
          const rawProfilePic = userProfile.profile_picture || response.data.profile_picture;
          let profilePictureUrl = null;
          if (rawProfilePic) {
            if (rawProfilePic.startsWith('http')) {
              // Already a full URL, use as-is
              profilePictureUrl = rawProfilePic;
            } else if (rawProfilePic.startsWith('/')) {
              // Relative path from root - prepend current origin
              profilePictureUrl = currentOrigin + rawProfilePic;
            } else {
              // Relative path without leading slash
              profilePictureUrl = currentOrigin + '/' + rawProfilePic;
            }
          }
          // ============================================================================
          // END CRITICAL FIX
          // ============================================================================

          const newProfileData = {
            name: homeContent.title || userProfile.full_name || userProfile.fullName || response.data.name || username,
            email: userProfile.email || response.data.email,
            phone: userProfile.phone || response.data.phone,
            location: userProfile.location || userProfile.address || response.data.location,
            bio: userProfile.bio || response.data.bio,
            // Pass profile picture URL as BOTH fields for template compatibility
            profile_picture: profilePictureUrl,
            profile_picture_preview: profilePictureUrl,
            job_title: userProfile.job_title || response.data.job_title || response.data.title,
            linkedin: response.data.linkedinLink || response.data.linkedin_link || userProfile.linkedin,
            github: response.data.githubLink || response.data.github_link || userProfile.github,
            // Use the public resume download endpoint URL for CV download
            cv: resumeDownloadUrl,
            // Also keep reference to uploaded CV file if exists
            cv_file: userProfile.cv,
            show_availability: userProfile.show_availability || response.data.show_availability,
            show_download_cv: userProfile.show_download_cv !== false,
            years_of_experience: userProfile.years_experience || response.data.years_of_experience,
            username: username,
          };
          console.log('PublicProfileByStyle: Setting profileData:', newProfileData);
          setProfileData(newProfileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchData();
  }, [username]);

  // Show loading state while data is being fetched
  console.log('PublicProfileByStyle: profileData =', profileData);
  if (!profileData) {
    console.log('PublicProfileByStyle: No profileData, showing loading');
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-white/20 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-white/20 rounded mb-2"></div>
          <div className="h-4 w-32 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  // Get template component - use MinimalProfile as default fallback (not BioSection which uses PreviewContext)
  const normalized = templateStyle?.toLowerCase().replace(/[^a-z]/g, '') || 'minimal';
  const ProfileComponent = styleComponents[normalized] || MinimalProfile;

  return <ProfileComponent data={profileData} />;
};

export default PublicProfileByStyle;
