import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download } from 'lucide-react';

/**
 * Minimal Profile Style
 * Clean, lots of whitespace, subtle shadows, professional look
 * Used by: Mini Profile, Personal Shape templates
 */
const ProfileMinimal = ({ profileData, isAdminPreview = false }) => {
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
    <div className="min-h-full bg-gray-50 py-16 px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-light border-4 border-gray-50">
                    {initials}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {show_availability && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 mb-3">
                    Available for opportunities
                  </span>
                )}

                <h1 className="text-3xl font-light text-gray-900 mb-1">{name}</h1>
                <p className="text-lg text-gray-500 mb-4">{job_title}</p>

                {years_of_experience && (
                  <p className="text-sm text-gray-400 mb-4">{years_of_experience} years of experience</p>
                )}

                {bio && (
                  <p className="text-gray-600 leading-relaxed text-sm max-w-lg">
                    {bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-gray-100 px-8 md:px-12 py-6 bg-gray-50/50">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gray-700 transition">
                  <Mail size={16} className="text-gray-400" />
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-gray-700 transition">
                  <Phone size={16} className="text-gray-400" />
                  {phone}
                </a>
              )}
              {location && (
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {location}
                </span>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(linkedin || twitter || facebook || website) && (
            <div className="border-t border-gray-100 px-8 md:px-12 py-4">
              <div className="flex gap-4">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                    <Linkedin size={20} />
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                    <Twitter size={20} />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition">
                    <Facebook size={20} />
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Download CV */}
          {cv && (
            <div className="border-t border-gray-100 px-8 md:px-12 py-4">
              <a
                href={cv}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <Download size={16} />
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileMinimal;
