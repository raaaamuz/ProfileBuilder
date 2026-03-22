import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faDownload, faSpinner, faArrowRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import api from '../../../services/api';
import { PreviewContext } from '../../admin/PreviewContext';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Design presets - these will be selectable
const designPresets = {
  'modern-gradient': {
    wrapper: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    accent: 'from-purple-500 to-pink-500',
    cardBg: 'bg-white/10 backdrop-blur-lg border-white/20',
  },
  'clean-light': {
    wrapper: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'from-blue-600 to-indigo-600',
    cardBg: 'bg-white shadow-xl border-gray-100',
  },
  'warm-sunset': {
    wrapper: 'bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'from-orange-500 to-rose-500',
    cardBg: 'bg-white shadow-xl border-orange-100',
  },
  'ocean-breeze': {
    wrapper: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-900',
    textPrimary: 'text-white',
    textSecondary: 'text-cyan-100/70',
    accent: 'from-cyan-400 to-blue-500',
    cardBg: 'bg-white/10 backdrop-blur-lg border-cyan-500/20',
  },
  'forest-green': {
    wrapper: 'bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-100/70',
    accent: 'from-emerald-400 to-teal-500',
    cardBg: 'bg-white/10 backdrop-blur-lg border-emerald-500/20',
  },
  'minimal-white': {
    wrapper: 'bg-white',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-500',
    accent: 'from-gray-800 to-black',
    cardBg: 'bg-gray-50 border-gray-200',
  },
  'neon-dark': {
    wrapper: 'bg-gray-950',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    accent: 'from-violet-500 to-fuchsia-500',
    cardBg: 'bg-gray-900 border-violet-500/30',
  },
  'rose-gold': {
    wrapper: 'bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-rose-700/70',
    accent: 'from-rose-500 to-amber-500',
    cardBg: 'bg-white shadow-xl border-rose-200',
  },
};

// Helper to extract years of experience from bio text
const extractYearsFromBio = (bio) => {
  if (!bio) return null;
  // Match patterns like "14+ years", "14 years", "13+ years of experience"
  const match = bio.match(/(\d+)\+?\s*years?\s*(of\s+experience)?/i);
  return match ? `${match[1]}+` : null;
};

const BioSection = ({ isAdminPreview = false, isSidebar = false }) => {
  const { liveProfileData, liveProfileDesign, liveHomeData } = useContext(PreviewContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const navigate = useNavigate();
  const isPublicView = !!username;
  const [profile, setProfile] = useState(null);
  const [publicProfileDesign, setPublicProfileDesign] = useState(null);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const isInAdminPreview = isAdminPreview || (!username && window.location.pathname.includes('/dashboard/'));

  // Navigate to contact page
  const handleContactClick = () => {
    if (isPublicView) {
      navigate(`/public/contact/${username}`);
    } else {
      navigate('/contact');
    }
  };

  useEffect(() => {
    const endpoint = isPublicView
      ? `/public/profile/${username}/`
      : '/profile/user-profile/';

    api.get(endpoint)
      .then(async (response) => {
        let data;
        if (isPublicView) {
          data = response.data.user_profile || response.data.userProfile || {};
          // Get full name from title (home content) or homeContent.title
          const fullName = response.data.title ||
                          response.data.homeContent?.title ||
                          response.data.full_name ||
                          response.data.fullName;
          if (fullName && !fullName.toLowerCase().includes('welcome')) {
            data.name = fullName;
          }
          data.facebook = response.data.facebook_link || response.data.facebookLink || data.facebook;
          data.twitter = response.data.twitter_link || response.data.twitterLink || data.twitter;
          data.linkedin = response.data.linkedin_link || response.data.linkedinLink || data.linkedin;
          data.github = response.data.github_link || response.data.githubLink || data.github;
          data.youtube = response.data.youtube_link || response.data.youtubeLink || data.youtube;
          if (response.data.profile_design_config) {
            setPublicProfileDesign(response.data.profile_design_config);
          }
          console.log("BioSection - Profile data with social links:", {
            ...data,
            youtube: data.youtube,
            linkedin: data.linkedin,
            facebook: data.facebook,
            twitter: data.twitter
          });
        } else {
          // For authenticated users, get profile data
          if (Array.isArray(response.data) && response.data.length > 0) {
            data = response.data[0];
          } else {
            data = response.data || {};
          }
          // Also fetch home content to get the display name and social links
          try {
            const homeResponse = await api.get('/home/');
            if (homeResponse.data?.title && !homeResponse.data.title.toLowerCase().includes('welcome')) {
              data.name = homeResponse.data.title;
            }
            // Get social links from home content
            data.youtube = homeResponse.data?.youtube_link || data.youtube;
            data.linkedin = homeResponse.data?.linkedin_link || data.linkedin;
            data.facebook = homeResponse.data?.facebook_link || data.facebook;
            data.twitter = homeResponse.data?.twitter_link || data.twitter;
            console.log("BioSection - Authenticated user social links from /home/:", {
              youtube: data.youtube,
              linkedin: data.linkedin,
              facebook: data.facebook,
              twitter: data.twitter
            });
            // Also get profile design for authenticated view
            const designResponse = await api.get('/profile/design/');
            if (designResponse.data?.design_config) {
              setPublicProfileDesign(designResponse.data.design_config);
            }
          } catch (e) {
            console.log("Could not fetch home/design:", e);
          }
        }
        setProfile(data);
      })
      .catch(error => console.log("Error fetching profile:", error));
  }, [username, isPublicView]);

  const handleDownloadResume = async () => {
    setDownloadingResume(true);
    try {
      // Use public endpoint if viewing someone's profile, otherwise use authenticated endpoint
      const endpoint = username
        ? `/profile/resume/public/${username}/html/`
        : '/profile/resume/html/';

      let html = null;

      try {
        const response = await api.get(endpoint);
        html = response.data.resume_html;
      } catch (err) {
        // If no saved resume, generate one on-the-fly
        if (err.response?.status === 404 && username) {
          console.log("No saved resume, generating on-the-fly...");
          const generateResponse = await api.get(`/public/resume/${username}/`);
          html = generateResponse.data.resume_html;
        } else {
          throw err;
        }
      }

      if (!html) {
        alert("Unable to generate resume. Please try again later.");
        return;
      }

      // Open in new window and trigger print (user can save as PDF)
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();

      // Add print styles for color preservation
      const style = printWindow.document.createElement('style');
      style.textContent = '@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
      printWindow.document.head.appendChild(style);

      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Error generating resume. Please try again later.");
    } finally {
      setDownloadingResume(false);
    }
  };

  const displayProfile = isInAdminPreview ? liveProfileData : profile;

  // Get the active design - from context for admin preview, from API for public
  const activeDesign = isInAdminPreview ? liveProfileDesign : publicProfileDesign;

  // Map the design ID to a preset, or use custom colors
  const getDesignStyles = () => {
    if (!activeDesign) return designPresets['clean-light'];

    // Check if it matches a preset by ID
    const presetId = activeDesign.id || activeDesign.name?.toLowerCase().replace(/\s+/g, '-');
    if (presetId && designPresets[presetId]) {
      return designPresets[presetId];
    }

    // Build custom styles from the design config - check if dark based on background color
    const bgColor = activeDesign.backgroundColor || '#ffffff';
    const isDark = bgColor.match(/^#[0-3]/) ||
                   bgColor.includes('rgb(0') ||
                   bgColor.includes('rgb(1') ||
                   bgColor.includes('rgb(2') ||
                   bgColor.includes('rgb(3');

    return {
      wrapper: '', // Will use customBg instead
      textPrimary: '', // Will use customText
      textSecondary: '', // Will use customTextSecondary
      accent: `from-[${activeDesign.accentColor || '#6366f1'}] to-[${activeDesign.accentColor || '#8b5cf6'}]`,
      cardBg: isDark ? 'bg-white/10 backdrop-blur-lg border-white/20' : 'bg-white shadow-xl border-gray-100',
      customBg: activeDesign.gradient || activeDesign.backgroundColor,
      customText: activeDesign.textColor || (isDark ? '#ffffff' : '#111827'),
      customTextSecondary: activeDesign.textColor ? `${activeDesign.textColor}b3` : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(75,85,99,1)'),
      customAccent: activeDesign.accentColor,
      isDark: isDark,
    };
  };

  const styles = getDesignStyles();

  // Get layout type from design
  const layoutType = activeDesign?.layoutType || 'horizontal';

  if (!displayProfile && !isInAdminPreview) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get full name - check multiple possible field names
  const getFullName = () => {
    // For admin preview, check name from liveProfileData first (set from display_name)
    if (isInAdminPreview && displayProfile?.name && displayProfile.name !== 'Your Name') {
      return displayProfile.name;
    }

    // For admin preview, also check Home content title
    if (isInAdminPreview && liveHomeData?.title && !liveHomeData.title.toLowerCase().includes('welcome')) {
      return liveHomeData.title;
    }

    // Check for display_name field
    if (displayProfile?.display_name) return displayProfile.display_name;

    // Check for full_name or fullName from profile
    if (displayProfile?.full_name) return displayProfile.full_name;
    if (displayProfile?.fullName) return displayProfile.fullName;

    // Check for combined first + last name
    const firstName = displayProfile?.first_name || displayProfile?.firstName || '';
    const lastName = displayProfile?.last_name || displayProfile?.lastName || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    // Check for name field in profile (for public view)
    if (displayProfile?.name && displayProfile.name !== displayProfile?.email?.split('@')[0]) {
      return displayProfile.name;
    }

    // Check for title field (often contains the full name in home content)
    if (displayProfile?.title && !displayProfile.title.toLowerCase().includes('welcome')) {
      return displayProfile.title;
    }

    // Fallback to username (formatted nicely)
    if (displayProfile?.username) {
      // Capitalize first letter of username
      return displayProfile.username.charAt(0).toUpperCase() + displayProfile.username.slice(1);
    }

    return "Your Name";
  };

  const name = getFullName();
  const rawBio = displayProfile?.bio || "Welcome to my portfolio. I'm passionate about creating amazing digital experiences.";
  const role = displayProfile?.job_title || displayProfile?.title || displayProfile?.role || "Professional";
  const yearsExperience = displayProfile?.years_experience || extractYearsFromBio(rawBio) || '10+';
  const location = displayProfile?.location || displayProfile?.address;

  // Process bio to remove template placeholders like {{linkedin}}, {{facebook}}, etc.
  const processBio = (bioText) => {
    if (!bioText) return bioText;
    // Remove all template placeholders - they show as icons instead
    return bioText
      .replace(/\{\{linkedin\}\}/gi, '')
      .replace(/\{\{facebook\}\}/gi, '')
      .replace(/\{\{youtube\}\}/gi, '')
      .replace(/\{\{twitter\}\}/gi, '')
      .replace(/\{\{github\}\}/gi, '')
      .trim();
  };

  const bio = processBio(rawBio);

  // Handle image URL - check various possible field names and formats
  const getImageUrl = () => {
    if (isInAdminPreview && liveProfileData?.profile_picture_preview) {
      return liveProfileData.profile_picture_preview;
    }

    const profilePic = displayProfile?.profile_picture || displayProfile?.profilePicture || displayProfile?.image || displayProfile?.avatar;

    if (!profilePic) {
      return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=6366f1&color=fff&size=256';
    }

    // If it's already a full URL, use it directly
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://') || profilePic.startsWith('data:')) {
      return profilePic;
    }

    // Otherwise, prepend the backend URL
    return `http://localhost:8000${profilePic.startsWith('/') ? '' : '/'}${profilePic}`;
  };

  const image = getImageUrl();

  // Check if using dark theme - from styles or from design config
  const isDarkTheme = styles.isDark || styles.wrapper?.includes('900') || styles.wrapper?.includes('950') || styles.wrapper?.includes('slate-9');

  // Get text colors - prefer inline styles from design config
  const textPrimaryStyle = styles.customText ? { color: styles.customText } : {};
  const textSecondaryStyle = styles.customTextSecondary ? { color: styles.customTextSecondary } : {};

  // Common components
  const StatusBadge = () => {
    // Check if show_availability is enabled (default to true if not set)
    const showAvailability = displayProfile?.show_availability !== false;
    if (!showAvailability) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6`}
        style={{
          background: isDarkTheme ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
          borderColor: 'rgba(16, 185, 129, 0.6)'
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <span className="text-sm font-bold text-emerald-300">
          Available for opportunities
        </span>
      </motion.div>
    );
  };

  const SocialLinks = ({ centered = false }) => {
    const socialLinks = [
      { url: displayProfile?.linkedin, icon: faLinkedin },
      { url: displayProfile?.facebook, icon: faFacebook },
      { url: displayProfile?.youtube, icon: faYoutube },
      { url: displayProfile?.twitter, icon: faTwitter },
      { url: displayProfile?.github, icon: faGithub },
    ].filter(s => s.url && s.url.trim() !== '');

    if (socialLinks.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
      >
        <span className="text-sm" style={textSecondaryStyle}>Connect</span>
        <div className="h-px flex-1 max-w-[60px]" style={{ background: isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} />
        <div className="flex gap-3">
          {socialLinks.map((social, idx) => (
            <motion.a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }}
              className={`w-10 h-10 ${styles.cardBg || 'bg-white/10 backdrop-blur-lg'} border rounded-xl flex items-center justify-center`} style={textSecondaryStyle}>
              <FontAwesomeIcon icon={social.icon} />
            </motion.a>
          ))}
        </div>
      </motion.div>
    );
  };

  const CTAButtons = ({ centered = false }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      className={`flex flex-wrap gap-4 mb-8 ${centered ? 'justify-center' : ''}`}>
      <motion.button onClick={handleContactClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className="group px-6 py-3 rounded-xl text-white font-semibold shadow-lg flex items-center gap-2 cursor-pointer"
        style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>
        <FontAwesomeIcon icon={faEnvelope} />Get in Touch
        <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>
      {displayProfile?.show_download_cv !== false && (
        <motion.button onClick={handleDownloadResume} disabled={downloadingResume} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className={`px-6 py-3 ${styles.cardBg || 'bg-white/10 backdrop-blur-lg'} border rounded-xl font-semibold flex items-center gap-2`} style={textPrimaryStyle}>
          <FontAwesomeIcon icon={downloadingResume ? faSpinner : faDownload} spin={downloadingResume} />
          {downloadingResume ? "Downloading..." : "Download CV"}
        </motion.button>
      )}
    </motion.div>
  );

  const ProfileImage = ({ size = 'normal' }) => {
    const sizeClasses = size === 'large' ? 'w-80 h-80 md:w-96 md:h-96' : size === 'small' ? 'w-48 h-48 md:w-56 md:h-56' : 'w-64 h-64 md:w-72 md:h-72';
    const ringSize = size === 'large' ? 'w-88 h-88 md:w-[26rem] md:h-[26rem]' : size === 'small' ? 'w-56 h-56 md:w-64 md:h-64' : 'w-72 h-72 md:w-80 md:h-80';
    return (
      <div className="relative">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className={`absolute inset-0 ${ringSize}`}>
          <div className="absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }} />
        </motion.div>
        <div className={`relative ${sizeClasses}`}>
          <div className="absolute inset-0 rounded-full p-1" style={{ background: styles.customAccent || 'linear-gradient(to top right, #6366f1, #8b5cf6)' }}>
            <div className="w-full h-full rounded-full p-1" style={{ background: isDarkTheme ? '#111827' : '#ffffff' }}>
              <img src={image} alt={name} className="w-full h-full object-cover rounded-full"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256`; }} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
            className="absolute -right-2 top-8 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>{yearsExperience} Years Exp</motion.div>
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
            className={`absolute -left-2 bottom-12 ${styles.cardBg || 'bg-white/10 backdrop-blur-lg'} border px-4 py-2 rounded-full text-sm font-bold`} style={textPrimaryStyle}>{role}</motion.div>
        </div>
      </div>
    );
  };

  // CENTERED LAYOUT
  const CenteredLayout = () => (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center mb-8">
        <ProfileImage size="normal" />
      </motion.div>
      <StatusBadge />
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl lg:text-6xl font-black mb-4" style={textPrimaryStyle}>
        Hi, I'm <span style={{ color: styles.customAccent || '#8b5cf6' }}>{name}</span>
      </motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-3 mb-6">
        <div className="h-0.5 w-12" style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }} />
        <span className="text-xl" style={textSecondaryStyle}>{role}</span>
        <div className="h-0.5 w-12" style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }} />
      </motion.div>
      {location && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex items-center justify-center gap-2 mb-4" style={textSecondaryStyle}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" /><span className="text-sm">{location}</span>
        </motion.div>
      )}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={textSecondaryStyle}>{bio}</motion.p>
      <CTAButtons centered />
      <SocialLinks centered />
    </div>
  );

  // SPLIT LAYOUT
  const SplitLayout = () => (
    <div className="relative z-10 min-h-[70vh] flex">
      <div className="w-1/2 flex items-center justify-center p-8" style={{ background: isDarkTheme ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)' }}>
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <ProfileImage size="large" />
        </motion.div>
      </div>
      <div className="w-1/2 flex items-center p-12">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <StatusBadge />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-black mb-4" style={textPrimaryStyle}>
            {name}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 mb-6">
            <div className="h-1 w-16 rounded" style={{ background: styles.customAccent || '#8b5cf6' }} />
            <span className="text-xl font-medium" style={{ color: styles.customAccent || '#8b5cf6' }}>{role}</span>
          </motion.div>
          {location && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex items-center gap-2 mb-4" style={textSecondaryStyle}>
              <FontAwesomeIcon icon={faMapMarkerAlt} /><span>{location}</span>
            </motion.div>
          )}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg leading-relaxed mb-8" style={textSecondaryStyle}>{bio}</motion.p>
          <CTAButtons />
          <SocialLinks />
        </motion.div>
      </div>
    </div>
  );

  // MINIMAL LAYOUT
  const MinimalLayout = () => (
    <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-32">
      <div className="flex items-center gap-8 mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-full overflow-hidden border-2" style={{ borderColor: styles.customAccent || '#6366f1' }}>
          <img src={image} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256`; }} />
        </motion.div>
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold" style={textPrimaryStyle}>{name}</motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-lg" style={{ color: styles.customAccent || '#8b5cf6' }}>{role}</motion.p>
        </div>
      </div>
      {location && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex items-center gap-2 mb-6" style={textSecondaryStyle}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" /><span className="text-sm">{location}</span>
        </motion.div>
      )}
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg leading-relaxed mb-8 border-l-4 pl-6" style={{ ...textSecondaryStyle, borderColor: styles.customAccent || '#6366f1' }}>{bio}</motion.p>
      <CTAButtons />
      <SocialLinks />
    </div>
  );

  // CREATIVE LAYOUT
  const CreativeLayout = () => (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-3 gap-8 items-center">
        <motion.div initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 0.6 }}
          className={`lg:col-span-1 ${styles.cardBg} border rounded-3xl p-8 text-center flex flex-col items-center justify-center`}>
          <div className="w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border-4" style={{ borderColor: styles.customAccent || '#6366f1' }}>
            <img src={image} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256`; }} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 break-words leading-tight" style={{ ...textPrimaryStyle, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{name}</h2>
          <p className="font-medium mb-4" style={{ color: styles.customAccent || '#8b5cf6' }}>{role}</p>
          {location && <p className="text-sm" style={textSecondaryStyle}><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{location}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
          <StatusBadge />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl lg:text-6xl font-black mb-6" style={textPrimaryStyle}>
            Hi, I'm <span style={{ color: styles.customAccent || '#8b5cf6' }}>{name}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg leading-relaxed mb-8" style={textSecondaryStyle}>{bio}</motion.p>
          <CTAButtons />
          <SocialLinks />
        </motion.div>
      </div>
    </div>
  );

  // HORIZONTAL LAYOUT (Default) - Full layout with photo
  const HorizontalLayout = () => (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
          <StatusBadge />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4" style={textPrimaryStyle}>
            Hi, I'm <span style={{ color: styles.customAccent || '#8b5cf6' }}>{name}</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 mb-6">
            <div className="h-0.5 w-12" style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }} />
            <span className="text-xl" style={textSecondaryStyle}>{role}</span>
          </motion.div>
          {location && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex items-center gap-2 mb-4" style={textSecondaryStyle}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" /><span className="text-sm">{location}</span>
            </motion.div>
          )}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-lg leading-relaxed mb-8" style={textSecondaryStyle}>{bio}</motion.p>
          <CTAButtons />
          <SocialLinks />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="order-1 lg:order-2 flex justify-center">
          <ProfileImage />
        </motion.div>
      </div>
    </div>
  );

  // SIDEBAR LAYOUT - Compact vertical layout for fixed sidebar
  const SidebarLayout = () => {
    return (
      <div className="relative z-10 flex flex-col px-5 py-4 h-full">
        {/* Profile Image */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-3">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full p-0.5" style={{ background: styles.customAccent || 'linear-gradient(to top right, #6366f1, #8b5cf6)' }}>
              <div className="w-full h-full rounded-full p-0.5" style={{ background: isDarkTheme ? '#111827' : '#ffffff' }}>
                <img src={image} alt={name} className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256`; }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Name & Role */}
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-2">
          <h1 className="text-lg font-bold mb-0.5" style={textPrimaryStyle}>{name}</h1>
          <p className="text-xs font-medium" style={{ color: styles.customAccent || '#8b5cf6' }}>{role}</p>
          {location && (
            <p className="text-xs mt-0.5 flex items-center justify-center gap-1" style={textSecondaryStyle}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />{location}
            </p>
          )}
        </motion.div>

        {/* Status Badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center mb-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border"
            style={{ background: isDarkTheme ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.6)', fontSize: '0.7rem' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span className="font-semibold text-emerald-300">Available</span>
          </div>
        </motion.div>

        {/* Bio - scrollable area */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-3 flex-1 overflow-y-auto min-h-0">
          <p className="text-xs leading-relaxed text-center" style={textSecondaryStyle}>{bio}</p>
        </motion.div>

        {/* CTA Buttons - Always visible at bottom */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-1.5 flex-shrink-0">
          <motion.button onClick={handleContactClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-3 rounded-lg text-white font-semibold shadow-lg flex items-center justify-center gap-2 cursor-pointer text-xs"
            style={{ background: styles.customAccent || 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>
            <FontAwesomeIcon icon={faEnvelope} />Get in Touch
            <FontAwesomeIcon icon={faArrowRight} />
          </motion.button>
          <motion.button onClick={handleDownloadResume} disabled={downloadingResume} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className={`w-full py-2 px-3 ${styles.cardBg || 'bg-white/10 backdrop-blur-lg'} border rounded-lg font-semibold flex items-center justify-center gap-2 text-xs`}
            style={textPrimaryStyle}>
            <FontAwesomeIcon icon={downloadingResume ? faSpinner : faDownload} spin={downloadingResume} />
            {downloadingResume ? "Downloading..." : "Download CV"}
          </motion.button>
        </motion.div>

        {/* Social Links - Only show if link exists */}
        {(() => {
          const sidebarLinks = [
            { url: displayProfile?.linkedin, icon: faLinkedin },
            { url: displayProfile?.facebook, icon: faFacebook },
            { url: displayProfile?.youtube, icon: faYoutube },
            { url: displayProfile?.twitter, icon: faTwitter },
            { url: displayProfile?.github, icon: faGithub },
          ].filter(s => s.url && s.url.trim() !== '');

          if (sidebarLinks.length === 0) return null;

          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="border-t pt-3 mt-3 flex-shrink-0" style={{ borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <div className="flex justify-center gap-2">
                {sidebarLinks.map((social, idx) => (
                  <motion.a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 ${styles.cardBg || 'bg-white/10'} border rounded-lg flex items-center justify-center text-sm`}
                    style={textSecondaryStyle}>
                    <FontAwesomeIcon icon={social.icon} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </div>
    );
  };

  // Background wrapper for all layouts
  const BackgroundWrapper = ({ children }) => (
    <div className={`relative ${isSidebar ? 'h-full min-h-screen' : 'min-h-[70vh]'} ${styles.wrapper || ''} overflow-hidden`} style={styles.customBg ? { background: styles.customBg } : {}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: styles.customAccent ? `linear-gradient(135deg, ${styles.customAccent}, ${styles.customAccent}80)` : undefined }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: styles.customAccent ? `linear-gradient(135deg, ${styles.customAccent}, ${styles.customAccent}80)` : undefined }} />
        {isDarkTheme && <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]" />}
        {!isDarkTheme && <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />}
      </div>
      {children}
    </div>
  );

  // Render based on layout type
  const renderLayout = () => {
    // Use sidebar layout when in sidebar mode
    if (isSidebar) {
      return <SidebarLayout />;
    }

    switch (layoutType) {
      case 'centered':
        return <CenteredLayout />;
      case 'split':
        return <SplitLayout />;
      case 'minimal':
        return <MinimalLayout />;
      case 'creative':
        return <CreativeLayout />;
      case 'horizontal':
      default:
        return <HorizontalLayout />;
    }
  };

  return (
    <BackgroundWrapper>
      {renderLayout()}
    </BackgroundWrapper>
  );
};

export default BioSection;
