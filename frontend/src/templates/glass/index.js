/**
 * GLASS TEMPLATE
 * Glassmorphism with blur effects, gradients, modern futuristic
 * Inspired by: Nexaverse template
 */

import { Mail, Phone, MapPin, Linkedin, Github, Calendar, GraduationCap, Briefcase, Award, Download, ArrowRight } from 'lucide-react';

const ACCENT = '#00ff88';
const BG_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

// ============================================
// PROFILE SECTION
// ============================================
export const GlassProfile = ({ data, accentColor, backgroundColor, isAdminPreview = false }) => {
  /**
   * PROFILE PICTURE HANDLING
   * ========================
   * profile_picture_preview: New upload preview (base64) or saved URL during preview
   * profile_picture: Saved image URL from backend
   * displayImage: Use preview first, fallback to saved
   * DO NOT MODIFY THIS PATTERN - it ensures images show in both preview and production
   */
  const { name, email, phone, location, bio, profile_picture, profile_picture_preview, job_title, linkedin, github, cv, show_availability, show_download_cv, years_of_experience } = data || {};
  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  // Use provided colors or defaults
  const accent = accentColor || ACCENT;
  const bgStyle = backgroundColor ? { backgroundColor } : { background: BG_GRADIENT };

  // Handle resume download - opens in new tab which triggers PDF download from API
  const handleDownloadResume = () => {
    if (cv) {
      window.open(cv, '_blank');
    }
  };

  return (
    <div className="py-16 px-6" style={{ ...bgStyle, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-10 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-8">
            {displayImage ? (
              <img src={displayImage} alt={name} className="w-32 h-32 rounded-2xl object-cover" style={{ boxShadow: `0 8px 32px ${accent}30`, border: `3px solid ${accent}50` }} />
            ) : (
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)`, color: '#1a1a2e', boxShadow: `0 8px 32px ${accent}30` }}>
                {initials}
              </div>
            )}
            <div className="flex-1">
              {show_availability && (
                <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm" style={{ backgroundColor: `${accent}30`, color: accent, border: `1px solid ${accent}50` }}>
                  Open to work
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 break-words">{name || 'Your Name'}</h1>
              <p className="text-xl mb-2" style={{ color: accent }}>{job_title || 'Professional'}</p>
              {years_of_experience && (
                <span className="inline-block px-4 py-1 rounded-full text-sm backdrop-blur-sm bg-white/10 text-white/80 border border-white/20">
                  {years_of_experience}+ years experience
                </span>
              )}
            </div>
          </div>

          {bio && (
            <div className="mt-8 backdrop-blur-sm bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="text-white/80 leading-relaxed">{bio}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {email && <a href={`mailto:${email}`} className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm hover:bg-white/20 transition"><Mail size={16} style={{ color: accent }} />{email}</a>}
            {phone && <span className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm"><Phone size={16} style={{ color: accent }} />{phone}</span>}
            {location && <span className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-white/90 text-sm"><MapPin size={16} style={{ color: accent }} />{location}</span>}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex gap-3">
              {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20"><Linkedin size={20} /></a>}
              {github && <a href={github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20"><Github size={20} /></a>}
            </div>
            <div className="flex gap-3">
              {cv && show_download_cv !== false && (
                <button onClick={handleDownloadResume} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer" style={{ backgroundColor: accent, color: '#1a1a2e', boxShadow: `0 4px 20px ${accent}40` }}>
                  <Download size={18} />Download CV
                </button>
              )}
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20">Get in Touch<ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDUCATION SECTION
// ============================================
export const GlassEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgStyle = backgroundColor ? { backgroundColor } : { background: BG_GRADIENT };

  return (
    <div className="py-16 px-6" style={{ ...bgStyle, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><GraduationCap style={{ color: accent }} />Education</h2>
        <div className="space-y-4">
          {data.map((entry, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{entry.degree || entry.course}</h3>
                  <p style={{ color: accent }}>{entry.institution || entry.school || entry.university}</p>
                  {entry.description && <div className="text-white/60 text-sm mt-2" dangerouslySetInnerHTML={{ __html: entry.description }} />}
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm">{entry.year || entry.start_year}</div>
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
export const GlassCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgStyle = backgroundColor ? { backgroundColor } : { background: BG_GRADIENT };

  return (
    <div className="py-16 px-6" style={{ ...bgStyle, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Briefcase style={{ color: accent }} />Career</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }} />
          <div className="space-y-6">
            {data.map((entry, i) => (
              <div key={i} className="relative pl-16">
                <div className="absolute left-4 w-5 h-5 rounded-full" style={{ backgroundColor: i === 0 ? accent : 'rgba(255,255,255,0.3)', boxShadow: i === 0 ? `0 0 20px ${accent}` : 'none' }} />
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{entry.title || entry.position}</h3>
                    <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm flex items-center gap-1"><Calendar size={14} />{entry.year || `${entry.start_date || ''} - ${entry.end_date || 'Present'}`}</div>
                  </div>
                  <p style={{ color: accent }}>{entry.company}</p>
                  {entry.description && <div className="text-white/60 text-sm mt-3" dangerouslySetInnerHTML={{ __html: entry.description }} />}
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
export const GlassSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgStyle = backgroundColor ? { backgroundColor } : { background: BG_GRADIENT };

  return (
    <div style={{ ...bgStyle, width: '100%', padding: '64px 24px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%' }}>
        <h2 className="text-2xl font-bold text-white mb-8">Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
          {data.map((skill, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 border border-white/20">
              <div className="flex justify-between mb-3">
                <span className="text-white font-medium">{skill.name}</span>
                <span style={{ color: accent }} className="font-semibold">{skill.proficiency}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />
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
export const GlassAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgStyle = backgroundColor ? { backgroundColor } : { background: BG_GRADIENT };

  return (
    <div className="py-16 px-6" style={{ ...bgStyle, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Award style={{ color: accent }} />Awards</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.map((award, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: `${accent}30` }}>🏆</div>
              <h3 className="font-semibold text-white">{award.title}</h3>
              <p className="text-sm" style={{ color: accent }}>{award.organization}, {award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  Profile: GlassProfile,
  Education: GlassEducation,
  Career: GlassCareer,
  Skills: GlassSkills,
  Awards: GlassAwards,
  style: 'glassmorphism',
  name: 'Glass Futuristic',
  description: 'Modern glassmorphism with blur effects and neon accents',
};
