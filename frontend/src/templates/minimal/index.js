/**
 * MINIMAL TEMPLATE
 * Clean, lots of whitespace, simple typography, subtle shadows
 * Inspired by: Mini Profile template
 */

import { Mail, Phone, MapPin, Linkedin, Github, Calendar, Building, Award, Download } from 'lucide-react';

// ============================================
// PROFILE SECTION
// ============================================
export const MinimalProfile = ({ data, accentColor, backgroundColor, isAdminPreview = false }) => {
  /**
   * PROFILE PICTURE HANDLING - DO NOT MODIFY
   * profile_picture_preview: New upload preview or current preview URL
   * profile_picture: Saved image URL from backend
   * displayImage: Use preview first, fallback to saved
   */
  const { name, email, phone, location, bio, profile_picture, profile_picture_preview, job_title, linkedin, github, cv, show_availability, show_download_cv } = data || {};
  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  // Use provided colors or defaults
  const accent = accentColor || '#6366f1';
  const bgColor = backgroundColor || '#f9fafb';

  // Handle resume download - opens in new tab which triggers PDF download from API
  const handleDownloadResume = () => {
    if (cv) {
      window.open(cv, '_blank');
    }
  };

  return (
    <div className="py-20 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-2xl mx-auto'}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10">
          <div className="flex items-start gap-8">
            {displayImage ? (
              <img src={displayImage} alt={name} className="w-24 h-24 rounded-full object-cover" style={{ borderColor: accent, borderWidth: '2px' }} />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-light" style={{ backgroundColor: `${accent}15`, color: accent }}>
                {initials}
              </div>
            )}
            <div className="flex-1">
              {show_availability && (
                <span className="inline-block px-3 py-1 text-xs rounded-full mb-3" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  Available for work
                </span>
              )}
              <h1 className="text-3xl font-light text-gray-900 mb-1">{name || 'Your Name'}</h1>
              <p className="text-lg mb-4" style={{ color: accent }}>{job_title || 'Professional'}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-500">
            {email && <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gray-700"><Mail size={16} style={{ color: accent }} />{email}</a>}
            {phone && <span className="flex items-center gap-2"><Phone size={16} style={{ color: accent }} />{phone}</span>}
            {location && <span className="flex items-center gap-2"><MapPin size={16} style={{ color: accent }} />{location}</span>}
          </div>

          <div className="mt-6 flex gap-4">
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600"><Linkedin size={20} /></a>}
            {github && <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600"><Github size={20} /></a>}
            {cv && show_download_cv !== false && (
              <button onClick={handleDownloadResume} className="ml-auto flex items-center gap-2 px-4 py-2 rounded text-sm cursor-pointer text-white" style={{ backgroundColor: accent }}>
                <Download size={16} />Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDUCATION SECTION
// ============================================
export const MinimalEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#6366f1';
  const displayData = data.length > 0 ? data : [
    { degree: 'Master of Computer Science', institution: 'Stanford University', year: '2022', description: 'Machine Learning' },
    { degree: 'Bachelor of Engineering', institution: 'MIT', year: '2020', description: 'Computer Science' },
  ];

  return (
    <div className="bg-white py-20 px-6" style={{ ...(backgroundColor ? { backgroundColor } : {}), width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-2xl mx-auto'}>
        <h2 className="text-2xl font-light text-gray-900 mb-12">Education</h2>
        <div className="space-y-8">
          {displayData.map((entry, i) => (
            <div key={i} className="border-l-2 pl-6 relative" style={{ borderColor: accent }}>
              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
              <span className="text-sm text-gray-400">{entry.year || entry.start_year}</span>
              <h3 className="text-lg font-medium text-gray-900 mt-1">{entry.degree || entry.course}</h3>
              <p className="text-gray-500">{entry.institution || entry.school}</p>
              {entry.description && <div className="text-sm text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: entry.description }} />}
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
export const MinimalCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#6366f1';
  const bgColor = backgroundColor || '#f9fafb'; // bg-gray-50

  return (
    <div className="py-20 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-2xl mx-auto'}>
        <h2 className="text-2xl font-light text-gray-900 mb-12">Experience</h2>
        <div className="space-y-10">
          {data.map((entry, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-medium text-gray-900">{entry.title || entry.position}</h3>
                <span className="text-sm flex items-center gap-1" style={{ color: accent }}>
                  <Calendar size={14} />
                  {entry.year || `${entry.start_date || ''} - ${entry.end_date || 'Present'}`}
                </span>
              </div>
              <p className="text-gray-500 flex items-center gap-2"><Building size={16} />{entry.company}</p>
              {entry.description && <div className="text-sm text-gray-600 mt-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.description }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SKILLS SECTION
// ============================================
export const MinimalSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#9ca3af'; // gray-400
  const bgColor = backgroundColor || '#ffffff';

  const displayData = data.length > 0 ? data : [
    { name: 'JavaScript', proficiency: 90 },
    { name: 'Python', proficiency: 85 },
    { name: 'React', proficiency: 88 },
    { name: 'Node.js', proficiency: 80 },
  ];

  return (
    <div className="py-20 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-2xl mx-auto'}>
        <h2 className="text-2xl font-light text-gray-900 mb-12">Skills</h2>
        <div className="grid grid-cols-2 gap-6">
          {displayData.map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">{skill.name}</span>
                <span style={{ color: accent }}>{skill.proficiency}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: accent }} />
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
export const MinimalAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#9ca3af'; // gray-400
  const bgColor = backgroundColor || '#f9fafb'; // bg-gray-50

  const displayData = data.length > 0 ? data : [
    { title: 'Best Innovation Award', organization: 'Google', year: '2023' },
    { title: 'Employee of the Year', organization: 'Microsoft', year: '2021' },
  ];

  return (
    <div className="py-20 px-6" style={{ backgroundColor: bgColor, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-2xl mx-auto'}>
        <h2 className="text-2xl font-light text-gray-900 mb-12">Awards</h2>
        <div className="space-y-4">
          {displayData.map((award, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <Award size={20} style={{ color: accent }} />
                <div>
                  <h3 className="font-medium text-gray-900">{award.title}</h3>
                  <p className="text-sm text-gray-500">{award.organization}</p>
                </div>
              </div>
              <span className="text-sm" style={{ color: accent }}>{award.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export all components
export default {
  Profile: MinimalProfile,
  Education: MinimalEducation,
  Career: MinimalCareer,
  Skills: MinimalSkills,
  Awards: MinimalAwards,
  style: 'minimal',
  name: 'Minimal Clean',
  description: 'Clean design with lots of whitespace and subtle typography',
};
