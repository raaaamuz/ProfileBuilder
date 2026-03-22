import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faLinkedin, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import api from "../../../services/api";
import { useUsername } from "../../../utils/subdomain";

const Home = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = useUsername();
  const token = localStorage.getItem("token");
  const isGuest = !token && !username;

  // Default menu items for navigation.
  // Note: Education and Career are shown within the Profile page, not as separate nav items
  const defaultTabs = [
    { name: "Home", path: "/", key: "show_home" },
    { name: "Profile", path: "/profile", key: "show_profile" },
    { name: "Blog", path: "/blog", key: "show_blog" },
    { name: "Stories", path: "/stories", key: "show_stories" },
    { name: "Contact", path: "/contact", key: "show_contact" },
  ];

  const [tabs, setTabs] = useState(defaultTabs);
  const [activeTab, setActiveTab] = useState("");

  // Local state for home content. Default values are set.
  const [homeContent, setHomeContent] = useState({
    title: "Welcome to Our Website",
    description: "Bringing you the best experience.",
    background_video: null, // Can be from background_video or backgroundVideo.
    youtube_link: "",
    linkedin_link: "",
    facebook_link: "",
    twitter_link: "",
    // Design settings from backend response.
    customSettings: {
      textColor: "#ffffff",
      backgroundColor: "#000000",
      fontFamily: "Arial",
    },
  });

  // Theme state for design settings.
  const [theme, setTheme] = useState({
    textColor: "#ffffff",
    backgroundColor: "#000000",
    fontFamily: "Arial",
  });

  const [error, setError] = useState("");

  // If data prop is provided, update home content and theme.
  useEffect(() => {
    if (data) {
      setHomeContent(data);
      // Prefer customSettings from the response.
      const settings = data.customSettings || data.custom_settings;
      if (settings) {
        setTheme({
          textColor: settings.textColor || '#ffffff',
          backgroundColor: settings.backgroundColor || '#000000',
          fontFamily: settings.fontFamily || 'Arial',
        });
      }
    }
  }, [
    data,
    data?.customSettings?.textColor,
    data?.customSettings?.backgroundColor,
    data?.customSettings?.fontFamily,
  ]);

  // Fetch home content if no prop is passed.
  useEffect(() => {
    // Skip fetching for guests - they see the landing page
    if (isGuest) return;

    if (!data) {
      // If username exists, assume public view (no /api prefix - api instance adds it)
      const url = username
        ? `/home/public/${username}/`
        : "/home/";
      // For authenticated users, include token header if username is not provided.
      const headers = token && !username
        ? { Authorization: `Token ${token}` }
        : {};

      const fetchHomeContent = async () => {
        try {
          const response = await api.get(url, { headers });
          console.log("API response:", response.data);
          // For public view, data is nested under home_content
          const resData = username ? response.data.home_content : response.data;
          // Determine background video from either field.
          const bgVideo = resData.background_video || resData.backgroundVideo || "";
          setHomeContent({
            title: resData.title,
            description: resData.description,
            background_video: bgVideo,
            youtube_link: resData.youtube_link,
            linkedin_link: resData.linkedin_link,
            facebook_link: resData.facebook_link,
            twitter_link: resData.twitter_link,
            // Save design settings for later use.
            customSettings: resData.customSettings || resData.custom_settings || {
              textColor: "#ffffff",
              backgroundColor: "#000000",
              fontFamily: "Arial",
            },
          });
          // Update theme from customSettings if available.
          if (resData.customSettings) {
            setTheme(resData.customSettings);
          } else if (resData.custom_settings) {
            setTheme(resData.custom_settings);
          }
        } catch (error) {
          console.error("Error fetching home page content:", error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setError("Unauthorized. Please log in.");
          } else {
            setError("Failed to load home content.");
          }
        }
      };
      fetchHomeContent();
    }
  }, [data, location.pathname, username, isGuest, token]);

  // Fetch and filter tab settings to show only enabled items.
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Always fetch the profile owner's settings, not the logged-in user's
    if (username) {
      // For public view, check for nested settings in tabSettings.
      api
        .get(`/public/profile/${username}/`)
        .then((res) => {
          console.log("Home - Full API response:", res.data);
          console.log("Home - Tab settings:", res.data.tabSettings);

          // Get settings - handle both nested and flat structure
          let settings = null;
          if (res.data?.tabSettings?.settings) {
            settings = res.data.tabSettings.settings;
          } else if (res.data?.tabSettings) {
            settings = res.data.tabSettings;
          }

          console.log("Home - Parsed settings:", settings);

          if (settings && typeof settings === 'object' && Object.keys(settings).length > 0) {
            const filteredTabs = defaultTabs.filter((tab) => {
              const isEnabled = settings[tab.key] !== false;
              console.log(`Home - Tab ${tab.key}: ${settings[tab.key]} -> ${isEnabled ? 'show' : 'hide'}`);
              return isEnabled;
            });
            console.log("Home - Filtered tabs:", filteredTabs.map(t => t.name));
            setTabs(filteredTabs);
          } else {
            console.log("Home - No settings found, using defaults");
            setTabs(defaultTabs);
          }
        })
        .catch((err) => {
          console.error("Error fetching public tab settings:", err);
          setTabs(defaultTabs);
        });
    } else if (!token) {
      setTabs(defaultTabs);
    } else {
      const fetchTabSettings = async () => {
        try {
          const response = await api.get("users/settings/");
          console.log("Home - Auth settings response:", response.data);
          if (response.data && response.data.settings) {
            const filteredTabs = defaultTabs.filter(
              (tab) => response.data.settings[tab.key] !== false
            );
            setTabs(filteredTabs);
          } else {
            setTabs(defaultTabs);
          }
        } catch (error) {
          console.error("Error fetching tab settings:", error);
          setTabs(defaultTabs);
        }
      };
      fetchTabSettings();
    }
  }, [username]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    // For public profiles, use /public/{section}/{username} format
    if (username) {
      // Map tab names to route segments
      const sectionMap = {
        'Home': 'home',
        'Profile': 'profile',
        'Blog': 'blog',
        'Stories': 'stories',
        'Contact': 'contact',
        'Education': 'education',
        'Career': 'career',
      };
      const section = sectionMap[tab.name] || tab.name.toLowerCase();
      navigate(`/public/${section}/${username}`);
    } else {
      navigate(tab.path);
    }
  };

  // Build the video URL dynamically.
  const buildVideoUrl = () => {
    const bgVideo = homeContent.background_video || "";
    if (!bgVideo) return "";
    // If already a full URL or blob URL, return as-is
    if (bgVideo.startsWith("http://") || bgVideo.startsWith("https://") || bgVideo.startsWith("blob:")) {
      return bgVideo;
    }
    // Use the API base URL (remove /api suffix) for media files
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
    const baseUrl = apiUrl.replace(/\/api\/?$/, "");
    return `${baseUrl}${bgVideo.startsWith("/") ? bgVideo : `/${bgVideo}`}`;
  };

  // Guest Landing Page
  if (isGuest) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}>
        {/* Top Header with Logo */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <img
            src="/p2clogo.png"
            alt="Profile2Connect"
            className="h-10 md:h-14"
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-white font-medium hover:text-cyan-400 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
              className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Your <span style={{ background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Professional Portfolio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Create a stunning online portfolio to showcase your skills, experience, and achievements.
            Stand out from the crowd with a personalized professional presence.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => navigate('/register')}
              style={{ background: 'linear-gradient(to right, #9333ea, #db2777)' }}
              className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-600"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-cyan-500/20">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Beautiful Designs</h3>
                <p className="text-gray-400">Multiple professional templates with AI-powered customization</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-cyan-500/20">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Resume Builder</h3>
                <p className="text-gray-400">Generate professional resumes instantly with AI assistance</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-cyan-500/20">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-semibold text-white mb-2">Shareable Profile</h3>
                <p className="text-gray-400">Get a unique URL to share your portfolio with anyone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center text-gray-400 border-t border-cyan-900/50">
          <p>&copy; 2026 Profile2Connect. All rights reserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative h-screen flex flex-col justify-center items-center text-center"
      style={{
        color: theme.textColor,
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Background video or fallback */}
      {homeContent.background_video ? (
        <>
          <video autoPlay loop muted className="absolute w-full h-full object-cover">
            <source
              src={buildVideoUrl()}
              type="video/mp4"
            />
          </video>
          {/* Dark overlay only for video */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </>
      ) : null}
      
      <div className="relative z-10 px-6">
        <h1 className="text-5xl md:text-7xl font-bold">
          {homeContent.title || "Welcome to Our Website"}
        </h1>
        <p className="text-lg mt-4 max-w-6xl mx-auto">
          {error || homeContent.description || "Bringing you the best experience."}
        </p>

        {/* Navigation menu */}
        {tabs.length > 0 && (
          <nav className="mt-8 w-full max-w-2xl mx-auto">
            <ul className="flex justify-between border-b-2 border-gray-600 pb-2">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full text-center cursor-pointer py-2 transition-all duration-300 ${
                    activeTab === tab.name 
                      ? "underline font-semibold text-orange-700" 
                      : "hover:underline hover:decoration-orange-600"
                  }`}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Social icons */}
        <div className="mt-8 flex justify-center space-x-4">
          {homeContent.youtube_link && (
            <a href={homeContent.youtube_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} size="2x" />
            </a>
          )}
          {homeContent.linkedin_link && (
            <a href={homeContent.linkedin_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          )}
          {homeContent.facebook_link && (
            <a href={homeContent.facebook_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
          )}
          {homeContent.twitter_link && (
            <a href={homeContent.twitter_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
