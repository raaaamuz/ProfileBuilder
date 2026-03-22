import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../../services/api';

export const PreviewContext = createContext();

export const PreviewProvider = ({ children }) => {
  // This state holds preview data for each page, e.g., { home: '...', profile: '...', ... }
  const [previewData, setPreviewData] = useState({});

  // AI Designs state
  const [careerAiDesigns, setCareerAiDesigns] = useState([]);
  const [educationAiDesigns, setEducationAiDesigns] = useState([]);
  const [profileAiDesigns, setProfileAiDesigns] = useState([]);
  const [awardsAiDesigns, setAwardsAiDesigns] = useState([]);
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

  // Update live blog data (selected post for preview)
  const updateLiveBlog = useCallback((blog) => {
    setLiveBlogData(blog);
  }, []);

  // Update live blog list
  const updateLiveBlogList = useCallback((blogs) => {
    setLiveBlogList(blogs);
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

  // Load saved designs from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Load career design
    api.get('/career/settings/get_user_settings/')
      .then(res => {
        if (res.data?.design_config) {
          setLiveCareerDesign(res.data.design_config);
        }
      })
      .catch(err => console.log('No saved career design'));

    // Load education design
    api.get('/education/selected-design/')
      .then(res => {
        if (res.data?.design_config) {
          setLiveEducationDesign(res.data.design_config);
        }
      })
      .catch(err => console.log('No saved education design'));

    // Load profile design
    api.get('/profile/design/')
      .then(res => {
        if (res.data?.design_config) {
          setLiveProfileDesign(res.data.design_config);
        }
      })
      .catch(err => console.log('No saved profile design'));

    // Load awards design
    api.get('/achievements/design/')
      .then(res => {
        if (res.data?.design_config) {
          setLiveAwardsDesign(res.data.design_config);
        }
      })
      .catch(err => console.log('No saved awards design'));
  }, []);

  // Generate AI designs for career or education
  const generateAiDesigns = useCallback(async (context) => {
    const token = localStorage.getItem("token");
    setIsGeneratingDesigns(true);
    try {
      const response = await api.post(
        "/ai/generate-designs/",
        { context, count: 5 },
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
        }
      }
    } catch (error) {
      console.error("Error generating AI designs:", error);
    } finally {
      setIsGeneratingDesigns(false);
    }
  }, []);

  // Refresh preview (kept for backward compatibility)
  const refreshPreview = useCallback(() => {
    // Trigger a re-render by updating timestamp
    setPreviewData(prev => ({ ...prev, _lastRefresh: Date.now() }));
  }, []);

  return (
    <PreviewContext.Provider value={{
      previewData,
      setPreviewData,
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
      liveProfileDesign,
      updateProfileDesign,
      liveAwardsDesign,
      updateAwardsDesign,
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
      setResumeCanGenerate
    }}>
      {children}
    </PreviewContext.Provider>
  );
};
