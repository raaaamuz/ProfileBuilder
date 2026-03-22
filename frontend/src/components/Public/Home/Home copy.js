import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faLinkedin, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import api from "../../../services/api";

const Home = ({ data }) => {
  
  const navigate = useNavigate();
  const location = useLocation();

  // Tabs will be used only if not provided via props (for example, in a preview scenario)
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");

  // Local state for home content and theme
  const [homeContent, setHomeContent] = useState({
    title: "Welcome to Our Website",
    description: "Bringing you the best experience.",
    background_video: null,
    youtube_link: "",
    linkedin_link: "",
    facebook_link: "",
    twitter_link: "",
    custom_settings: {
      textColor: "#ffffff",
      backgroundColor: "#000000",
      fontFamily: "Arial",
    },
  });

  const [theme, setTheme] = useState({
    textColor: "#ffffff",
    backgroundColor: "#000000",
    fontFamily: "Arial",
  });
  const [error, setError] = useState("");

  // When a prop is passed, use it to update local state.
  useEffect(() => {
    if (data) {
      setHomeContent(data);
      if (data.custom_settings) {
        setTheme(data.custom_settings);
      }
    }
  }, [data]);

  // Fallback: If no prop is passed, fetch data from the API.
  useEffect(() => {
    if (!data) {
      const token = localStorage.getItem("token");

      const fetchHomeContent = async () => {
        try {
          const response = await api.get("/home/", {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          setHomeContent(response.data);
          if (response.data.custom_settings) {
            setTheme(response.data.custom_settings);
          }
        } catch (error) {
          console.error("Error fetching home page content:", error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setError("Unauthorized. Please log in.");
          }
        }
      };

      fetchHomeContent();
    }
  }, [data, location.pathname]);

  // Fetch tabs only if not using dynamic prop data
  useEffect(() => {
    if (!data) {
      const token = localStorage.getItem("token");
      
      const fetchTabSettings = async () => {
        try {
          
          const response = await api.get("/users/settings/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.settings) {
            const filteredTabs = [
              { name: "Home", path: "/", key: "show_home" },
              { name: "Profile", path: "/profile", key: "show_profile" },
              { name: "Blog", path: "/blog", key: "show_blog" },
              { name: "Stories", path: "/stories", key: "show_stories" },
              { name: "Contact", path: "/contact", key: "show_contact" },
            ].filter(tab => response.data.settings[tab.key] !== false);
            setTabs(filteredTabs);
          }
        } catch (error) {
          console.error("Error fetching tab settings:", error);
        }
      };

      fetchTabSettings();
    }
  }, [data]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  return (
    <div 
      className="relative h-screen flex flex-col justify-center items-center text-center"
      style={{
        color: theme.textColor,
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {homeContent.background_video ? (
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source 
            src={`http://127.0.0.1:8000${
              homeContent.background_video.startsWith("/media/") 
                ? homeContent.background_video 
                : `/media/${homeContent.background_video}`
            }`} 
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gray-900"></div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 px-6">
        <h1 className="text-5xl md:text-7xl font-bold">
          {homeContent.title || "Welcome to Our Website"}
        </h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          {error || homeContent.description || "Bringing you the best experience."}
        </p>
        {tabs.length > 0 && (
          <nav className="mt-8 w-full max-w-2xl mx-auto">
            <ul className="flex justify-between border-b-2 border-gray-400 pb-2">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  className={`w-full text-center cursor-pointer py-2 transition-all duration-300 ${
                    activeTab === tab.name 
                      ? "text-red-500 font-semibold border-b-2 border-red-500" 
                      : "hover:text-gray-300"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
          </nav>
        )}
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
