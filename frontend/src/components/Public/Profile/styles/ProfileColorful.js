import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download, Sparkles, Rocket, Target } from 'lucide-react';

/**
 * Colorful Profile Style
 * Vibrant, playful, fun borders and emojis
 * Used by: First Portfolio template
 */
const ProfileColorful = ({ profileData, isAdminPreview = false }) => {
  const {
    name = 'Your Name',
    email = '',
    phone = '',
    location = '',
    bio = '',
    profile_picture = null,
    profile_picture_preview = null,
    job_title = 'Professional',
    linkedin = '',
    twitter = '',
    facebook = '',
    website = '',
    cv = null,
    show_availability = false,
    years_of_experience = '',
  } = profileData || {};

  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  return (
    <div className="min-h-full py-12 px-6" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Fun Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-4 border-yellow-400">
          {/* Header with decorations */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={name}
                  className="w-36 h-36 rounded-full object-cover shadow-lg"
                  style={{
                    border: '6px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #f472b6, #a855f7, #6366f1) border-box'
                  }}
                />
              ) : (
                <div
                  className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #6366f1 100%)' }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-md">
                ✨
              </div>
            </div>

            <h1
              className="text-5xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {name}
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-4">{job_title}</p>

            {show_availability && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium border-2 border-green-300">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Available for opportunities!
              </div>
            )}
          </div>

          {/* Fun tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-5 py-2.5 rounded-full bg-pink-100 text-pink-600 font-semibold flex items-center gap-2">
              <Rocket size={18} /> Creative
            </span>
            <span className="px-5 py-2.5 rounded-full bg-purple-100 text-purple-600 font-semibold flex items-center gap-2">
              <Sparkles size={18} /> Innovative
            </span>
            <span className="px-5 py-2.5 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center gap-2">
              <Target size={18} /> Focused
            </span>
          </div>

          {/* Bio */}
          {bio && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
              <p className="text-gray-700 leading-relaxed text-center text-lg">
                {bio}
              </p>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-pink-100 text-pink-700 font-medium hover:bg-pink-200 transition border-2 border-pink-200"
              >
                <Mail size={18} />
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition border-2 border-purple-200"
              >
                <Phone size={18} />
                {phone}
              </a>
            )}
            {location && (
              <span className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-100 text-blue-700 font-medium border-2 border-blue-200">
                <MapPin size={18} />
                {location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition border-2 border-blue-200"
              >
                <Linkedin size={24} />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 hover:bg-sky-200 transition border-2 border-sky-200"
              >
                <Twitter size={24} />
              </a>
            )}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition border-2 border-indigo-200"
              >
                <Facebook size={24} />
              </a>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition border-2 border-gray-200"
              >
                <Globe size={24} />
              </a>
            )}
          </div>

          {/* CV Download */}
          {cv && (
            <div className="text-center">
              <button
                onClick={() => window.open(cv, '_blank')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition transform hover:scale-105 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #6366f1 100%)' }}
              >
                <Download size={22} />
                Download My Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileColorful;
