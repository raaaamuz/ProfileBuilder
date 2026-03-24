import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download, Briefcase, Award, Code } from 'lucide-react';

/**
 * Dark Profile Style
 * High contrast, bold typography, neon accents
 * Used by: Reflux, Starter Dark templates
 */
const ProfileDark = ({ profileData, accentColor = '#00ff88', isAdminPreview = false }) => {
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
    <div className="min-h-full bg-gray-950 py-12 px-6">
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Profile Image with Glow */}
          <div className="relative inline-block mb-8">
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                className="w-36 h-36 rounded-2xl object-cover border-4"
                style={{ borderColor: accentColor, boxShadow: `0 0 40px ${accentColor}40` }}
              />
            ) : (
              <div
                className="w-36 h-36 rounded-2xl flex items-center justify-center text-5xl font-bold"
                style={{
                  backgroundColor: accentColor,
                  color: '#0a0a0f',
                  boxShadow: `0 0 40px ${accentColor}40`
                }}
              >
                {initials}
              </div>
            )}

            {show_availability && (
              <div
                className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: accentColor, color: '#0a0a0f' }}
              >
                AVAILABLE
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-5xl font-black text-white tracking-tight mb-3">
            {name.toUpperCase()}
          </h1>
          <p className="text-2xl font-medium mb-6" style={{ color: accentColor }}>
            {job_title}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {years_of_experience && (
            <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <div className="text-4xl font-bold text-white mb-1">{years_of_experience}+</div>
              <div className="text-gray-500 text-sm">Years Exp</div>
            </div>
          )}
          <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
            <div className="text-4xl font-bold text-white mb-1">
              <Briefcase className="inline" size={32} />
            </div>
            <div className="text-gray-500 text-sm">Projects</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
            <div className="text-4xl font-bold text-white mb-1">
              <Award className="inline" size={32} />
            </div>
            <div className="text-gray-500 text-sm">Awards</div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">About Me</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {bio}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 transition group"
              >
                <Mail size={20} style={{ color: accentColor }} />
                <span className="text-gray-300 group-hover:text-white transition truncate">{email}</span>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-750 transition group"
              >
                <Phone size={20} style={{ color: accentColor }} />
                <span className="text-gray-300 group-hover:text-white transition">{phone}</span>
              </a>
            )}
            {location && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800">
                <MapPin size={20} style={{ color: accentColor }} />
                <span className="text-gray-300">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Links & CV */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
            >
              <Linkedin size={24} />
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition"
            >
              <Twitter size={24} />
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:border-blue-600 hover:text-blue-600 transition"
            >
              <Facebook size={24} />
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition"
              style={{ ':hover': { borderColor: accentColor } }}
            >
              <Globe size={24} />
            </a>
          )}

          {cv && (
            <a
              href={cv}
              download
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition"
              style={{
                backgroundColor: accentColor,
                color: '#0a0a0f',
              }}
            >
              <Download size={20} />
              Download CV
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDark;
