/**
 * GRADIENT TEMPLATE - Bold gradients, split layouts
 */
import { Mail, Phone, MapPin, Linkedin, Github, Download, GraduationCap, Briefcase, Award } from 'lucide-react';

const GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

export const GradientProfile = ({ data, accentColor, backgroundColor, isAdminPreview = false }) => {
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
  const accent = accentColor || '#764ba2';
  const bgGradient = backgroundColor || GRADIENT;
  const sidebarGradient = backgroundColor ? `linear-gradient(180deg, ${accentColor || '#667eea'}, ${accent})` : 'linear-gradient(180deg, #667eea, #764ba2)';

  // Handle resume download - opens in new tab which triggers PDF download from API
  const handleDownloadResume = () => {
    if (cv) {
      window.open(cv, '_blank');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: bgGradient, width: '100%' }}>
      <div className="py-16 px-6">
        <div className={`${isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'} bg-white rounded-3xl overflow-hidden shadow-2xl`}>
          <div className="grid grid-cols-3">
            <div className="p-8 flex flex-col items-center justify-center text-white text-center" style={{ background: sidebarGradient }}>
              {displayImage ? <img src={displayImage} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-white/30 mb-4" /> : <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-4">{initials}</div>}
              <h3 className="font-bold text-lg">{name?.split(' ')[0] || 'Name'}</h3>
              <p className="text-white/80 text-sm">{job_title}</p>
              {show_availability && <span className="mt-3 px-4 py-1 rounded-full text-xs bg-white/20 border border-white/30">Available</span>}
              <div className="flex gap-3 mt-6">
                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white"><Linkedin size={18} /></a>}
                {github && <a href={github} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white"><Github size={18} /></a>}
              </div>
            </div>
            <div className="col-span-2 p-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 break-words">Hello, I'm {name?.split(' ')[0] || 'Name'}</h1>
              <p className="text-xl font-medium mb-4" style={{ color: accent }}>{job_title}</p>
              {years_of_experience && <span className="inline-block px-4 py-2 rounded-full text-sm mb-6" style={{ backgroundColor: `${accent}20`, color: accent }}>{years_of_experience}+ Years</span>}
              {bio && <p className="text-gray-600 leading-relaxed mb-8">{bio}</p>}
              <div className="space-y-2 mb-6">
                {email && <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-600" style={{ '--hover-color': accent }}><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}><Mail size={18} style={{ color: accent }} /></div>{email}</a>}
                {phone && <div className="flex items-center gap-3 text-gray-600"><div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}><Phone size={18} style={{ color: accent }} /></div>{phone}</div>}
              </div>
              {cv && show_download_cv !== false && (
                <button onClick={handleDownloadResume} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold cursor-pointer" style={{ background: bgGradient }}>
                  <Download size={18} />Download CV
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GradientEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#7c3aed';
  const bgGradient = backgroundColor || GRADIENT;

  return (
    <div className="py-16 px-6" style={{ background: bgGradient, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-bold text-white text-center mb-10">Education</h2>
        <div className="space-y-4">
          {data.map((e, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: accent }}><GraduationCap size={24} /></div>
                <div className="flex-1"><h3 className="font-bold text-gray-900">{e.degree || e.course}</h3><p style={{ color: accent }}>{e.institution || e.school}</p></div>
                <span className="text-sm text-gray-500">{e.year || e.start_year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GradientCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#7c3aed';
  const bgGradient = backgroundColor || GRADIENT;

  return (
    <div className="py-16 px-6" style={{ background: bgGradient, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-bold text-white text-center mb-10">Career</h2>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-1 rounded" style={{ backgroundColor: accent }} />
            <div className="grid grid-cols-2 gap-8">
              {data.map((e, i) => (
                <div key={i} className="pt-12">
                  <div className="w-4 h-4 rounded-full mb-4 shadow-lg" style={{ backgroundColor: accent }} />
                  <h3 className="font-bold text-gray-900">{e.title || e.position}</h3>
                  <p style={{ color: accent }}>{e.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{e.year || `${e.start_date || ''} - ${e.end_date || 'Present'}`}</p>
                  {e.description && <p className="text-gray-600 text-sm mt-2">{e.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GradientSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#7c3aed';
  const bgGradient = backgroundColor || GRADIENT;

  return (
    <div className="py-16 px-6" style={{ background: bgGradient, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-bold text-white text-center mb-10">Skills</h2>
        <div className="bg-white rounded-3xl p-8 shadow-2xl grid grid-cols-2 gap-6">
          {data.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">{s.name}</span>
                <span style={{ color: accent }}>{s.proficiency}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, backgroundColor: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GradientAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || '#7c3aed';
  const bgGradient = backgroundColor || GRADIENT;

  return (
    <div className="py-16 px-6" style={{ background: bgGradient, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-4xl mx-auto'}>
        <h2 className="text-3xl font-bold text-white text-center mb-10">Awards</h2>
        <div className="grid grid-cols-2 gap-6">
          {data.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-xl">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)' }}>🏆</div>
              <h3 className="font-bold text-gray-900">{a.title}</h3>
              <p style={{ color: accent }}>{a.organization}, {a.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default { Profile: GradientProfile, Education: GradientEducation, Career: GradientCareer, Skills: GradientSkills, Awards: GradientAwards, style: 'gradient', name: 'Gradient Bold', description: 'Bold gradients with split layouts' };
