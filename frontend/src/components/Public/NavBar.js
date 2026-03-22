import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faLinkedin, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { getSubdomainUsername } from "../../utils/subdomain";

const defaultTabs = [
  { name: "Home", path: "/", key: "show_home" },
  { name: "Profile", path: "/profile", key: "show_profile" },
  { name: "Blog", path: "/blog", key: "show_blog" },
  { name: "Stories", path: "/stories", key: "show_stories" },
  { name: "Contact", path: "/contact", key: "show_contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use the urlUsername from route parameters OR subdomain
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const effectiveUsername = urlUsername || subdomainUsername;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tabs, setTabs] = useState(defaultTabs);
  // For public view, default to effectiveUsername if available, otherwise "guest".
  const [username, setUsername] = useState(effectiveUsername || "guest");

  // State for social media links - empty by default, fetched from API
  const [socialMedia, setSocialMedia] = useState({
    youtube: "",
    linkedin: "",
    facebook: "",
    twitter: ""
  });

  // Determine if we're in a public view route (e.g. /public/home/... or /public/profile/... OR subdomain)
  const isPublicView = location.pathname.startsWith("/public/") || !!subdomainUsername;

  // Check if guest on landing page (main domain only) - hide navbar completely
  const token = localStorage.getItem("token");
  const isGuestOnLanding = !token && !effectiveUsername && location.pathname === "/";

  // Hide navbar for logged-in users (they use admin sidebar) and guests on auth pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const shouldHideNavbar = token || isGuestOnLanding || isAuthPage;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!storedToken);

    // For public view (regardless of auth status), always fetch the profile owner's settings
    if (isPublicView && effectiveUsername) {
      setUsername(effectiveUsername);
      // Fetch the profile owner's settings, not the logged-in user's
      api
        .get(`/public/profile/${effectiveUsername}/`)
        .then((res) => {
          console.log("Navbar - Full response:", res.data);
          console.log("Navbar - Tab settings:", res.data.tabSettings);

          // Check for nested settings in tabSettings
          const tabSettings = res.data?.tabSettings?.settings;
          if (tabSettings && Object.keys(tabSettings).length > 0) {
            const filteredTabs = defaultTabs.filter((tab) => {
              // Only include tabs that are explicitly set to true or not set (default to true)
              const value = tabSettings[tab.key];
              console.log(`Tab ${tab.key}: ${value}`);
              return value !== false;
            });
            console.log("Navbar - Filtered tabs:", filteredTabs);
            setTabs(filteredTabs);
          } else {
            console.log("Navbar - No tab settings found, using defaults");
            setTabs(defaultTabs);
          }

          // Update social media links from either snake_case or camelCase keys
          if (res.data) {
            setSocialMedia({
              youtube: res.data.youtube_link || res.data.youtubeLink || "",
              linkedin: res.data.linkedin_link || res.data.linkedinLink || "",
              facebook: res.data.facebook_link || res.data.facebookLink || "",
              twitter: res.data.twitter_link || res.data.twitterLink || "",
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching public tab settings:", err);
          setTabs(defaultTabs);
        });
      return;
    }

    if (storedToken && !isPublicView) {
      // For logged-in users, fetch tab settings and username.
      // Note: api interceptor already adds Token header, no need to add manually
      const fetchTabSettings = async () => {
        try {
          const response = await api.get("users/settings/");
          console.log("Tab settings response:", response.data);
          if (response.data && response.data.settings) {
            const filteredTabs = defaultTabs.filter(
              (tab) => response.data.settings[tab.key] !== false
            );
            console.log("Filtered tabs (authenticated):", filteredTabs);
            setTabs(filteredTabs);
          } else {
            setTabs(defaultTabs);
          }
        } catch (error) {
          console.error("Error fetching tab settings:", error);
          setTabs(defaultTabs);
        }
      };

      const fetchUsername = async () => {
        try {
          const response = await api.get("users/username/");
          setUsername(response.data.username);
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };

      fetchTabSettings();
      fetchUsername();

      // Fetch social media links for logged-in users.
      const fetchSocialMedia = async () => {
        try {
          const response = await api.get("home/social-media/");
          if (response.data.social_media) {
            console.log("Social media data: ", response.data.social_media);
            setSocialMedia(response.data.social_media);
          }
        } catch (error) {
          console.error("Error fetching social media links:", error);
        }
      };
      fetchSocialMedia();
    } else if (!storedToken) {
      // Fallback defaults for non-authenticated users.
      setTabs(defaultTabs);
      setUsername("guest");
    }
  }, [location.pathname, isPublicView, effectiveUsername]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("guest");
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    // On subdomain, use simple paths (subdomain routing handles it)
    if (subdomainUsername) {
      const pathMap = {
        "show_home": "/home",
        "show_profile": "/profile",
        "show_blog": "/blog",
        "show_stories": "/stories",
        "show_contact": "/contact",
      };
      navigate(pathMap[tab.key] || tab.path);
      return;
    }

    // For public users (main domain), map each tab to its public version.
    if (!isAuthenticated && effectiveUsername) {
      let publicPath = "";
      switch (tab.key) {
        case "show_home":
          publicPath = `/public/home/${username || "guest"}`;
          break;
        case "show_profile":
          publicPath = `/public/profile/${username || "guest"}`;
          break;
        case "show_blog":
          publicPath = `/public/blog/${username || "guest"}`;
          break;
        case "show_stories":
          publicPath = `/public/stories/${username || "guest"}`;
          break;
        case "show_contact":
          publicPath = `/public/contact/${username || "guest"}`;
          break;
        default:
          publicPath = tab.path;
      }
      navigate(publicPath);
      return;
    }
    // For logged-in users, use the original tab path.
    navigate(tab.path);
  };

  // Hide navbar for logged-in users, guests on landing page, or auth pages
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            {username ? username : "Guest"}
          </div>
          <ul className="hidden md:flex space-x-6">
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === tab.path
                    ? "text-red-500 font-semibold bg-gray-800"
                    : "text-white hover:text-gray-300"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div className="flex space-x-4">
            {socialMedia.youtube && (
              <a
                href={socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  size="2x"
                  className="text-white hover:text-red-500 transition-all duration-300"
                />
              </a>
            )}
            {socialMedia.linkedin && (
              <a
                href={socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  size="2x"
                  className="text-white hover:text-blue-500 transition-all duration-300"
                />
              </a>
            )}
            {socialMedia.facebook && (
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  size="2x"
                  className="text-white hover:text-blue-400 transition-all duration-300"
                />
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  size="2x"
                  className="text-white hover:text-blue-300 transition-all duration-300"
                />
              </a>
            )}
          </div>
          {/* Show login/logout button only when not in public view */}
          {!isPublicView && (
            <div className="ml-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
                >
                  Logout
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
