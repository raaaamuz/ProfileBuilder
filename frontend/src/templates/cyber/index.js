/**
 * CYBER TEMPLATE
 * Dark theme, neon accents, bold typography, stats cards
 * Inspired by: Starter Dark template
 */

import { Mail, Phone, MapPin, Linkedin, Github, Calendar, Briefcase, Award, Download, Code, Trophy } from 'lucide-react';

const ACCENT = '#00ff88';

// Helper to determine if a color is light or dark
const isLightColor = (color) => {
  if (!color) return false;
  const hex = color.replace('#', '');
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

// ============================================
// PROFILE SECTION
// ============================================
export const CyberProfile = ({ data, accentColor, backgroundColor, isAdminPreview = false }) => {
  /**
   * PROFILE PICTURE HANDLING - DO NOT MODIFY
   * profile_picture_preview: New upload preview or current preview URL
   * profile_picture: Saved image URL from backend
   * displayImage: Use preview first, fallback to saved
   */
  const { name, email, phone, location, bio, profile_picture, profile_picture_preview, job_title, linkedin, github, cv, show_availability, show_download_cv, years_of_experience } = data || {};
  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  // Use provided colors or defaults
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || 'rgb(3 7 18)'; // bg-gray-950

  // Handle resume download - opens in new tab which triggers PDF download from API
  const handleDownloadResume = () => {
    if (cv) {
      window.open(cv, '_blank');
    }
  };

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        {/* Hero */}
        <div className="text-center mb-12">
          {displayImage ? (
            <img src={displayImage} alt={name} className="w-36 h-36 rounded-2xl object-cover mx-auto mb-6 border-4" style={{ borderColor: accent, boxShadow: `0 0 40px ${accent}40` }} />
          ) : (
            <div className="w-36 h-36 rounded-2xl mx-auto mb-6 flex items-center justify-center text-5xl font-bold" style={{ backgroundColor: accent, color: '#0a0a0f', boxShadow: `0 0 40px ${accent}40` }}>
              {initials}
            </div>
          )}
          {show_availability && (
            <span className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: accent, color: '#0a0a0f' }}>AVAILABLE</span>
          )}
          <h1 className="text-5xl font-black text-white tracking-tight mb-2">{(name || 'YOUR NAME').toUpperCase()}</h1>
          <p className="text-2xl" style={{ color: accent }}>{job_title || 'PROFESSIONAL'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
            <div className="text-4xl font-bold text-white">{years_of_experience || '5'}+</div>
            <div className="text-gray-500 text-sm">Years Exp</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
            <Briefcase className="mx-auto mb-2 text-white" size={32} />
            <div className="text-gray-500 text-sm">Projects</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
            <Trophy className="mx-auto mb-2 text-white" size={32} />
            <div className="text-gray-500 text-sm">Awards</div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
            <p className="text-gray-300 leading-relaxed text-lg">{bio}</p>
          </div>
        )}

        {/* Contact */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
          <div className="grid grid-cols-3 gap-4">
            {email && <a href={`mailto:${email}`} className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 text-gray-300 hover:text-white"><Mail size={20} style={{ color: accent }} />{email}</a>}
            {phone && <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 text-gray-300"><Phone size={20} style={{ color: accent }} />{phone}</div>}
            {location && <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-800 text-gray-300"><MapPin size={20} style={{ color: accent }} />{location}</div>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"><Linkedin size={24} /></a>}
          {github && <a href={github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"><Github size={24} /></a>}
          {cv && show_download_cv !== false && (
            <button onClick={handleDownloadResume} className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold cursor-pointer" style={{ backgroundColor: accent, color: '#0a0a0f' }}>
              <Download size={20} />Download CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDUCATION SECTION
// ============================================
export const CyberEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || 'rgb(3 7 18)';
  const isLight = isLightColor(backgroundColor);
  const textColor = isLight ? '#1f2937' : '#ffffff';
  const subTextColor = isLight ? '#4b5563' : '#9ca3af';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-black mb-10 tracking-tight" style={{ color: textColor }}>EDUCATION</h2>
        <div className="space-y-4">
          {data.map((entry, i) => (
            <div key={i} className="rounded-xl p-6 border-l-4" style={{ borderColor: accent, backgroundColor: isLight ? '#ffffff' : '#111827' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>{entry.degree || entry.course}</h3>
                  <p style={{ color: accent }}>{entry.institution || entry.school}</p>
                  {entry.description && <div className="text-sm mt-3 prose prose-sm max-w-none" style={{ color: subTextColor }} dangerouslySetInnerHTML={{ __html: entry.description }} />}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: isLight ? '#f3f4f6' : '#1f2937', color: subTextColor }}>{entry.year || entry.start_year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// CAREER SECTION
// ============================================
export const CyberCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || 'rgb(3 7 18)'; // bg-gray-950
  const isLight = isLightColor(backgroundColor);
  const textColor = isLight ? '#1f2937' : '#ffffff';
  const subTextColor = isLight ? '#4b5563' : '#9ca3af';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-black mb-10 tracking-tight" style={{ color: textColor }}>CAREER</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: isLight ? '#e5e7eb' : '#374151' }} />
          <div className="space-y-6">
            {data.map((entry, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-2 w-5 h-5 rounded-full border-4" style={{ borderColor: bgColor, backgroundColor: i === 0 ? accent : '#4b5563', boxShadow: i === 0 ? `0 0 20px ${accent}` : 'none' }} />
                <div className="rounded-xl p-6" style={{ backgroundColor: isLight ? '#ffffff' : '#111827', boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: textColor }}>
                      {entry.title || entry.position}
                      {i === 0 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: accent, color: isLight ? '#ffffff' : '#0a0a0f' }}>CURRENT</span>}
                    </h3>
                    <span className="text-sm flex items-center gap-1" style={{ color: subTextColor }}><Calendar size={14} />{entry.year || `${entry.start_date || ''} - ${entry.end_date || 'Present'}`}</span>
                  </div>
                  <p style={{ color: accent }}>{entry.company}</p>
                  {entry.description && <div className="text-sm mt-3 prose prose-sm max-w-none" style={{ color: subTextColor }} dangerouslySetInnerHTML={{ __html: entry.description }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SKILLS SECTION
// ============================================
export const CyberSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || 'rgb(3 7 18)';
  const isLight = isLightColor(backgroundColor);
  const textColor = isLight ? '#1f2937' : '#ffffff';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-black mb-10 tracking-tight" style={{ color: textColor }}>SKILLS</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.map((skill, i) => (
            <div key={i} className="rounded-xl p-5 border" style={{ backgroundColor: isLight ? '#ffffff' : '#111827', borderColor: isLight ? '#e5e7eb' : '#374151' }}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <Code size={20} style={{ color: accent }} />
                  <span className="font-medium" style={{ color: textColor }}>{skill.name}</span>
                </div>
                <span style={{ color: accent }} className="font-bold">{skill.proficiency}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isLight ? '#e5e7eb' : '#374151' }}>
                <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AWARDS SECTION
// ============================================
export const CyberAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || 'rgb(3 7 18)';
  const isLight = isLightColor(backgroundColor);
  const textColor = isLight ? '#1f2937' : '#ffffff';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-black mb-10 tracking-tight" style={{ color: textColor }}>AWARDS</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.map((award, i) => (
            <div key={i} className="rounded-xl p-6 text-center border transition-colors" style={{ backgroundColor: isLight ? '#ffffff' : '#111827', borderColor: isLight ? '#e5e7eb' : '#374151' }}>
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold mb-1" style={{ color: textColor }}>{award.title}</h3>
              <p style={{ color: accent }}>{award.organization}, {award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  Profile: CyberProfile,
  Education: CyberEducation,
  Career: CyberCareer,
  Skills: CyberSkills,
  Awards: CyberAwards,
  style: 'dark',
  name: 'Cyber Dark',
  description: 'Bold dark theme with neon accents and futuristic feel',
};
