import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Globe, Download, ArrowRight } from 'lucide-react';

/**
 * Gradient Profile Style
 * Bold gradients, colorful backgrounds, modern look
 * Used by: Personal Shape template
 */
const ProfileGradient = ({ profileData, isAdminPreview = false }) => {
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
    <div className="min-h-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="py-12 px-6">
        <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}`}>
          {/* Split Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Left Gradient Panel */}
              <div
                className="p-8 flex flex-col items-center justify-center text-white text-center"
                style={{ background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' }}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/30 mb-5 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold mb-5 border-4 border-white/30">
                    {initials}
                  </div>
                )}

                <h3 className="font-bold text-xl mb-1">{name.split(' ')[0]}</h3>
                <p className="text-white/80 text-sm mb-4">{job_title}</p>

                {show_availability && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
                    Available for hire
                  </span>
                )}

                {/* Social Icons */}
                <div className="flex gap-3 mt-6">
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                      <Twitter size={20} />
                    </a>
                  )}
                  {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                      <Facebook size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Content Panel */}
              <div className="col-span-2 p-8 md:p-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello, I'm {name.split(' ')[0]}</h1>
                <p className="text-xl font-medium text-purple-600 mb-6">{job_title}</p>

                {years_of_experience && (
                  <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mb-6">
                    {years_of_experience}+ Years of Experience
                  </div>
                )}

                {bio && (
                  <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                    {bio}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-3 mb-8">
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Mail size={18} className="text-purple-600" />
                      </div>
                      {email}
                    </a>
                  )}
                  {phone && (
                    <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Phone size={18} className="text-purple-600" />
                      </div>
                      {phone}
                    </a>
                  )}
                  {location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <MapPin size={18} className="text-purple-600" />
                      </div>
                      {location}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <Mail size={18} />
                    Get in Touch
                    <ArrowRight size={18} />
                  </button>
                  {cv && (
                    <a
                      href={cv}
                      download
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                    >
                      <Download size={18} />
                      Download CV
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGradient;
