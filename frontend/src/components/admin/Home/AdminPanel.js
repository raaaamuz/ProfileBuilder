import React, { useState, useEffect } from "react";
import { Card } from "../../Public/ui/Card"; // Assuming these are styled components
import { Button } from "../../Public/ui/Button"; // Assuming these are styled components
import {
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaTimesCircle, // For clearing files
} from "react-icons/fa"; // You might need to install react-icons: npm install react-icons

const AdminPanel = () => {
  const [profileData, setProfileData] = useState({
    name: "Nagarajan",
    bio: "I am Nagarajan, a Market Research professional with more than a decade of experience in the industry.",
    imageFile: null, // Store the actual File object here
    imageUrl: "", // Store the URL for preview
    phone: "+91 9790094922",
    email: "nagaking@outlook.com",
    linkedin: "https://www.linkedin.com/in/itsnagarajan/",
    youtube: "https://www.youtube.com/channel/UCEvcyYAo4oeI24gRpDYr0Hw",
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    cvFile: null, // Store the actual File object here
    cvFileName: "", // Store the name for display
  });

  // Effect to clean up URL.createObjectURL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (profileData.imageUrl) {
        URL.revokeObjectURL(profileData.imageUrl);
      }
    };
  }, [profileData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (file) {
      if (name === "imageFile") {
        setProfileData((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: URL.createObjectURL(file), // Create URL for preview
        }));
      } else if (name === "cvFile") {
        setProfileData((prev) => ({
          ...prev,
          cvFile: file,
          cvFileName: file.name,
        }));
      }
    }
  };

  const clearFile = (fieldName) => {
    setProfileData((prev) => ({
      ...prev,
      [fieldName]: null,
      ...(fieldName === "imageFile" && { imageUrl: "" }), // Clear image URL too
      ...(fieldName === "cvFile" && { cvFileName: "" }), // Clear CV file name
    }));
    // Also clear the file input visually if possible (requires ref, but for simplicity, we'll skip for now)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    // Future: Send this data to a backend (Django API)
    // You would send profileData.imageFile and profileData.cvFile to your API
    // along with other text fields.
    console.log("Submitted Profile Data:", profileData);
  };

  const InputField = ({ label, name, value, onChange, type = "text", icon: Icon, placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={`w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm ${
            Icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 mt-20">
          Admin Panel
        </h1>
        <Card className="p-8 shadow-2xl rounded-3xl bg-white border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative avatar-wrapper">
                      {profileData.imageUrl ? (
                        <img
                          src={profileData.imageUrl}
                          alt="Profile Preview"
                          className="avatar-image w-24 h-24 rounded-full object-cover border-2 border-red-400 shadow-md"
                        />
                      ) : (
                        <div className="avatar-placeholder w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                          NA
                        </div>
                      )}
                      {profileData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => clearFile("imageFile")}
                          className="absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Remove image"
                        >
                          <FaTimesCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        name="imageFile"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                        accept="image/*"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <InputField
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm resize-y"
                ></textarea>
              </div>
            </div>

            {/* Section: Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  icon={FaPhone}
                  placeholder="+91 12345 67890"
                />
                <InputField
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  type="email"
                  icon={FaEnvelope}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Section: Social Links */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="LinkedIn Profile"
                  name="linkedin"
                  value={profileData.linkedin}
                  onChange={handleChange}
                  icon={FaLinkedin}
                  placeholder="https://www.linkedin.com/in/yourprofile/"
                />
                <InputField
                  label="YouTube Channel"
                  name="youtube"
                  value={profileData.youtube}
                  onChange={handleChange}
                  icon={FaYoutube}
                  placeholder="https://www.youtube.com/channel/yourchannel"
                />
                <InputField
                  label="Facebook Profile"
                  name="facebook"
                  value={profileData.facebook}
                  onChange={handleChange}
                  icon={FaFacebook}
                  placeholder="https://www.facebook.com/yourprofile"
                />
                <InputField
                  label="Twitter Profile"
                  name="twitter"
                  value={profileData.twitter}
                  onChange={handleChange}
                  icon={FaTwitter}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>
            </div>

            {/* Section: Documents */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Documents
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CV
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    name="cvFile"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                  />
                  {profileData.cvFileName && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="truncate max-w-[150px] md:max-w-none">
                        {profileData.cvFileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => clearFile("cvFile")}
                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Remove CV"
                      >
                        <FaTimesCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PDF, DOC, DOCX up to 5MB
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <Button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 transform hover:scale-105"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;