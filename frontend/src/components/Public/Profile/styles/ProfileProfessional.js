import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download } from 'lucide-react';

/**
 * Professional Profile Style
 * Classic, elegant, serif fonts, traditional layout
 * Used by: Elegance template
 */
const ProfileProfessional = ({ profileData, isAdminPreview = false }) => {
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
    <div className="min-h-full bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Professional Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
          {/* Header with dark background */}
          <div className="bg-slate-800 p-8 text-center">
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-5 border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-600 mx-auto mb-5 flex items-center justify-center text-4xl font-serif text-white border-4 border-white">
                {initials}
              </div>
            )}

            <h1 className="text-3xl font-serif text-white mb-1">{name}</h1>
            <p className="text-slate-300 text-lg">{job_title}</p>

            {show_availability && (
              <div className="mt-4 inline-block px-4 py-1.5 rounded bg-emerald-600 text-white text-sm font-medium">
                Available for Opportunities
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* About Section */}
            {bio && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  About
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {bio}
                </p>
              </div>
            )}

            {/* Experience */}
            {years_of_experience && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Experience
                </h3>
                <p className="text-slate-800 font-medium">
                  {years_of_experience}+ years of professional experience
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-4 text-slate-600 hover:text-slate-800 transition">
                    <Mail size={18} className="text-slate-400" />
                    {email}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="flex items-center gap-4 text-slate-600 hover:text-slate-800 transition">
                    <Phone size={18} className="text-slate-400" />
                    {phone}
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-4 text-slate-600">
                    <MapPin size={18} className="text-slate-400" />
                    {location}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(linkedin || twitter || facebook || website) && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Connect
                </h3>
                <div className="flex gap-3">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {twitter && (
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-400 transition"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Download CV */}
            {cv && (
              <div className="pt-6 border-t border-slate-200">
                <a
                  href={cv}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-medium rounded hover:bg-slate-700 transition"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProfessional;
