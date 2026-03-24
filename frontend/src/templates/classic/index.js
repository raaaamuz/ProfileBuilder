/**
 * CLASSIC TEMPLATE
 * Traditional professional design, sidebar layout, elegant typography
 * Inspired by: Corporate resumes and traditional portfolios
 */

import { Mail, Phone, MapPin, Linkedin, Github, Calendar, GraduationCap, Briefcase, Award, Download, ExternalLink } from 'lucide-react';

const PRIMARY = '#1e3a5f';
const ACCENT = '#c9a227';

// ============================================
// PROFILE SECTION - Sidebar layout
// ============================================
export const ClassicProfile = ({ data, accentColor, backgroundColor, isAdminPreview = false }) => {
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
  const primary = backgroundColor || PRIMARY;
  const accent = accentColor || ACCENT;

  // Handle resume download - opens in new tab which triggers PDF download from API
  const handleDownloadResume = () => {
    if (cv) {
      window.open(cv, '_blank');
    }
  };

  return (
    <div className="bg-gray-100" style={{ width: '100%' }}>
      <div className={`${isAdminPreview ? 'w-full' : 'max-w-5xl mx-auto'} py-12 px-6`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-3">
            {/* Sidebar */}
            <div className="p-8 text-white" style={{ backgroundColor: primary }}>
              <div className="text-center mb-8">
                {displayImage ? (
                  <img src={displayImage} alt={name} className="w-32 h-32 rounded-full object-cover mx-auto border-4" style={{ borderColor: accent }} />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-serif border-4" style={{ borderColor: accent, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    {initials}
                  </div>
                )}
                <h1 className="text-2xl font-serif mt-4">{name || 'Your Name'}</h1>
                <p className="text-sm opacity-80 mt-1">{job_title || 'Professional'}</p>
              </div>

              <div className="space-y-4 text-sm">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-3 opacity-90 hover:opacity-100">
                    <Mail size={16} style={{ color: accent }} />
                    <span className="truncate">{email}</span>
                  </a>
                )}
                {phone && (
                  <div className="flex items-center gap-3 opacity-90">
                    <Phone size={16} style={{ color: accent }} />
                    <span>{phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3 opacity-90">
                    <MapPin size={16} style={{ color: accent }} />
                    <span>{location}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex justify-center gap-4">
                  {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100"><Linkedin size={20} /></a>}
                  {github && <a href={github} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100"><Github size={20} /></a>}
                </div>
              </div>

              {cv && show_download_cv !== false && (
                <button onClick={handleDownloadResume} className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded text-sm font-medium cursor-pointer" style={{ backgroundColor: accent, color: primary }}>
                  <Download size={16} />Download CV
                </button>
              )}
            </div>

            {/* Main Content */}
            <div className="col-span-2 p-10">
              <div className="mb-8">
                {show_availability && (
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded mb-4" style={{ backgroundColor: `${accent}20`, color: primary }}>
                    Available for Opportunities
                  </span>
                )}
                <h2 className="text-3xl font-serif mb-2" style={{ color: primary }}>About Me</h2>
                <div className="w-16 h-1 rounded mb-6" style={{ backgroundColor: accent }} />
                {bio && <p className="text-gray-600 leading-relaxed">{bio}</p>}
              </div>

              {years_of_experience && (
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${primary}08` }}>
                    <div className="text-3xl font-serif" style={{ color: primary }}>{years_of_experience}+</div>
                    <div className="text-sm text-gray-500 mt-1">Years Experience</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${primary}08` }}>
                    <Briefcase className="mx-auto mb-2" style={{ color: accent }} size={28} />
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${primary}08` }}>
                    <Award className="mx-auto mb-2" style={{ color: accent }} size={28} />
                    <div className="text-sm text-gray-500">Awards</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDUCATION SECTION - Horizontal cards
// ============================================
export const ClassicEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || '#f3f4f6'; // bg-gray-100

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-5xl mx-auto'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif" style={{ color: PRIMARY }}>Education</h2>
          <div className="w-16 h-1 rounded mx-auto mt-3" style={{ backgroundColor: accent }} />
        </div>

        <div className="space-y-6">
          {data.map((entry, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex">
                <div className="w-2" style={{ backgroundColor: accent }} />
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}10` }}>
                        <GraduationCap size={24} style={{ color: PRIMARY }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: PRIMARY }}>{entry.degree || entry.course}</h3>
                        <p className="text-gray-600">{entry.institution || entry.school}</p>
                        {entry.description && <div className="text-gray-500 text-sm mt-2" dangerouslySetInnerHTML={{ __html: entry.description }} />}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: `${accent}20`, color: PRIMARY }}>
                      {entry.year || entry.start_year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// CAREER SECTION - Traditional timeline
// ============================================
export const ClassicCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || '#ffffff';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-5xl mx-auto'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif" style={{ color: PRIMARY }}>Professional Experience</h2>
          <div className="w-16 h-1 rounded mx-auto mt-3" style={{ backgroundColor: accent }} />
        </div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ backgroundColor: `${PRIMARY}20` }} />

          <div className="space-y-12">
            {data.map((entry, i) => (
              <div key={i} className={`relative flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content */}
                <div className="w-5/12">
                  <div className={`bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-lg font-semibold" style={{ color: PRIMARY }}>{entry.title || entry.position}</h3>
                    <p style={{ color: accent }} className="font-medium">{entry.company}</p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}">
                      <Calendar size={14} />
                      {entry.year || `${entry.start_date || ''} - ${entry.end_date || 'Present'}`}
                    </p>
                    {entry.description && <div className="text-gray-600 text-sm mt-3" dangerouslySetInnerHTML={{ __html: entry.description }} />}
                  </div>
                </div>

                {/* Center dot */}
                <div className="w-2/12 flex justify-center">
                  <div className="w-4 h-4 rounded-full border-4 bg-white" style={{ borderColor: i === 0 ? accent : PRIMARY }} />
                </div>

                {/* Empty space */}
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SKILLS SECTION - Elegant bars
// ============================================
export const ClassicSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || '#f3f4f6'; // bg-gray-100

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-5xl mx-auto'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif" style={{ color: PRIMARY }}>Skills & Expertise</h2>
          <div className="w-16 h-1 rounded mx-auto mt-3" style={{ backgroundColor: accent }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {data.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium" style={{ color: PRIMARY }}>{skill.name}</span>
                  <span className="text-gray-500 text-sm">{skill.proficiency}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%`, backgroundColor: accent }}
                  />
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
// AWARDS SECTION - Certificate style
// ============================================
export const ClassicAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;
  const bgColor = backgroundColor || '#ffffff';

  return (
    <div className="py-16 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-5xl mx-auto'}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif" style={{ color: PRIMARY }}>Awards & Recognition</h2>
          <div className="w-16 h-1 rounded mx-auto mt-3" style={{ backgroundColor: accent }} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {data.map((award, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6 border-2 border-dashed" style={{ borderColor: `${accent}50` }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}20` }}>
                  <Award size={24} style={{ color: accent }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: PRIMARY }}>{award.title}</h3>
                  <p className="text-gray-600 text-sm">{award.organization}</p>
                  <p className="text-sm mt-2" style={{ color: accent }}>{award.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  Profile: ClassicProfile,
  Education: ClassicEducation,
  Career: ClassicCareer,
  Skills: ClassicSkills,
  Awards: ClassicAwards,
  style: 'classic',
  name: 'Classic Professional',
  description: 'Traditional professional design with elegant typography and sidebar layout',
};
