import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Dialog } from "@headlessui/react"; // For the modal popup

import Home from "../../Public/Home/Home_old";
import api from "../../../services/api";

const AdminHome = () => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Admin Home", path: "/admin/home" },
    // { name: "Users", path: "/admin/users" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const [activeTab, setActiveTab] = useState("Admin Home");
  const [formData, setFormData] = useState({
    title: "Ramamoorthy Karuppan",
    description:
      "Ram - fancy myself as a storyteller be it with data or with words. I am here to pursue my passion for writing and clue in my visitors as to what inspires me in this crazy world. Welcome! Sit back, relax and read on.",
    background_video: null,
    youtube_link: "https://4sightoperations.com/filters",
    linkedin_link:
      "https://www.wix.com/about/contact-us?referralAdditionalInfo=realDeal",
    facebook_link:
      "https://www.wix.com/about/contact-us?referralAdditionalInfo=realDeal",
    twitter_link:
      "https://www.wix.com/about/contact-us?referralAdditionalInfo=realDeal",
    custom_settings: {
      textColor: "#b41818",
      backgroundColor: "#e63333",
      fontFamily: "Georgia",
    },
  });

  const [message, setMessage] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const fonts = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Comic Sans MS",
    "Trebuchet MS",
    "Lucida Sans",
    "Tahoma",
    "Impact",
    "Palatino Linotype",
    "Garamond",
    "Roboto",
    "Lato",
    "Montserrat",
    "Open Sans",
    "Poppins",
    "Raleway",
    "Playfair Display",
    "Source Sans Pro",
    "Nunito",
    "Merriweather",
    "Oswald",
    "Quicksand",
    "Ubuntu",
  ];

  const quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"], // Remove formatting
    ],
  };

  const handleDescriptionChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! No token found. Please log in as an admin.");
        return;
      }

      try {
        const response = await api.get("/home/", {
          headers: { Authorization: `Token ${token}` },
        });

        if (response.data) {
          setFormData((prevData) => ({
            ...prevData,
            ...response.data,
            background_video: response.data.background_video
              ? response.data.background_video.split("/").pop() // Extract filename from path
              : null,
            custom_settings: response.data.custom_settings || {
              textColor: "#b41818",
              backgroundColor: "#e63333",
              fontFamily: "Georgia",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching home page content:", error);
        alert("Failed to fetch home page content. Please check the server status.");
      }
    };

    fetchData();
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (
        prevData.custom_settings &&
        Object.keys(prevData.custom_settings).includes(name)
      ) {
        return {
          ...prevData,
          custom_settings: {
            ...prevData.custom_settings,
            [name]: value,
          },
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        background_video: file, // Store the actual file object
      }));
    }
  };
 
  const [lineCount, setLineCount] = useState(3); // Default to 3 lines
  // New function to improve description using AI
  const [improvedDescriptions, setImprovedDescriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleImproveDescription = async () => {
    setIsImproving(true);
    try {
      const response = await api.post("ai/improve-description/", {
        description: formData.description,
      });
  
      if (response.data && response.data.variations) {
        setImprovedDescriptions(response.data.variations); // Assume API returns multiple variations
        setIsModalOpen(true);
      } else {
        alert("No improved variations were returned.");
      }
    } catch (error) {
      console.error("Error improving description:", error);
      alert("Failed to improve description. Please try again later.");
    }
    setIsImproving(false);
  };
  
  const handleSelectDescription = (selectedDescription) => {
    setFormData((prevData) => ({
      ...prevData,
      description: selectedDescription,
    }));
    setIsModalOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "background_video" && value instanceof File) {
        formDataObj.append("background_video", value);
      } else if (key === "custom_settings") {
        const settingsString = JSON.stringify(value);
        try {
          JSON.parse(settingsString); // Validate JSON
          formDataObj.append("custom_settings", settingsString);
        } catch (error) {
          console.error("Invalid JSON format for custom_settings:", error);
        }
      } else {
        formDataObj.append(key, value);
      }
    });

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! No token found. Please log in as an admin.");
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
      setMessage("Home page updated successfully!");
    } catch (error) {
      console.error("Error updating home page:", error);
      alert(
        `Failed to update home page: ${error.response?.data?.detail || "Unknown error"}`
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background video or fallback overlay */}
      {formData.background_video ? (
        <video autoPlay loop muted className="absolute w-full h-full object-cover">
          <source
            src={
              formData.background_video instanceof File
                ? URL.createObjectURL(formData.background_video)
                : `http://127.0.0.1:8000/media/${formData.background_video}`
            }
            type="video/mp4"
          />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          {/* <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Admin Panel - Home Page
          </h1> */}
          <nav className="mt-4">
            <ul className="flex justify-center border-b border-gray-300 pb-2">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  onClick={() => handleTabClick(tab)}
                  className={`mx-4 cursor-pointer pb-2 transition-all duration-300 ${
                    activeTab === tab.name
                      ? "border-b-2 border-red-500 text-red-500 font-semibold"
                      : "text-white hover:text-gray-300"
                  }`}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
          </nav>
          {message && (
            <p className="mt-4 text-green-400 font-semibold">{message}</p>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 rounded-md bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                  <button
                    type="button"
                    onClick={handleImproveDescription}
                    disabled={isImproving}
                    title="Improve your description using AI"
                    className={`flex items-center justify-center px-6 py-2 rounded-full font-medium text-white shadow-lg transition-all duration-200 mt-2
                      ${isImproving ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
                  >
                    {isImproving ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Improving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2a10 10 0 1010 10A10.0114 10.0114 0 0012 2zm0 18a8 8 0 118-8 8.0092 8.0092 0 01-8 8z" />
                          <path d="M11 6h2v6h-2zM11 14h2v2h-2z" />
                        </svg>
                        AI
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">
                    Background Video
                  </label>
                  <input
                    type="file"
                    name="background_video"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-md bg-gray-100 focus:bg-white focus:outline-none transition"
                  />
                  {formData.background_video && (
                    <p className="text-sm text-gray-500 mt-1">
                      Current Video:{" "}
                      {formData.background_video instanceof File
                        ? formData.background_video.name
                        : formData.background_video}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["youtube_link", "linkedin_link", "facebook_link", "twitter_link"].map(
                    (platform) => (
                      <div key={platform}>
                        <label className="block font-semibold mb-1 text-gray-700">
                          {platform.replace("_", " ")}
                        </label>
                        <input
                          type="url"
                          name={platform}
                          value={formData[platform]}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Text Color
                    </label>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.custom_settings.textColor}
                      onChange={handleChange}
                      className="w-full h-10 p-1 rounded-md cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Background Color
                    </label>
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.custom_settings.backgroundColor}
                      onChange={handleChange}
                      className="w-full h-10 p-1 rounded-md cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">
                      Font Family
                    </label>
                    <select
                      name="fontFamily"
                      value={formData.custom_settings.fontFamily}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isModalOpen && (
                  <Dialog 
                    open={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                  >
                    <div className="relative bg-white rounded-lg p-6 max-w-xl w-full shadow-xl z-50 overflow-y-auto max-h-96">
                      <h2 className="text-xl font-semibold mb-4">Choose a description</h2>
                      <ul className="space-y-3">
                        {improvedDescriptions.map((desc, index) => (
                          <li
                            key={index}
                            onClick={() => handleSelectDescription(desc)}
                            className="p-3 border rounded-md cursor-pointer hover:bg-gray-100 transition"
                          >
                            {desc}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition-colors duration-300 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: Preview (Home Component) */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <Home data={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;