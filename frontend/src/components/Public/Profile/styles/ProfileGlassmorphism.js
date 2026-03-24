import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download, ArrowRight } from 'lucide-react';

/**
 * Glassmorphism Profile Style
 * Blur effects, glass cards, transparency, gradients
 * Used by: Nexaverse, Glossy Touch templates
 */
const ProfileGlassmorphism = ({ profileData, accentColor = '#00ff88', gradientBg = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', isAdminPreview = false }) => {
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
    <div className="min-h-full py-12 px-6" style={{ background: gradientBg }}>
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
        {/* Main Glass Card */}
        <div
          className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-xl"
                  style={{
                    boxShadow: `0 8px 32px ${accentColor}30`,
                    border: `3px solid ${accentColor}50`
                  }}
                />
              ) : (
                <div
                  className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                    color: '#1a1a2e',
                    boxShadow: `0 8px 32px ${accentColor}30`
                  }}
                >
                  {initials}
                </div>
              )}

              {show_availability && (
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-sm"
                  style={{
                    backgroundColor: `${accentColor}30`,
                    color: accentColor,
                    border: `1px solid ${accentColor}50`
                  }}
                >
                  Open to work
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
              <p className="text-xl mb-4" style={{ color: accentColor }}>{job_title}</p>

              {years_of_experience && (
                <div
                  className="inline-block px-4 py-1 rounded-full text-sm mb-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {years_of_experience}+ years experience
                </div>
              )}

              {bio && (
                <div
                  className="backdrop-blur-sm bg-white/5 rounded-xl p-5 border border-white/10 mt-4"
                >
                  <p className="text-white/80 leading-relaxed">
                    {bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Pills */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm hover:bg-white/20 transition"
              >
                <Mail size={16} style={{ color: accentColor }} />
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm hover:bg-white/20 transition"
              >
                <Phone size={16} style={{ color: accentColor }} />
                {phone}
              </a>
            )}
            {location && (
              <span
                className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm"
              >
                <MapPin size={16} style={{ color: accentColor }} />
                {location}
              </span>
            )}
          </div>

          {/* Social & Actions */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition"
                >
                  <Twitter size={20} />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition"
                >
                  <Facebook size={20} />
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition"
                >
                  <Globe size={20} />
                </a>
              )}
            </div>

            <div className="flex gap-3">
              {cv && (
                <a
                  href={cv}
                  download
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition"
                  style={{
                    backgroundColor: accentColor,
                    color: '#1a1a2e',
                    boxShadow: `0 4px 20px ${accentColor}40`
                  }}
                >
                  <Download size={18} />
                  Download CV
                </a>
              )}
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
              >
                Get in Touch
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGlassmorphism;
