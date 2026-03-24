import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { PreviewContext } from "../PreviewContext";
import {
  Home, Link2, Palette, X, Sparkles, Check, Loader2, User, AlertCircle, ArrowRight
} from "lucide-react";

import SocialMediaLinks from "./SocialMediaLinks";
import PersonalDetails from "./PersonalDetails";
import DesignSettings from "./DesignSettings";
import api from "../../../services/api";
import TabNavigation from "../common/TabNavigation";

const formTabs = [
  { id: "Personal Details", label: "Content", icon: Home, description: "Title & description" },
  { id: "Social Media Links", label: "Social Links", icon: Link2, description: "Connect your profiles" },
  { id: "Design Settings", label: "Design", icon: Palette, description: "Colors & video" },
];

const AdminHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateLiveHome, registerSectionTabs, clearSectionTabs } = useContext(PreviewContext);

  const [activeFormTab, setActiveFormTab] = useState("Personal Details");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    background_video: null,
    background_video_url: "",
    youtube_link: "",
    linkedin_link: "",
    facebook_link: "",
    twitter_link: "",
    custom_settings: {
      textColor: "#ffffff",
      backgroundColor: "#1a1a2e",
      fontFamily: "Georgia",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialLoadRef = useRef(true); // Track initial load to prevent auto-save on mount
  const loadedDataRef = useRef(null); // Store loaded data to compare before saving
  const [lastSaved, setLastSaved] = useState(null);
  const [message, setMessage] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [improvedDescriptions, setImprovedDescriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fonts = [
    "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New",
    "Comic Sans MS", "Trebuchet MS", "Lucida Sans", "Tahoma", "Impact",
    "Palatino Linotype", "Garamond", "Roboto", "Lato", "Montserrat",
    "Open Sans", "Poppins", "Raleway", "Playfair Display", "Source Sans Pro",
    "Nunito", "Merriweather", "Oswald", "Quicksand", "Ubuntu"
  ];

  // Register tabs with context for navigation
  useEffect(() => {
    const tabKeys = formTabs.map(t => t.id);
    registerSectionTabs(tabKeys, activeFormTab, setActiveFormTab);
    return () => clearSectionTabs();
  }, [activeFormTab, registerSectionTabs, clearSectionTabs]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! No token found. Please log in as an admin.");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get("/home/", {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.data) {
          console.log("[AdminHome] API Response - title:", response.data.title, "| description:", response.data.description?.substring(0, 50));
          // Build full URL for video if it exists (server returns relative path)
          let videoUrl = response.data.background_video || "";
          if (videoUrl && !videoUrl.startsWith("http")) {
            const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
            videoUrl = `${baseUrl}${videoUrl}`;
          }
          const loadedFormData = {
            title: response.data.title || "",
            description: response.data.description || "",
            background_video: null,
            background_video_url: videoUrl,
            youtube_link: response.data.youtube_link || "",
            linkedin_link: response.data.linkedin_link || "",
            facebook_link: response.data.facebook_link || "",
            twitter_link: response.data.twitter_link || "",
            custom_settings: response.data.custom_settings || {
              textColor: "#ffffff",
              backgroundColor: "#1a1a2e",
              fontFamily: "Georgia",
            },
          };
          // Store loaded data in ref for comparison
          loadedDataRef.current = loadedFormData;
          setFormData(loadedFormData);
          // Allow auto-save after a delay to prevent race conditions
          setTimeout(() => {
            initialLoadRef.current = false;
            setDataLoaded(true);
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching home page content:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.pathname, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (prev.custom_settings && Object.keys(prev.custom_settings).includes(name)) {
        return {
          ...prev,
          custom_settings: {
            ...prev.custom_settings,
            [name]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (files) => {
    const file = files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        background_video: file, // Store the actual file
        background_video_url: URL.createObjectURL(file), // For immediate preview
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        background_video: null,
        background_video_url: "", // Clear preview if no file selected
      }));
    }
  };

  // Effect to clean up URL.createObjectURL when component unmounts or video changes
  useEffect(() => {
    return () => {
      if (formData.background_video_url && formData.background_video_url.startsWith("blob:")) {
        URL.revokeObjectURL(formData.background_video_url);
      }
    };
  }, [formData.background_video_url]);

  // Sync formData with live preview context
  useEffect(() => {
    updateLiveHome({
      title: formData.title,
      description: formData.description,
      background_video: formData.background_video_url,
      customSettings: {
        textColor: formData.custom_settings?.textColor || '#ffffff',
        backgroundColor: formData.custom_settings?.backgroundColor || '#000000',
        fontFamily: formData.custom_settings?.fontFamily || 'Arial',
      },
    });
  }, [
    formData.title,
    formData.description,
    formData.background_video_url,
    formData.custom_settings?.textColor,
    formData.custom_settings?.backgroundColor,
    formData.custom_settings?.fontFamily,
    updateLiveHome
  ]);

  // Auto-save with debounce when form data changes
  useEffect(() => {
    // Skip auto-save during initial loading phase
    if (isLoading || !dataLoaded || initialLoadRef.current) {
      return;
    }

    // Check if data has actually changed from what was loaded
    const loaded = loadedDataRef.current;
    if (loaded) {
      const hasChanges =
        formData.title !== loaded.title ||
        formData.description !== loaded.description ||
        formData.youtube_link !== loaded.youtube_link ||
        formData.linkedin_link !== loaded.linkedin_link ||
        formData.facebook_link !== loaded.facebook_link ||
        formData.twitter_link !== loaded.twitter_link ||
        formData.background_video instanceof File ||
        JSON.stringify(formData.custom_settings) !== JSON.stringify(loaded.custom_settings);

      if (!hasChanges) {
        console.log("Skipping auto-save: no changes from loaded data");
        return;
      }
    }

    const saveData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Auto-saving with data:", {
        youtube: formData.youtube_link,
        linkedin: formData.linkedin_link,
        facebook: formData.facebook_link
      });

      setIsSaving(true);
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title || "");
      formDataObj.append("description", formData.description || "");

      // Always send all social links to prevent data loss
      formDataObj.append("youtube_link", formData.youtube_link || "");
      formDataObj.append("linkedin_link", formData.linkedin_link || "");
      formDataObj.append("facebook_link", formData.facebook_link || "");
      formDataObj.append("twitter_link", formData.twitter_link || "");
      formDataObj.append("custom_settings", JSON.stringify(formData.custom_settings || {}));

      // Only include video if it's a new file
      if (formData.background_video instanceof File) {
        formDataObj.append("background_video", formData.background_video);
      }

      try {
        const response = await api.post("home/update/", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });
        setLastSaved(new Date());
        // Update the video URL from the server response if a new video was uploaded
        if (response.data.background_video && formData.background_video instanceof File) {
          // Build full URL for the video (server returns relative path)
          const videoUrl = response.data.background_video;
          const fullVideoUrl = videoUrl.startsWith("http")
            ? videoUrl
            : `${(process.env.REACT_APP_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "")}${videoUrl}`;
          setFormData(prev => ({
            ...prev,
            background_video_url: fullVideoUrl,
            background_video: null, // Clear the file object after successful upload
          }));
        }
        // Update the loaded data ref to current values after successful save
        loadedDataRef.current = { ...formData, background_video_url: response.data.background_video || formData.background_video_url };
      } catch (error) {
        console.error("Auto-save error:", error);
      } finally {
        setIsSaving(false);
      }
    };

    // Debounce 500ms
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.title, formData.description, formData.custom_settings, formData.background_video, formData.youtube_link, formData.linkedin_link, formData.facebook_link, formData.twitter_link, isLoading, dataLoaded]);


  const handleImproveDescription = async () => {
    if (!formData.description || formData.description.trim() === "") {
      setMessage("Please enter a description to improve.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setIsImproving(true);
    try {
      const token = localStorage.getItem("token"); // Get token for AI request
      const response = await api.post("ai/improve-description/",
        { description: formData.description },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.data && response.data.variations) {
        setImprovedDescriptions(response.data.variations);
        setIsModalOpen(true);
      } else {
        setMessage("No improved variations were returned.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error improving description:", error);
      setMessage(`Failed to improve description: ${error.response?.data?.detail || "Unknown error"}`);
      setTimeout(() => setMessage(""), 3000);
    }
    setIsImproving(false);
  };

  const handleSelectDescription = (desc) => {
    setFormData((prev) => ({ ...prev, description: desc }));
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      // Handle the actual File object for background_video
      if (key === "background_video" && value instanceof File) {
        formDataObj.append("background_video", value);
      }
      // Skip background_video_url as it's for local preview
      else if (key === "background_video_url") {
        // Do nothing, don't append to FormData
      }
      else if (key === "custom_settings") {
        try {
          formDataObj.append("custom_settings", JSON.stringify(value));
        } catch (error) {
          console.error("Invalid JSON format for custom_settings:", error);
        }
      }
      // Only send social links if they have values
      else if (["youtube_link", "linkedin_link", "facebook_link", "twitter_link"].includes(key)) {
        if (value) {
          formDataObj.append(key, value);
        }
      }
      else {
        formDataObj.append(key, value);
      }
    });

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! No token found. Please log in as an admin.");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("home/update/", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      console.log("Server Response:", response.data);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
      // Update the URL for the background video in state if it was a new upload
      if (response.data.background_video) {
        // Build full URL for the video (server returns relative path)
        const videoUrl = response.data.background_video;
        const fullVideoUrl = videoUrl.startsWith("http")
          ? videoUrl
          : `${(process.env.REACT_APP_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "")}${videoUrl}`;
        setFormData(prev => ({
          ...prev,
          background_video_url: fullVideoUrl,
          background_video: null, // Clear the file input state after successful upload
        }));
      }

      // Auto-advance to next section after successful save
      const currentTabIndex = formTabs.findIndex(tab => tab.id === activeFormTab);
      if (currentTabIndex < formTabs.length - 1) {
        setActiveFormTab(formTabs[currentTabIndex + 1].id);
      } else {
        // On final tab, navigate to next admin section (Profile)
        navigate('/dashboard/profile');
      }
    } catch (error) {
      console.error("Error updating home page:", error);
      setMessage(
        `Failed to update home page: ${
          error.response?.data?.detail || "Unknown error"
        }`
      );
      setTimeout(() => setMessage(""), 5000); // Keep error message longer
      // Handle specific error like 401 Unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={24} style={{ color: '#6366f1' }} />
          <p style={{ color: '#64748b', fontSize: '13px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Auto-save indicator */}
      <div className="flex items-center justify-end mb-3">
        {isSaving ? (
          <span className="text-xs flex items-center gap-1.5" style={{ color: '#6366f1' }}>
            <Loader2 size={12} className="animate-spin" /> Saving...
          </span>
        ) : lastSaved ? (
          <span className="text-xs flex items-center gap-1.5" style={{ color: '#22c55e' }}>
            <Check size={12} /> Saved
          </span>
        ) : null}
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className="mb-4 px-4 py-3 rounded-md flex items-center gap-2 text-sm"
          style={{
            backgroundColor: message.includes("successfully") ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.includes("successfully") ? '#22c55e' : '#ef4444'}`,
            color: message.includes("successfully") ? '#22c55e' : '#ef4444'
          }}
        >
          {message.includes("successfully") ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message}</span>
        </div>
      )}

      {/* Tab Navigation - Clean professional tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-md" style={{ backgroundColor: '#0f172a' }}>
        {formTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFormTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFormTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#6366f1' : '#64748b',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {activeFormTab === "Personal Details" && (
            <PersonalDetails
              formData={formData}
              handleChange={handleChange}
              handleImproveDescription={handleImproveDescription}
              isImproving={isImproving}
            />
          )}
          {activeFormTab === "Social Media Links" && (
            <SocialMediaLinks formData={formData} handleChange={handleChange} />
          )}
          {activeFormTab === "Design Settings" && (
            <DesignSettings
              formData={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              videoUrl={formData.background_video_url}
              fonts={fonts}
            />
          )}
        </div>
      </form>

      {/* Modal for AI improved descriptions */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className="w-full max-w-lg mx-auto rounded-lg shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid #334155' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
                >
                  <Sparkles size={16} style={{ color: '#6366f1' }} />
                </div>
                <Dialog.Title style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 600 }}>
                  AI Suggestions
                </Dialog.Title>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                style={{ color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>
                Select a description to use:
              </p>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {improvedDescriptions.map((desc, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectDescription(desc)}
                    className="p-3 rounded-md cursor-pointer transition-all text-sm"
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      color: '#e2e8f0'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.backgroundColor = '#0f172a';
                    }}
                  >
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="px-5 py-3 flex justify-end gap-2"
              style={{ borderTop: '1px solid #334155' }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                style={{ backgroundColor: '#334155', color: '#94a3b8' }}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminHome;