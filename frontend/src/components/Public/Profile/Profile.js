import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";

import CareerTimeline from "../Career/CareerTimeline";
import Education from "../Education/Education";
import BioSection from "./BioSection";
import AwardsSection from "./AwardsSection";
import SkillsSection from "./SkillsSection";
import NotesSection from "./NotesSection";
import api from "../../../services/api";
import { getSubdomainUsername } from "../../../utils/subdomain";

// Function to compute default profile data dynamically.
const getDefaultProfileData = (username) => {
  if (username) {
    // Defaults for public profile.
    return {
      name: username,
      bio: (
        <>
          This is the public profile for <strong>{username}</strong>.
          Here you can display a summary of the user’s public information.
          (Replace this with an API call to fetch public profile details.)
        </>
      ),
      image: `${process.env.PUBLIC_URL}/profile.jpg`,
      contact: "/contact",
      cv: `${process.env.PUBLIC_URL}/Naga_resume.pdf`,
      phone: "",
      email: "",
      social: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: ""
      }
    };
  } else {
    // Defaults for logged in user.
    return {
      name: "Ramamoorthy",
      bio: "",
      image: `${process.env.PUBLIC_URL}/profile.jpg`,
      contact: "/contact",
      cv: `${process.env.PUBLIC_URL}/Naga_resume.pdf`,
      phone: "",
      email: "",
      social: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: ""
      }
    };
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const Profile = () => {
  // Extract username from URL or subdomain
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const isPublicView = !!username;

  // Initialize profile state with dynamic defaults.
  const [profile, setProfile] = useState(getDefaultProfileData(username));
  const [notes, setNotes] = useState([]);
  const [globalFont, setGlobalFont] = useState("Inter, sans-serif");
  const [sectionVisibility, setSectionVisibility] = useState({
    show_education: true,
    show_career: true,
    show_skills: true,
    show_awards: true,
    show_achievements: true,
  });
  const [sectionOrder, setSectionOrder] = useState([
    'show_education', 'show_career', 'show_skills', 'show_awards', 'show_achievements'
  ]);

  // Update defaults if username changes.
  useEffect(() => {
    setProfile(getDefaultProfileData(username));
  }, [username]);

  // Fetch contact info for logged in user using the updated API response shape.
  const fetchContactInfoForLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("profile/contact-info/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Expected response: { "email": "xxx@4sight-global.com", "phone": "9789100750", "address": null }
        if (response.data.email && response.data.phone) {
          setProfile((prev) => ({
            ...prev,
            phone: response.data.phone,
            email: response.data.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching contact info for authenticated user:", error);
      }
    }
  };

  // Fetch contact info for public user (assuming similar shape).
  const fetchContactInfoForPublicUser = async () => {
    try {
      const response = await api.get(`/public/profile/${username || "guest"}/`);
      if (response.data.email && response.data.phone) {
        setProfile((prev) => ({
          ...prev,
          phone: response.data.phone,
          email: response.data.email,
        }));
      }
    } catch (error) {
      console.error("Error fetching contact info for public user:", error);
    }
  };

  // Unified function to fetch contact info.
  const fetchContactInfo = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetchContactInfoForLoggedInUser();
    } else {
      await fetchContactInfoForPublicUser();
    }
  };

  // Function to fetch social media links.
  const fetchSocialMediaLinks = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("home/social-media/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.social_media) {
          setProfile((prev) => ({
            ...prev,
            social: {
              ...prev.social,
              ...response.data.social_media,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching social media links for authenticated user:", error);
      }
    } else {
      try {
        const response = await api.get(`/public/profile/${username || "guest"}/`);
        if (response.data.social_media) {
          setProfile((prev) => ({
            ...prev,
            social: {
              ...getDefaultProfileData(username).social,
              ...response.data.social_media,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching social media links for public user:", error);
      }
    }
  };

  // Fetch notes for the profile
  const fetchNotes = async () => {
    try {
      if (username) {
        // Public view - fetch from public endpoint
        const response = await api.get(`/public/profile/${username}/`);
        setNotes(response.data.notes || []);
      } else {
        // Logged in user - notes are included in the aggregate response
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get('/profiles/notes/', {
            headers: { Authorization: `Token ${token}` }
          });
          setNotes(response.data.filter(note => note.is_visible) || []);
        }
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch both contact and social media info whenever the username changes.
  useEffect(() => {
    fetchSocialMediaLinks();
    fetchContactInfo();
    fetchNotes();
  }, [username]);

  // Fetch section visibility settings
  useEffect(() => {
    const fetchSectionVisibility = async () => {
      try {
        if (username) {
          // Public view - fetch from public endpoint
          const response = await api.get(`/public/profile/${username}/`);
          console.log("Profile - Full tabSettings:", response.data?.tabSettings);
          const tabSettings = response.data?.tabSettings?.settings;
          console.log("Profile - Section settings:", tabSettings);
          if (tabSettings && Object.keys(tabSettings).length > 0) {
            setSectionVisibility({
              show_education: tabSettings.show_education !== false,
              show_career: tabSettings.show_career !== false,
              show_skills: tabSettings.show_skills !== false,
              show_awards: tabSettings.show_awards !== false,
              show_achievements: tabSettings.show_achievements !== false,
            });
            if (tabSettings.section_order && Array.isArray(tabSettings.section_order)) {
              setSectionOrder(tabSettings.section_order);
            }
            console.log("Profile - Applied visibility:", {
              show_education: tabSettings.show_education !== false,
              show_career: tabSettings.show_career !== false,
            });
          } else {
            console.log("Profile - No section settings found, using defaults");
          }
        } else {
          // Logged in user
          const token = localStorage.getItem("token");
          console.log("Profile - Logged in user, token exists:", !!token);
          if (token) {
            const response = await api.get("/users/settings/");
            console.log("Profile - User settings response:", response.data);
            if (response.data?.settings) {
              const settings = response.data.settings;
              console.log("Profile - Applying settings:", settings);
              setSectionVisibility({
                show_education: settings.show_education !== false,
                show_career: settings.show_career !== false,
                show_skills: settings.show_skills !== false,
                show_awards: settings.show_awards !== false,
                show_achievements: settings.show_achievements !== false,
              });
              if (settings.section_order && Array.isArray(settings.section_order)) {
                setSectionOrder(settings.section_order);
              }
              console.log("Profile - Visibility set:", {
                show_education: settings.show_education !== false,
                show_career: settings.show_career !== false,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching section visibility:", error);
      }
    };
    fetchSectionVisibility();
  }, [username]);

  // Fetch home settings to get global font
  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        const url = username
          ? `/home/public/${username}/`
          : "/home/";
        const token = localStorage.getItem("token");
        const headers = token && !username ? { Authorization: `Token ${token}` } : {};
        const response = await api.get(url, { headers });
        const resData = username ? response.data.home_content : response.data;
        const settings = resData?.custom_settings || resData?.customSettings;
        if (settings?.fontFamily) {
          setGlobalFont(settings.fontFamily);
        }
      } catch (error) {
        console.log("Using default font");
      }
    };
    fetchHomeSettings();
  }, [username]);

  // Contact section component to avoid duplication
  const ContactSection = () => (
    (profile.phone || profile.email || profile.social.facebook || profile.social.twitter || profile.social.linkedin || profile.social.instagram) && (
      <div className="bg-white py-12">
        <div className="text-center border-t border-gray-200 pt-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-700">
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                <FontAwesomeIcon icon={faPhone} />
                <span>{profile.phone}</span>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>{profile.email}</span>
              </a>
            )}
          </div>
          {(profile.social.facebook || profile.social.twitter || profile.social.linkedin || profile.social.instagram) && (
            <div className="flex justify-center gap-4 mt-6">
              {profile.social.facebook && (
                <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              )}
              {profile.social.twitter && (
                <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              )}
              {profile.social.linkedin && (
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              )}
              {profile.social.instagram && (
                <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen" style={{ fontFamily: globalFont }}>
      {/* Bio Section - Full width, renders user's selected layout from admin */}
      <BioSection globalFont={globalFont} />

      {/* Other sections scroll below */}
      <div className="bg-gray-50">
        {/* Notes Section - Highlighted notes from admin */}
        <NotesSection notes={notes} globalFont={globalFont} />
        {/* Render sections in saved order */}
        {sectionOrder.map((sectionKey) => {
          if (!sectionVisibility[sectionKey]) return null;
          switch (sectionKey) {
            case 'show_awards':
              return <AwardsSection key={sectionKey} globalFont={globalFont} />;
            case 'show_career':
              return <CareerTimeline key={sectionKey} globalFont={globalFont} />;
            case 'show_skills':
              return <SkillsSection key={sectionKey} globalFont={globalFont} />;
            case 'show_education':
              return <Education key={sectionKey} globalFont={globalFont} />;
            case 'show_achievements':
              return null; // Add AchievementsSection component when available
            default:
              return null;
          }
        })}
        <ContactSection />
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Contact</h3>
              <div className="space-y-2 text-gray-300">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4" />
                    <span className="text-sm">{profile.email}</span>
                  </a>
                )}
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                    <FontAwesomeIcon icon={faPhone} className="w-4" />
                    <span className="text-sm">{profile.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Quick Links</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <a href="#top" className="block hover:text-cyan-400 transition-colors">Back to Top</a>
                {username && <a href={`${process.env.REACT_APP_API_URL}/profile/resume/public/${username}/`} target="_blank" rel="noopener noreferrer" className="block hover:text-cyan-400 transition-colors">Download Resume</a>}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Connect</h3>
              <div className="flex gap-3">
                {profile.social?.linkedin && (
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                )}
                {profile.social?.twitter && (
                  <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {profile.social?.facebook && (
                  <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                )}
                {profile.social?.instagram && (
                  <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
            </p>
            <a href="https://profile2connect.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-cyan-400 transition-colors">
              Powered by Profile2Connect
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
