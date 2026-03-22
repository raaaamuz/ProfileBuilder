import React, { useState } from "react";
import {
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaFileDownload,
  FaUser, // Changed from FaUserEdit as it's a display now
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt, // For location
} from 'react-icons/fa'; // Ensure react-icons is installed: npm install react-icons
import { FiLink } from 'react-icons/fi'; // Just for the generic link icon if needed

const AdminProfileSummary = () => {
  // In a real application, this 'profile' data would likely be passed in as props
  // from a parent component (like AdminProfile) or fetched from an API.
  // For this standalone example, we'll keep it in state.
  const [profile, setProfile] = useState({
    name: "Nagarajan",
    bio: "I am Nagarajan, a Market Research professional with more than a decade of experience in the industry. I love reading and talking about customer experience. You can find me on [YouTube], [Facebook], [Twitter], and [LinkedIn].",
    contact: "/contact", // Assuming this is a link to a contact page
    location: "Chennai, India", // Added location
    image: `${process.env.PUBLIC_URL}/profile.jpg`, // Direct URL
    cv: `${process.env.PUBLIC_URL}/Naga_resume.pdf`, // Direct URL
    cvFileName: "Naga_resume.pdf", // Added filename for display
    phone: "+91 9790094922",
    email: "nagaking@outlook.com",
    social: {
      youtube: "https://www.youtube.com/channel/UCEvcyYAo4oeI24gRpDYr0Hw",
      linkedin: "https://www.linkedin.com/in/itsnagarajan/",
      facebook: "https://www.facebook.com/",
      twitter: "https://twitter.com/",
    },
  });

  // Removed all handleChange, handleImageUpload, handleCVUpload as this is now a display component.

  // Re-designed parseBio to return React elements with enhanced styling
  const renderBioWithLinks = (bio) => {
    const socialMap = {
      YouTube: { href: profile.social.youtube, icon: <FaYoutube className="inline-block mr-1" /> },
      LinkedIn: { href: profile.social.linkedin, icon: <FaLinkedin className="inline-block mr-1" /> },
      Facebook: { href: profile.social.facebook, icon: <FaFacebook className="inline-block mr-1" /> },
      Twitter: { href: profile.social.twitter, icon: <FaTwitter className="inline-block mr-1" /> },
    };

    const referenceRegex = /\[(YouTube|LinkedIn|Facebook|Twitter)\]/g;
    return bio.split(referenceRegex).map((part, index) => {
      const socialInfo = socialMap[part];
      if (socialInfo) {
        return (
          <a
            key={index}
            href={socialInfo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors inline-flex items-center"
          >
            {socialInfo.icon} {part}
          </a>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 lg:p-10 text-gray-800">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-purple-700 flex items-center justify-center">
          <FaUser className="mr-3 text-purple-600" /> Your Profile Summary
        </h2>

        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 pb-8 border-b border-gray-200">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-purple-500 shadow-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-purple-100 border-4 border-purple-300 flex items-center justify-center text-purple-500 text-6xl font-bold shadow-lg flex-shrink-0">
              {profile.name ? profile.name[0].toUpperCase() : 'N/A'}
            </div>
          )}
          <div className="text-center md:text-left">
            <h4 className="text-3xl font-bold text-gray-900">{profile.name || "Your Name"}</h4>
            <p className="text-gray-700 text-lg leading-relaxed mt-2">
              {profile.bio ? renderBioWithLinks(profile.bio) : "Your professional bio will appear here, showcasing your expertise and interests."}
            </p>
          </div>
        </div>

        {/* Contact and CV Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mt-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-2xl text-purple-600" />
            <p className="text-lg font-medium">{profile.location || "Location not specified"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaPhone className="text-2xl text-purple-600" />
            <p className="text-lg font-medium">{profile.phone || "Phone number not specified"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-2xl text-purple-600" />
            <p className="text-lg font-medium">
              <a href={`mailto:${profile.email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                {profile.email || "Email not specified"}
              </a>
            </p>
          </div>
          {profile.cv && (
            <div className="flex items-center space-x-4">
              <FaFileDownload className="text-2xl text-purple-600" />
              <a href={profile.cv} download={profile.cvFileName || "CV.pdf"}>
                <button className="bg-green-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors font-medium text-sm">
                  Download CV {profile.cvFileName ? `(${profile.cvFileName})` : ''}
                </button>
              </a>
            </div>
          )}
        </div>

        {/* Social Links Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connect With Me</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {profile.social.youtube && (
              <a href={profile.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold px-5 py-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors shadow-sm text-base">
                <FaYoutube className="mr-3 text-xl" />YouTube
              </a>
            )}
            {profile.social.linkedin && (
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-700 hover:text-blue-800 font-semibold px-5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm text-base">
                <FaLinkedin className="mr-3 text-xl" />LinkedIn
              </a>
            )}
            {profile.social.facebook && (
              <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold px-5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm text-base">
                <FaFacebook className="mr-3 text-xl" />Facebook
              </a>
            )}
            {profile.social.twitter && (
              <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-500 font-semibold px-5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm text-base">
                <FaTwitter className="mr-3 text-xl" />Twitter
              </a>
            )}
            {profile.contact && (
              <a href={profile.contact} className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold px-5 py-2 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors shadow-sm text-base">
                <FiLink className="mr-3 text-xl" />Contact Me
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSummary;