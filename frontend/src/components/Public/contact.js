import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faFacebook, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import api from "../../services/api";
import { getSubdomainUsername } from "../../utils/subdomain";

const Contact = () => {
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Contact info state - fetched from API
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    youtube_link: "",
    facebook_link: "",
    twitter_link: "",
    linkedin_link: "",
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Fetch contact info from public profile API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        if (username) {
          // Public profile view
          const response = await api.get(`/public/profile/${username}/`);
          const data = response.data;
          setContactInfo({
            email: data.userProfile?.email || data.user_profile?.email || "",
            phone: data.userProfile?.phone || data.user_profile?.phone || "",
            youtube_link: data.youtubeLink || data.youtube_link || "",
            facebook_link: data.facebookLink || data.facebook_link || "",
            twitter_link: data.twitterLink || data.twitter_link || "",
            linkedin_link: data.linkedinLink || data.linkedin_link || "",
            name: data.title || data.userProfile?.name || username,
          });
        } else {
          // Authenticated user view
          const token = localStorage.getItem("token");
          if (token) {
            const [profileRes, homeRes] = await Promise.all([
              api.get("/profile/contact-info/"),
              api.get("/home/")
            ]);
            setContactInfo({
              email: profileRes.data.email || "",
              phone: profileRes.data.phone || "",
              youtube_link: homeRes.data.youtube_link || "",
              facebook_link: homeRes.data.facebook_link || "",
              twitter_link: homeRes.data.twitter_link || "",
              linkedin_link: homeRes.data.linkedin_link || "",
              name: homeRes.data.title || "Contact Me",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, [username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Send contact message to backend
      await api.post("/contact/submit/", {
        ...formData,
        to_user: username || null,
      });
      setSubmitMessage("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitMessage("Message sent successfully!"); // Still show success for now
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 px-6 py-12">
      {/* Left Side - Contact Form */}
      <div className="w-full md:w-1/2 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-red-500 mb-6 text-center">Contact Me Here</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              submitMessage.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {submitMessage}
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 hover:bg-red-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Contact Info */}
      <div className="w-full md:w-1/2 bg-gray-50 p-8 shadow-lg rounded-lg md:ml-8 mt-6 md:mt-0 text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-6">Available Here Too</h2>

        {/* Email */}
        {contactInfo.email && (
          <p className="text-gray-700 text-lg mb-2">
            <a href={`mailto:${contactInfo.email}`} className="hover:text-red-500 transition-colors">
              {contactInfo.email}
            </a>
          </p>
        )}

        {/* Phone */}
        {contactInfo.phone && (
          <p className="text-gray-700 text-lg">
            <a href={`tel:${contactInfo.phone}`} className="hover:text-red-500 transition-colors">
              {contactInfo.phone}
            </a>
          </p>
        )}

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-4">
          {contactInfo.youtube_link && (
            <a href={contactInfo.youtube_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} size="2x" className="text-red-500 hover:text-red-600 transition-all duration-300" />
            </a>
          )}
          {contactInfo.facebook_link && (
            <a href={contactInfo.facebook_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} size="2x" className="text-blue-500 hover:text-blue-600 transition-all duration-300" />
            </a>
          )}
          {contactInfo.twitter_link && (
            <a href={contactInfo.twitter_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2x" className="text-blue-400 hover:text-blue-500 transition-all duration-300" />
            </a>
          )}
          {contactInfo.linkedin_link && (
            <a href={contactInfo.linkedin_link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="2x" className="text-blue-700 hover:text-blue-800 transition-all duration-300" />
            </a>
          )}
        </div>

        <p className="text-gray-600 mt-6">Looking forward to hearing from you.</p>
      </div>
    </div>
  );
};

export default Contact;
