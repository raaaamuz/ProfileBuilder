import { createContext, useState, useCallback, useEffect } from 'react';
import api from '../../services/api';

export const PreviewContext = createContext();

export const PreviewProvider = ({ children }) => {
  // This state holds preview data for each page, e.g., { home: '...', profile: '...', ... }
  const [previewData, setPreviewData] = useState({});

  // Selected template state
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  // AI Designs state
  const [careerAiDesigns, setCareerAiDesigns] = useState([]);
  const [educationAiDesigns, setEducationAiDesigns] = useState([]);
  const [profileAiDesigns, setProfileAiDesigns] = useState([]);
  const [awardsAiDesigns, setAwardsAiDesigns] = useState([]);
  const [skillsAiDesigns, setSkillsAiDesigns] = useState([]);
  const [isGeneratingDesigns, setIsGeneratingDesigns] = useState(false);

  // Live profile design config
  const [liveProfileDesign, setLiveProfileDesign] = useState(null);

  // Live profile data for real-time preview
  const [liveProfileData, setLiveProfileData] = useState({
    email: '',
    phone: '',
    location: '',
    bio: '',
    profile_picture: null,
    profile_picture_preview: null,
    cv: null,
    facebook: '',
    twitter: '',
    linkedin: '',
    name: 'User Name',
  });

  // Live home data for real-time preview
  const [liveHomeData, setLiveHomeData] = useState({
    title: 'Welcome to Our Website',
    description: 'Bringing you the best experience.',
    background_video: null,
    youtube_link: '',
    linkedin_link: '',
    facebook_link: '',
    twitter_link: '',
    customSettings: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
      fontFamily: 'Arial',
    },
  });

  // Live education design config
  const [liveEducationDesign, setLiveEducationDesign] = useState(null);

  // Live education entries for real-time preview
  const [liveEducationData, setLiveEducationData] = useState([]);

  // Live career design config
  const [liveCareerDesign, setLiveCareerDesign] = useState(null);

  // Live awards design config
  const [liveAwardsDesign, setLiveAwardsDesign] = useState(null);

  // Live awards data for real-time preview
  const [liveAwardsData, setLiveAwardsData] = useState([]);

  // Live career entries for real-time preview
  const [liveCareerData, setLiveCareerData] = useState([]);

  // Live skills data for real-time preview
  const [liveSkillsData, setLiveSkillsData] = useState([]);
  const [liveSkillsDesign, setLiveSkillsDesign] = useState(null);

  // Live blog data for real-time preview
  const [liveBlogData, setLiveBlogData] = useState(null);
  const [liveBlogList, setLiveBlogList] = useState([]);

  // Live resume data for real-time preview
  const [liveResumeHtml, setLiveResumeHtml] = useState(null);
  const [liveResumeTemplate, setLiveResumeTemplate] = useState('professional');

  // Resume section layout for local reordering
  const [liveResumeSections, setLiveResumeSections] = useState({
    sidebar: [{ key: 'skills', enabled: true }, { key: 'education', enabled: true }],
    main: [
      { key: 'summary', enabled: true },
      { key: 'experience', enabled: true },
      { key: 'awards', enabled: true },
      { key: 'achievements', enabled: true }
    ]
  });

  // Resume layout modal visibility
  const [showResumeLayoutModal, setShowResumeLayoutModal] = useState(false);

  // Resume generation callback (set by AdminResume)
  const [resumeGenerateCallback, setResumeGenerateCallback] = useState(null);
  const [resumeGenerating, setResumeGenerating] = useState(false);
  const [resumeCanGenerate, setResumeCanGenerate] = useState(true);

  // Live services data for real-time preview
  const [liveServicesData, setLiveServicesData] = useState([]);

  // Live testimonials data for real-time preview
  const [liveTestimonialsData, setLiveTestimonialsData] = useState([]);

  // Tab navigation state for sections with tabs
  const [sectionTabs, setSectionTabs] = useState({
    tabs: [],           // Array of tab keys
    activeTab: null,    // Current active tab key
    setActiveTab: null  // Function to set active tab
  });

  // Register section tabs (called by components with tabs like AdminHome)
  const registerSectionTabs = useCallback((tabs, activeTab, setActiveTab) => {
    setSectionTabs({ tabs, activeTab, setActiveTab });
  }, []);

  // Clear section tabs (called when leaving a tabbed section)
  const clearSectionTabs = useCallback(() => {
    setSectionTabs({ tabs: [], activeTab: null, setActiveTab: null });
  }, []);

  // Navigate to next tab, returns true if moved to next tab, false if at last tab
  const goToNextTab = useCallback(() => {
    if (sectionTabs.tabs.length === 0 || !sectionTabs.setActiveTab) {
      return false; // No tabs registered
    }
    const currentIndex = sectionTabs.tabs.findIndex(t => t === sectionTabs.activeTab);
    if (currentIndex < sectionTabs.tabs.length - 1) {
      sectionTabs.setActiveTab(sectionTabs.tabs[currentIndex + 1]);
      return true; // Moved to next tab
    }
    return false; // At last tab
  }, [sectionTabs]);

  // Update live profile data (called from AdminProfile on every change)
  const updateLiveProfile = useCallback((data) => {
    setLiveProfileData(prev => ({ ...prev, ...data }));
  }, []);

  // Update live home data (called from AdminHome on every change)
  const updateLiveHome = useCallback((data) => {
    setLiveHomeData(prev => ({ ...prev, ...data }));
  }, []);

  // Update education design
  const updateEducationDesign = useCallback((design) => {
    setLiveEducationDesign(design);
  }, []);

  // Update education entries
  const updateEducationData = useCallback((entries) => {
    setLiveEducationData(entries);
  }, []);

  // Update career design
  const updateCareerDesign = useCallback((design) => {
    setLiveCareerDesign(design);
  }, []);

  // Update career entries
  const updateCareerData = useCallback((entries) => {
    setLiveCareerData(entries);
  }, []);

  // Update awards design
  const updateAwardsDesign = useCallback((design) => {
    setLiveAwardsDesign(design);
  }, []);

  // Update profile design
  const updateProfileDesign = useCallback((design) => {
    setLiveProfileDesign(design);
  }, []);

  // Update live skills data
  const updateLiveSkills = useCallback((skills) => {
    setLiveSkillsData(skills);
  }, []);

  // Update live skills design
  const updateLiveSkillsDesign = useCallback((design) => {
    setLiveSkillsDesign(design);
  }, []);

  // Update live awards data
  const updateLiveAwards = useCallback((awards) => {
    setLiveAwardsData(awards);
  }, []);

  // Update live blog data (selected post for preview)
  const updateLiveBlog = useCallback((blog) => {
    setLiveBlogData(blog);
  }, []);

  // Update live blog list
  const updateLiveBlogList = useCallback((blogs) => {
    setLiveBlogList(blogs);
  }, []);

  // Update live services data
  const updateLiveServices = useCallback((services) => {
    setLiveServicesData(services);
  }, []);

  // Update live testimonials data
  const updateLiveTestimonials = useCallback((testimonials) => {
    setLiveTestimonialsData(testimonials);
  }, []);

  // Update resume data
  const updateResumeData = useCallback((html) => {
    setLiveResumeHtml(html);
  }, []);

  // Update resume template
  const updateResumeTemplate = useCallback((template) => {
    setLiveResumeTemplate(template);
  }, []);

  // Update resume section layout (for local reordering)
  const updateResumeSections = useCallback((sections) => {
    setLiveResumeSections(sections);
  }, []);

  // Style-specific design collections - each template style has unique designs
  const styleDesignSets = {
    // MINIMAL style designs - clean, whitespace, subtle
    minimal: {
      education: [
        { id: 'minimal-clean', name: 'Clean List', layoutType: 'cards', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#6b7280', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 8, spacing: 'compact' },
        { id: 'minimal-border', name: 'Bordered Cards', layoutType: 'cards', backgroundColor: '#ffffff', textColor: '#1f2937', accentColor: '#374151', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 12, spacing: 'normal' },
        { id: 'minimal-timeline', name: 'Simple Timeline', layoutType: 'timeline', backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#4b5563', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 4, spacing: 'relaxed' },
        { id: 'minimal-subtle', name: 'Subtle Shadow', layoutType: 'cards', backgroundColor: '#ffffff', textColor: '#374151', accentColor: '#9ca3af', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 8, spacing: 'normal' },
      ],
      career: [
        { id: 'minimal-career-list', name: 'Clean Experience', layoutType: 'timeline', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#6b7280', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 8 },
        { id: 'minimal-career-cards', name: 'Card Layout', layoutType: 'cards', backgroundColor: '#ffffff', textColor: '#1f2937', accentColor: '#374151', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 12 },
        { id: 'minimal-career-stack', name: 'Stacked View', layoutType: 'stacked', backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#4b5563', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 4 },
        { id: 'minimal-career-elegant', name: 'Elegant Timeline', layoutType: 'timeline', backgroundColor: '#ffffff', textColor: '#374151', accentColor: '#9ca3af', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 8 },
      ],
      profile: [
        { id: 'minimal-profile-h', name: 'Horizontal Clean', layoutType: 'horizontal', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#6b7280', nameColor: '#111827', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 8, imageStyle: 'circle' },
        { id: 'minimal-profile-c', name: 'Centered Minimal', layoutType: 'centered', backgroundColor: '#ffffff', textColor: '#1f2937', accentColor: '#374151', nameColor: '#000000', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 12, imageStyle: 'circle' },
        { id: 'minimal-profile-split', name: 'Split Layout', layoutType: 'split', backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#4b5563', nameColor: '#18181b', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 4, imageStyle: 'rounded' },
      ],
      awards: [
        { id: 'minimal-awards-grid', name: 'Simple Grid', layoutType: 'grid', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#6b7280', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 8 },
        { id: 'minimal-awards-list', name: 'Clean List', layoutType: 'list', backgroundColor: '#ffffff', textColor: '#1f2937', accentColor: '#374151', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 12 },
      ],
      skills: [
        { id: 'minimal-skills', name: 'Clean Skills', layoutType: 'cards', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#6b7280', fontFamily: 'Inter, sans-serif', barStyle: 'thin', showPercentage: false },
      ],
    },

    // DARK style designs - high contrast, bold typography
    dark: {
      education: [
        { id: 'dark-neon-cyber', name: 'Cyber Neon', layoutType: 'alternating', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, glowEffect: true },
        { id: 'dark-purple-haze', name: 'Purple Haze', layoutType: 'journey', backgroundColor: '#0f0f23', textColor: '#e2e8f0', accentColor: '#a855f7', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24 },
        { id: 'dark-midnight', name: 'Midnight Cards', layoutType: 'cards', backgroundColor: '#111827', textColor: '#f9fafb', accentColor: '#3b82f6', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16 },
        { id: 'dark-charcoal', name: 'Charcoal Timeline', layoutType: 'timeline', backgroundColor: '#1f2937', textColor: '#f3f4f6', accentColor: '#22d3ee', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 12 },
      ],
      career: [
        { id: 'dark-career-neon', name: 'Neon Timeline', layoutType: 'timeline', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 16, glowEffect: true },
        { id: 'dark-career-purple', name: 'Purple Flow', layoutType: 'cards', backgroundColor: '#0f0f23', textColor: '#e2e8f0', accentColor: '#a855f7', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20 },
        { id: 'dark-career-stack', name: 'Dark Stack', layoutType: 'stacked', backgroundColor: '#111827', textColor: '#f9fafb', accentColor: '#3b82f6', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16 },
        { id: 'dark-career-cyan', name: 'Cyan Accent', layoutType: 'timeline', backgroundColor: '#1f2937', textColor: '#f3f4f6', accentColor: '#22d3ee', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 12 },
      ],
      profile: [
        { id: 'dark-profile-neon', name: 'Neon Glow', layoutType: 'centered', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', nameColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, imageStyle: 'rounded', glowEffect: true },
        { id: 'dark-profile-purple', name: 'Purple Dark', layoutType: 'horizontal', backgroundColor: '#0f0f23', textColor: '#e2e8f0', accentColor: '#a855f7', nameColor: '#c4b5fd', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'circle' },
        { id: 'dark-profile-midnight', name: 'Midnight Blue', layoutType: 'horizontal', backgroundColor: '#111827', textColor: '#f9fafb', accentColor: '#3b82f6', nameColor: '#60a5fa', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16, imageStyle: 'circle' },
      ],
      awards: [
        { id: 'dark-awards-neon', name: 'Neon Trophies', layoutType: 'grid', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, glowEffect: true },
        { id: 'dark-awards-purple', name: 'Purple Glory', layoutType: 'grid', backgroundColor: '#0f0f23', textColor: '#e2e8f0', accentColor: '#a855f7', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24 },
      ],
      skills: [
        { id: 'dark-skills-neon', name: 'Neon Skills', layoutType: 'cards', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', barStyle: 'glow', showPercentage: true },
      ],
    },

    // GLASSMORPHISM style designs - blur, glass, transparency
    glassmorphism: {
      education: [
        { id: 'glass-neon-green', name: 'Neon Glass', layoutType: 'floating', backgroundColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, glowEffect: true, gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
        { id: 'glass-aurora', name: 'Aurora Glass', layoutType: 'cards', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 28, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'glass-ocean', name: 'Ocean Blur', layoutType: 'alternating', backgroundColor: '#0c1929', textColor: '#e0f2fe', accentColor: '#22d3ee', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20, gradient: 'linear-gradient(180deg, #0369a1 0%, #0c4a6e 100%)' },
        { id: 'glass-pink', name: 'Pink Frost', layoutType: 'journey', backgroundColor: '#18181b', textColor: '#fce7f3', accentColor: '#f472b6', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, gradient: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)' },
      ],
      career: [
        { id: 'glass-career-neon', name: 'Neon Glass Flow', layoutType: 'timeline', backgroundColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, glowEffect: true },
        { id: 'glass-career-aurora', name: 'Aurora Timeline', layoutType: 'cards', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 28 },
        { id: 'glass-career-ocean', name: 'Ocean Glass', layoutType: 'stacked', backgroundColor: '#0c1929', textColor: '#e0f2fe', accentColor: '#22d3ee', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20 },
        { id: 'glass-career-pink', name: 'Pink Glass', layoutType: 'timeline', backgroundColor: '#18181b', textColor: '#fce7f3', accentColor: '#f472b6', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24 },
      ],
      profile: [
        { id: 'glass-profile-neon', name: 'Neon Blur', layoutType: 'horizontal', backgroundColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#00ff88', nameColor: '#00ff88', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'rounded', glowEffect: true },
        { id: 'glass-profile-aurora', name: 'Aurora Profile', layoutType: 'centered', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', nameColor: '#c4b5fd', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 28, imageStyle: 'circle' },
        { id: 'glass-profile-ocean', name: 'Ocean Glass', layoutType: 'horizontal', backgroundColor: '#0c1929', textColor: '#e0f2fe', accentColor: '#22d3ee', nameColor: '#67e8f9', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'circle' },
      ],
      awards: [
        { id: 'glass-awards-neon', name: 'Neon Achievements', layoutType: 'grid', backgroundColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, glowEffect: true },
        { id: 'glass-awards-aurora', name: 'Aurora Awards', layoutType: 'grid', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 28 },
      ],
      skills: [
        { id: 'glass-skills', name: 'Glass Skills', layoutType: 'cards', backgroundColor: '#1a1a2e', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'Inter, sans-serif', barStyle: 'glassmorphism', showPercentage: true },
      ],
    },

    // GRADIENT style designs - bold gradients, colorful
    gradient: {
      education: [
        { id: 'grad-purple-pink', name: 'Purple Pink Gradient', layoutType: 'cards', backgroundColor: '#667eea', textColor: '#ffffff', accentColor: '#ffffff', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'grad-sunset', name: 'Sunset Flow', layoutType: 'journey', backgroundColor: '#f97316', textColor: '#ffffff', accentColor: '#fef3c7', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24, gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
        { id: 'grad-ocean', name: 'Ocean Wave', layoutType: 'alternating', backgroundColor: '#0ea5e9', textColor: '#ffffff', accentColor: '#e0f2fe', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16, gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' },
        { id: 'grad-forest', name: 'Forest Green', layoutType: 'cards', backgroundColor: '#22c55e', textColor: '#ffffff', accentColor: '#dcfce7', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 20, gradient: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)' },
      ],
      career: [
        { id: 'grad-career-purple', name: 'Purple Gradient', layoutType: 'timeline', backgroundColor: '#667eea', textColor: '#ffffff', accentColor: '#ffffff', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'grad-career-sunset', name: 'Sunset Career', layoutType: 'cards', backgroundColor: '#f97316', textColor: '#ffffff', accentColor: '#fef3c7', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24 },
        { id: 'grad-career-ocean', name: 'Ocean Gradient', layoutType: 'stacked', backgroundColor: '#0ea5e9', textColor: '#ffffff', accentColor: '#e0f2fe', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16 },
      ],
      profile: [
        { id: 'grad-profile-purple', name: 'Purple Split', layoutType: 'split', backgroundColor: '#667eea', textColor: '#ffffff', accentColor: '#ffffff', nameColor: '#ffffff', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, imageStyle: 'circle', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'grad-profile-sunset', name: 'Sunset Profile', layoutType: 'centered', backgroundColor: '#f97316', textColor: '#ffffff', accentColor: '#fef3c7', nameColor: '#ffffff', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24, imageStyle: 'rounded' },
        { id: 'grad-profile-ocean', name: 'Ocean Profile', layoutType: 'horizontal', backgroundColor: '#0ea5e9', textColor: '#ffffff', accentColor: '#e0f2fe', nameColor: '#ffffff', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16, imageStyle: 'circle' },
      ],
      awards: [
        { id: 'grad-awards-purple', name: 'Purple Awards', layoutType: 'grid', backgroundColor: '#667eea', textColor: '#ffffff', accentColor: '#ffffff', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'grad-awards-sunset', name: 'Sunset Trophies', layoutType: 'grid', backgroundColor: '#f97316', textColor: '#ffffff', accentColor: '#fef3c7', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24 },
      ],
      skills: [
        { id: 'grad-skills', name: 'Gradient Skills', backgroundColor: '#667eea', textColor: '#ffffff', accentColor: '#ffffff', fontFamily: 'Poppins, sans-serif', barStyle: 'gradient', showPercentage: true },
      ],
    },

    // COLORFUL style designs - vibrant, playful
    colorful: {
      education: [
        { id: 'color-rainbow', name: 'Rainbow Cards', layoutType: 'cards', backgroundColor: '#fef3c7', textColor: '#1f2937', accentColor: '#f97316', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24 },
        { id: 'color-mint-fresh', name: 'Mint Fresh', layoutType: 'floating', backgroundColor: '#d1fae5', textColor: '#065f46', accentColor: '#10b981', fontFamily: 'DM Sans, sans-serif', cardStyle: 'bordered', borderRadius: 20 },
        { id: 'color-candy', name: 'Candy Pop', layoutType: 'journey', backgroundColor: '#fce7f3', textColor: '#831843', accentColor: '#ec4899', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 28 },
        { id: 'color-sky', name: 'Sky Blue', layoutType: 'alternating', backgroundColor: '#e0f2fe', textColor: '#0c4a6e', accentColor: '#0ea5e9', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 16 },
      ],
      career: [
        { id: 'color-career-rainbow', name: 'Rainbow Timeline', layoutType: 'timeline', backgroundColor: '#fef3c7', textColor: '#1f2937', accentColor: '#f97316', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24 },
        { id: 'color-career-mint', name: 'Mint Career', layoutType: 'cards', backgroundColor: '#d1fae5', textColor: '#065f46', accentColor: '#10b981', fontFamily: 'DM Sans, sans-serif', cardStyle: 'bordered', borderRadius: 20 },
        { id: 'color-career-candy', name: 'Candy Career', layoutType: 'stacked', backgroundColor: '#fce7f3', textColor: '#831843', accentColor: '#ec4899', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 28 },
      ],
      profile: [
        { id: 'color-profile-rainbow', name: 'Rainbow Profile', layoutType: 'centered', backgroundColor: '#fef3c7', textColor: '#1f2937', accentColor: '#f97316', nameColor: '#c2410c', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24, imageStyle: 'circle' },
        { id: 'color-profile-mint', name: 'Mint Fresh', layoutType: 'horizontal', backgroundColor: '#d1fae5', textColor: '#065f46', accentColor: '#10b981', nameColor: '#047857', fontFamily: 'DM Sans, sans-serif', cardStyle: 'bordered', borderRadius: 20, imageStyle: 'rounded' },
        { id: 'color-profile-candy', name: 'Candy Pop', layoutType: 'centered', backgroundColor: '#fce7f3', textColor: '#831843', accentColor: '#ec4899', nameColor: '#be185d', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 28, imageStyle: 'circle' },
      ],
      awards: [
        { id: 'color-awards-rainbow', name: 'Rainbow Awards', layoutType: 'grid', backgroundColor: '#fef3c7', textColor: '#1f2937', accentColor: '#f97316', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24 },
        { id: 'color-awards-candy', name: 'Candy Trophies', layoutType: 'grid', backgroundColor: '#fce7f3', textColor: '#831843', accentColor: '#ec4899', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 28 },
      ],
      skills: [
        { id: 'color-skills', name: 'Colorful Skills', backgroundColor: '#fef3c7', textColor: '#1f2937', accentColor: '#f97316', fontFamily: 'Poppins, sans-serif', barStyle: 'rounded', showPercentage: true },
      ],
    },

    // PROFESSIONAL style designs - classic, elegant
    professional: {
      education: [
        { id: 'pro-classic', name: 'Classic Blue', layoutType: 'timeline', backgroundColor: '#f8fafc', textColor: '#1e293b', accentColor: '#1e40af', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8 },
        { id: 'pro-navy', name: 'Navy Professional', layoutType: 'cards', backgroundColor: '#ffffff', textColor: '#0f172a', accentColor: '#1e3a8a', fontFamily: 'Times New Roman, serif', cardStyle: 'elevated', borderRadius: 4 },
        { id: 'pro-executive', name: 'Executive', layoutType: 'cards', backgroundColor: '#f1f5f9', textColor: '#334155', accentColor: '#475569', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8 },
        { id: 'pro-corporate', name: 'Corporate Gray', layoutType: 'timeline', backgroundColor: '#ffffff', textColor: '#1f2937', accentColor: '#374151', fontFamily: 'Arial, sans-serif', cardStyle: 'flat', borderRadius: 4 },
      ],
      career: [
        { id: 'pro-career-classic', name: 'Classic Timeline', layoutType: 'timeline', backgroundColor: '#f8fafc', textColor: '#1e293b', accentColor: '#1e40af', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8 },
        { id: 'pro-career-navy', name: 'Navy Career', layoutType: 'cards', backgroundColor: '#ffffff', textColor: '#0f172a', accentColor: '#1e3a8a', fontFamily: 'Times New Roman, serif', cardStyle: 'elevated', borderRadius: 4 },
        { id: 'pro-career-exec', name: 'Executive Career', layoutType: 'stacked', backgroundColor: '#f1f5f9', textColor: '#334155', accentColor: '#475569', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8 },
      ],
      profile: [
        { id: 'pro-profile-classic', name: 'Classic Profile', layoutType: 'horizontal', backgroundColor: '#f8fafc', textColor: '#1e293b', accentColor: '#1e40af', nameColor: '#0f172a', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8, imageStyle: 'circle' },
        { id: 'pro-profile-navy', name: 'Navy Professional', layoutType: 'horizontal', backgroundColor: '#ffffff', textColor: '#0f172a', accentColor: '#1e3a8a', nameColor: '#1e3a8a', fontFamily: 'Times New Roman, serif', cardStyle: 'elevated', borderRadius: 4, imageStyle: 'circle' },
        { id: 'pro-profile-exec', name: 'Executive Profile', layoutType: 'split', backgroundColor: '#1e293b', textColor: '#f8fafc', accentColor: '#94a3b8', nameColor: '#ffffff', fontFamily: 'Georgia, serif', cardStyle: 'flat', borderRadius: 0, imageStyle: 'circle' },
      ],
      awards: [
        { id: 'pro-awards-classic', name: 'Classic Awards', layoutType: 'list', backgroundColor: '#f8fafc', textColor: '#1e293b', accentColor: '#1e40af', fontFamily: 'Georgia, serif', cardStyle: 'bordered', borderRadius: 8 },
        { id: 'pro-awards-navy', name: 'Navy Achievements', layoutType: 'grid', backgroundColor: '#ffffff', textColor: '#0f172a', accentColor: '#1e3a8a', fontFamily: 'Times New Roman, serif', cardStyle: 'elevated', borderRadius: 4 },
      ],
      skills: [
        { id: 'pro-skills', name: 'Professional Skills', backgroundColor: '#f8fafc', textColor: '#1e293b', accentColor: '#1e40af', fontFamily: 'Georgia, serif', barStyle: 'solid', showPercentage: true },
      ],
    },
  };

  // Get designs for a specific template style and section
  const getStyleDesigns = (style, section) => {
    const styleSet = styleDesignSets[style] || styleDesignSets.minimal;
    return styleSet[section] || styleSet.education || [];
  };

  // Helper function to generate design variations from template
  const generateTemplateVariations = (templateConfig, section, templateStyle) => {
    // If we have a predefined style, use those designs
    if (templateStyle && styleDesignSets[templateStyle]) {
      return getStyleDesigns(templateStyle, section);
    }

    // Fallback to generic generation (shouldn't happen often)
    const baseDesign = templateConfig[section] || templateConfig.generic || {};
    const globalConfig = templateConfig.global || {};

    const layoutTypes = {
      career: ['timeline', 'cards', 'stacked', 'horizontal', 'list'],
      education: ['cards', 'timeline', 'alternating', 'journey', 'floating'],
      profile: ['horizontal', 'centered', 'split'],
      awards: ['grid', 'cards', 'list', 'timeline'],
    };

    const cardStyles = ['elevated', 'flat', 'bordered', 'glassmorphism'];
    const layouts = layoutTypes[section] || ['cards', 'grid', 'list'];

    const variations = [];
    for (let i = 0; i < 5; i++) {
      const variation = {
        ...baseDesign,
        id: `template-${section}-${i + 1}`,
        name: i === 0 ? 'Template Default' : `Variation ${i + 1}`,
        backgroundColor: baseDesign.backgroundColor || globalConfig.backgroundColor || '#ffffff',
        textColor: baseDesign.textColor || globalConfig.textColor || '#1f2937',
        accentColor: baseDesign.accentColor || globalConfig.accentColor || '#6366f1',
        fontFamily: baseDesign.fontFamily || globalConfig.fontFamily || 'Inter',
        borderRadius: baseDesign.borderRadius || globalConfig.borderRadius || 12,
        layoutType: i === 0 ? (baseDesign.layoutType || layouts[0]) : layouts[i % layouts.length],
        cardStyle: i === 0 ? (baseDesign.cardStyle || 'elevated') : cardStyles[i % cardStyles.length],
      };
      variations.push(variation);
    }

    return variations;
  };

  // Load selected template and saved designs from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // First load the user's selected template
    console.log('PreviewContext: Loading user template...');
    api.get('/templates/user/current/')
      .then(res => {
        console.log('PreviewContext: API response:', res.data);
        if (res.data?.template) {
          const template = res.data.template;
          console.log('PreviewContext: Setting template:', template.name, 'Style:', template.style);
          setSelectedTemplate(template);
          setTemplateLoaded(true);
          const templateConfig = template.config || {};
          const templateStyle = template.style || 'minimal';

          // Generate style-specific design variations for each section
          const careerDesigns = generateTemplateVariations(templateConfig, 'career', templateStyle);
          const educationDesigns = generateTemplateVariations(templateConfig, 'education', templateStyle);
          const profileDesigns = generateTemplateVariations(templateConfig, 'profile', templateStyle);
          const awardsDesigns = generateTemplateVariations(templateConfig, 'awards', templateStyle);

          setCareerAiDesigns(careerDesigns);
          setEducationAiDesigns(educationDesigns);
          setProfileAiDesigns(profileDesigns);
          setAwardsAiDesigns(awardsDesigns);

          // Get the first design from each style set as the default
          const defaultCareerDesign = careerDesigns[0] || null;
          const defaultEducationDesign = educationDesigns[0] || null;
          const defaultProfileDesign = profileDesigns[0] || null;
          const defaultAwardsDesign = awardsDesigns[0] || null;

          // Apply template defaults to sections that don't have saved designs
          // Load career design (or use style default)
          api.get('/career/settings/get_user_settings/')
            .then(careerRes => {
              if (careerRes.data?.design_config) {
                setLiveCareerDesign(careerRes.data.design_config);
              } else if (defaultCareerDesign) {
                setLiveCareerDesign(defaultCareerDesign);
              }
            })
            .catch(() => {
              if (defaultCareerDesign) setLiveCareerDesign(defaultCareerDesign);
            });

          // Load education design (or use style default)
          api.get('/education/selected-design/')
            .then(eduRes => {
              if (eduRes.data?.design_config) {
                setLiveEducationDesign(eduRes.data.design_config);
              } else if (defaultEducationDesign) {
                setLiveEducationDesign(defaultEducationDesign);
              }
            })
            .catch(() => {
              if (defaultEducationDesign) setLiveEducationDesign(defaultEducationDesign);
            });

          // Load profile design (or use style default)
          api.get('/profile/design/')
            .then(profileRes => {
              if (profileRes.data?.design_config) {
                setLiveProfileDesign(profileRes.data.design_config);
              } else if (defaultProfileDesign) {
                setLiveProfileDesign(defaultProfileDesign);
              }
            })
            .catch(() => {
              if (defaultProfileDesign) setLiveProfileDesign(defaultProfileDesign);
            });

          // Load awards design (or use style default)
          api.get('/achievements/design/')
            .then(awardsRes => {
              if (awardsRes.data?.design_config) {
                setLiveAwardsDesign(awardsRes.data.design_config);
              } else if (defaultAwardsDesign) {
                setLiveAwardsDesign(defaultAwardsDesign);
              }
            })
            .catch(() => {
              if (defaultAwardsDesign) setLiveAwardsDesign(defaultAwardsDesign);
            });

          // Load skills design (or use template default)
          const skillsDesigns = getStyleDesigns(templateStyle, 'skills');
          if (skillsDesigns.length > 0) {
            setLiveSkillsDesign(skillsDesigns[0]);
          } else if (templateConfig.skills) {
            setLiveSkillsDesign(templateConfig.skills);
          }
        }
        setTemplateLoaded(true);
      })
      .catch(() => {
        // No template selected, load designs normally
        setTemplateLoaded(true);

        api.get('/career/settings/get_user_settings/')
          .then(res => {
            if (res.data?.design_config) setLiveCareerDesign(res.data.design_config);
          })
          .catch(() => {});

        api.get('/education/selected-design/')
          .then(res => {
            if (res.data?.design_config) setLiveEducationDesign(res.data.design_config);
          })
          .catch(() => {});

        api.get('/profile/design/')
          .then(res => {
            if (res.data?.design_config) setLiveProfileDesign(res.data.design_config);
          })
          .catch(() => {});

        api.get('/achievements/design/')
          .then(res => {
            if (res.data?.design_config) setLiveAwardsDesign(res.data.design_config);
          })
          .catch(() => {});
      });
  }, []);

  // Generate AI designs for career or education (template-aware)
  const generateAiDesigns = useCallback(async (context) => {
    const token = localStorage.getItem("token");
    setIsGeneratingDesigns(true);
    try {
      // Include template_id if user has a selected template
      const payload = { context, count: 5 };
      if (selectedTemplate?.id) {
        payload.template_id = selectedTemplate.id;
      }

      const response = await api.post(
        "/ai/generate-designs/",
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.data.designs) {
        if (context === "career timeline") {
          setCareerAiDesigns(response.data.designs);
        } else if (context === "education") {
          setEducationAiDesigns(response.data.designs);
        } else if (context === "profile") {
          setProfileAiDesigns(response.data.designs);
        } else if (context === "awards") {
          setAwardsAiDesigns(response.data.designs);
        } else if (context === "skills") {
          setSkillsAiDesigns(response.data.designs);
        }
      }
    } catch (error) {
      console.error("Error generating AI designs:", error);
    } finally {
      setIsGeneratingDesigns(false);
    }
  }, [selectedTemplate]);

  // Refresh preview (kept for backward compatibility)
  const refreshPreview = useCallback(() => {
    // Trigger a re-render by updating timestamp
    setPreviewData(prev => ({ ...prev, _lastRefresh: Date.now() }));
  }, []);

  return (
    <PreviewContext.Provider value={{
      previewData,
      setPreviewData,
      // Template state
      selectedTemplate,
      setSelectedTemplate,
      templateLoaded,
      // Live data
      liveProfileData,
      updateLiveProfile,
      liveHomeData,
      updateLiveHome,
      liveEducationDesign,
      updateEducationDesign,
      liveEducationData,
      updateEducationData,
      liveCareerDesign,
      updateCareerDesign,
      liveCareerData,
      updateCareerData,
      liveSkillsData,
      updateLiveSkills,
      liveSkillsDesign,
      updateLiveSkillsDesign,
      liveBlogData,
      updateLiveBlog,
      liveBlogList,
      updateLiveBlogList,
      refreshPreview,
      careerAiDesigns,
      setCareerAiDesigns,
      educationAiDesigns,
      setEducationAiDesigns,
      profileAiDesigns,
      setProfileAiDesigns,
      awardsAiDesigns,
      setAwardsAiDesigns,
      skillsAiDesigns,
      setSkillsAiDesigns,
      liveProfileDesign,
      updateProfileDesign,
      liveAwardsDesign,
      updateAwardsDesign,
      liveAwardsData,
      updateLiveAwards,
      isGeneratingDesigns,
      generateAiDesigns,
      sectionTabs,
      registerSectionTabs,
      clearSectionTabs,
      goToNextTab,
      liveResumeHtml,
      liveResumeTemplate,
      updateResumeData,
      updateResumeTemplate,
      liveResumeSections,
      updateResumeSections,
      showResumeLayoutModal,
      setShowResumeLayoutModal,
      resumeGenerateCallback,
      setResumeGenerateCallback,
      resumeGenerating,
      setResumeGenerating,
      resumeCanGenerate,
      setResumeCanGenerate,
      liveServicesData,
      updateLiveServices,
      liveTestimonialsData,
      updateLiveTestimonials
    }}>
      {children}
    </PreviewContext.Provider>
  );
};
