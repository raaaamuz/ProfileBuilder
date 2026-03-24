/**
 * DEVELOPER TEMPLATE - Split Screen Layout
 * Fixed sidebar profile, scrolling main content
 * Inspired by modern developer portfolios like Brittany Chiang, Josh Comeau
 */

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, ExternalLink, Calendar, Download, ChevronRight, Terminal, Code2, Briefcase, GraduationCap, Award, Wrench } from 'lucide-react';

const ACCENT = '#64ffda';
const BG_DARK = '#0a192f';
const BG_LIGHT = '#112240';
const TEXT_PRIMARY = '#ccd6f6';
const TEXT_SECONDARY = '#8892b0';

// ============================================
// MAIN LAYOUT WRAPPER - Split Screen
// ============================================
export const DeveloperLayout = ({ children, profileData }) => {
  const [activeSection, setActiveSection] = useState('about');
  const { name, job_title, email, linkedin, github, twitter, profile_picture, profile_picture_preview, bio, show_availability } = profileData || {};
  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  // Track scroll position to highlight nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'skills', 'projects'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About', num: '01' },
    { id: 'experience', label: 'Experience', num: '02' },
    { id: 'education', label: 'Education', num: '03' },
    { id: 'skills', label: 'Skills', num: '04' },
    { id: 'projects', label: 'Projects', num: '05' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_DARK }}>
      {/* Fixed Left Sidebar - Profile */}
      <aside className="fixed left-0 top-0 w-[45%] h-screen flex flex-col justify-between p-12 lg:p-16" style={{ backgroundColor: BG_DARK }}>
        <div>
          {/* Profile Image */}
          <div className="mb-8">
            {displayImage ? (
              <img src={displayImage} alt={name} className="w-24 h-24 rounded-full object-cover border-2" style={{ borderColor: ACCENT }} />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: BG_LIGHT, color: ACCENT }}>
                {initials}
              </div>
            )}
          </div>

          {/* Name & Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 break-words" style={{ color: TEXT_PRIMARY }}>{name || 'Your Name'}</h1>
          <h2 className="text-xl lg:text-2xl font-medium mb-4" style={{ color: TEXT_SECONDARY }}>{job_title || 'Software Developer'}</h2>

          {show_availability && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-6" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
              Available for opportunities
            </div>
          )}

          {/* Short Bio */}
          <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: TEXT_SECONDARY }}>
            {bio?.slice(0, 200) || 'Building digital experiences that make a difference.'}
            {bio?.length > 200 && '...'}
          </p>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-4 py-2 transition-all duration-300"
                style={{ color: activeSection === item.id ? ACCENT : TEXT_SECONDARY }}
              >
                <span className="w-8 h-px transition-all duration-300" style={{ backgroundColor: activeSection === item.id ? ACCENT : TEXT_SECONDARY, width: activeSection === item.id ? '64px' : '32px' }} />
                <span className="text-xs font-mono" style={{ color: ACCENT }}>{item.num}.</span>
                <span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          {github && <a href={github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: TEXT_SECONDARY }}><Github size={22} /></a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: TEXT_SECONDARY }}><Linkedin size={22} /></a>}
          {twitter && <a href={twitter} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-80" style={{ color: TEXT_SECONDARY }}><Twitter size={22} /></a>}
          {email && <a href={`mailto:${email}`} className="transition-colors hover:opacity-80" style={{ color: TEXT_SECONDARY }}><Mail size={22} /></a>}
        </div>
      </aside>

      {/* Scrolling Right Content */}
      <main className="ml-[45%] min-h-screen p-12 lg:p-16" style={{ backgroundColor: BG_DARK }}>
        {children}
      </main>
    </div>
  );
};

// ============================================
// PROFILE SECTION (for standalone use)
// ============================================
export const DeveloperProfile = ({ data, isAdminPreview = false }) => {
  const { name, email, phone, location, bio, profile_picture, profile_picture_preview, job_title, linkedin, github, cv, show_availability, show_download_cv, years_of_experience } = data || {};
  const displayImage = profile_picture_preview || profile_picture;
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'YN';

  const handleDownloadResume = () => {
    if (cv) window.open(cv, '_blank');
  };

  return (
    <section id="about" className="py-24" style={{ backgroundColor: BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-8" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: ACCENT }} className="font-mono text-xl">01.</span>
          About Me
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4" style={{ color: TEXT_SECONDARY }}>
            <p className="leading-relaxed">{bio || 'Your professional bio goes here...'}</p>

            {years_of_experience && (
              <div className="flex items-center gap-4 mt-6">
                <div className="px-4 py-2 rounded" style={{ backgroundColor: BG_LIGHT }}>
                  <span className="text-3xl font-bold" style={{ color: ACCENT }}>{years_of_experience}+</span>
                  <p className="text-sm" style={{ color: TEXT_SECONDARY }}>Years Experience</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors" style={{ backgroundColor: BG_LIGHT, color: TEXT_SECONDARY }}>
                  <Mail size={16} style={{ color: ACCENT }} /> {email}
                </a>
              )}
              {phone && (
                <span className="flex items-center gap-2 px-4 py-2 rounded text-sm" style={{ backgroundColor: BG_LIGHT, color: TEXT_SECONDARY }}>
                  <Phone size={16} style={{ color: ACCENT }} /> {phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-2 px-4 py-2 rounded text-sm" style={{ backgroundColor: BG_LIGHT, color: TEXT_SECONDARY }}>
                  <MapPin size={16} style={{ color: ACCENT }} /> {location}
                </span>
              )}
            </div>

            {cv && show_download_cv !== false && (
              <button onClick={handleDownloadResume} className="mt-6 flex items-center gap-2 px-6 py-3 rounded font-medium transition-all hover:opacity-90" style={{ backgroundColor: 'transparent', color: ACCENT, border: `1px solid ${ACCENT}` }}>
                <Download size={18} /> Download Resume
              </button>
            )}
          </div>

          <div className="relative group">
            {displayImage ? (
              <div className="relative">
                <img src={displayImage} alt={name} className="rounded relative z-10 grayscale hover:grayscale-0 transition-all duration-300" />
                <div className="absolute inset-0 rounded border-2 translate-x-4 translate-y-4 -z-0 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" style={{ borderColor: ACCENT }} />
              </div>
            ) : (
              <div className="w-full aspect-square rounded flex items-center justify-center text-4xl font-bold" style={{ backgroundColor: BG_LIGHT, color: ACCENT }}>
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CAREER/EXPERIENCE SECTION
// ============================================
export const DeveloperCareer = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  return (
    <section id="experience" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">02.</span>
          Where I've Worked
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="space-y-12">
          {data.map((entry, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: i === 0 ? accent : TEXT_SECONDARY }} />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold" style={{ color: TEXT_PRIMARY }}>
                    {entry.title || entry.position}
                    <span style={{ color: accent }}> @ {entry.company}</span>
                  </h3>
                  <p className="font-mono text-sm mb-4" style={{ color: TEXT_SECONDARY }}>
                    {entry.year || `${entry.start_date || ''} - ${entry.end_date || 'Present'}`}
                  </p>
                  {entry.description && (
                    <div className="space-y-2">
                      {entry.description.split('.').filter(s => s.trim()).map((point, j) => (
                        <p key={j} className="flex items-start gap-3" style={{ color: TEXT_SECONDARY }}>
                          <ChevronRight size={16} style={{ color: accent }} className="flex-shrink-0 mt-1" />
                          <span>{point.trim()}.</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// EDUCATION SECTION
// ============================================
export const DeveloperEducation = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  return (
    <section id="education" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">03.</span>
          Education
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="space-y-8">
          {data.map((entry, i) => (
            <div key={i} className="p-6 rounded-lg border transition-all hover:border-opacity-50" style={{ backgroundColor: BG_LIGHT, borderColor: `${accent}20` }}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>{entry.degree || entry.course}</h3>
                  <p style={{ color: accent }}>{entry.institution || entry.school}</p>
                </div>
                <span className="font-mono text-sm px-3 py-1 rounded" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  {entry.year || entry.start_year}
                </span>
              </div>
              {entry.description && <div className="mt-3" style={{ color: TEXT_SECONDARY }} dangerouslySetInnerHTML={{ __html: entry.description }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// SKILLS SECTION - Terminal Style
// ============================================
export const DeveloperSkills = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  return (
    <section id="skills" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">04.</span>
          Skills & Technologies
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        {/* Terminal-style skill display */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1d2433', border: '1px solid #2d3748' }}>
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#0d1117' }}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-sm font-mono" style={{ color: TEXT_SECONDARY }}>skills.sh</span>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm">
            <p style={{ color: TEXT_SECONDARY }}>$ list-skills --proficiency</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {data.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span style={{ color: accent }}>{'>'}</span>
                  <span style={{ color: TEXT_PRIMARY }}>{skill.name}</span>
                  <span style={{ color: TEXT_SECONDARY }}>({skill.proficiency}%)</span>
                </div>
              ))}
            </div>
            <p className="mt-6" style={{ color: accent }}>$ _<span className="animate-pulse">|</span></p>
          </div>
        </div>

        {/* Visual skill bars */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          {data.slice(0, 8).map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: TEXT_PRIMARY }}>{skill.name}</span>
                <span className="text-sm font-mono" style={{ color: accent }}>{skill.proficiency}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: BG_LIGHT }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${skill.proficiency}%`, backgroundColor: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// AWARDS SECTION
// ============================================
export const DeveloperAwards = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  return (
    <section id="awards" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">05.</span>
          Awards & Recognition
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {data.map((award, i) => (
            <div key={i} className="p-6 rounded-lg border transition-all hover:border-opacity-50 group" style={{ backgroundColor: BG_LIGHT, borderColor: `${accent}20` }}>
              <Award size={32} style={{ color: accent }} className="mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1" style={{ color: TEXT_PRIMARY }}>{award.title}</h3>
              <p className="text-sm" style={{ color: TEXT_SECONDARY }}>{award.organization}</p>
              <p className="text-sm font-mono mt-2" style={{ color: accent }}>{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// SERVICES SECTION (NEW)
// ============================================
export const DeveloperServices = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  const defaultServices = [
    { title: 'Web Development', description: 'Full-stack web applications using modern frameworks', icon: 'code' },
    { title: 'API Development', description: 'RESTful and GraphQL API design and implementation', icon: 'terminal' },
    { title: 'Consulting', description: 'Technical consulting and architecture review', icon: 'briefcase' },
  ];

  const services = data.length > 0 ? data : defaultServices;

  const getIcon = (icon) => {
    switch (icon) {
      case 'code': return <Code2 size={32} />;
      case 'terminal': return <Terminal size={32} />;
      case 'briefcase': return <Briefcase size={32} />;
      default: return <Wrench size={32} />;
    }
  };

  return (
    <section id="services" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">06.</span>
          Services
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="grid gap-6">
          {services.map((service, i) => (
            <div key={i} className="p-6 rounded-lg border transition-all hover:translate-x-2" style={{ backgroundColor: BG_LIGHT, borderColor: `${accent}20` }}>
              <div className="flex items-start gap-4">
                <div style={{ color: accent }}>{getIcon(service.icon)}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: TEXT_PRIMARY }}>{service.title}</h3>
                  <p style={{ color: TEXT_SECONDARY }}>{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIALS SECTION (NEW)
// ============================================
export const DeveloperTestimonials = ({ data = [], accentColor, backgroundColor, isAdminPreview = false }) => {
  const accent = accentColor || ACCENT;

  const defaultTestimonials = [
    { quote: 'Exceptional developer who delivers high-quality work on time.', author: 'John Doe', role: 'CEO, TechCorp', avatar: null },
    { quote: 'Great communication skills and technical expertise.', author: 'Jane Smith', role: 'Product Manager, StartupXYZ', avatar: null },
  ];

  const testimonials = data.length > 0 ? data : defaultTestimonials;

  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: backgroundColor || BG_DARK, width: '100%' }}>
      <div className={isAdminPreview ? 'w-full' : 'max-w-3xl'}>
        <h2 className="flex items-center gap-4 text-2xl font-bold mb-12" style={{ color: TEXT_PRIMARY }}>
          <span style={{ color: accent }} className="font-mono text-xl">07.</span>
          What People Say
          <span className="flex-1 h-px ml-4" style={{ backgroundColor: BG_LIGHT }} />
        </h2>

        <div className="space-y-8">
          {testimonials.map((item, i) => (
            <div key={i} className="p-8 rounded-lg relative" style={{ backgroundColor: BG_LIGHT }}>
              <div className="absolute -top-4 left-8 text-6xl font-serif" style={{ color: `${accent}30` }}>"</div>
              <p className="text-lg italic mb-6 relative z-10" style={{ color: TEXT_SECONDARY }}>{item.quote}</p>
              <div className="flex items-center gap-4">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${accent}20`, color: accent }}>
                    {item.author?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>{item.author}</p>
                  <p className="text-sm" style={{ color: accent }}>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default {
  Layout: DeveloperLayout,
  Profile: DeveloperProfile,
  Education: DeveloperEducation,
  Career: DeveloperCareer,
  Skills: DeveloperSkills,
  Awards: DeveloperAwards,
  Services: DeveloperServices,
  Testimonials: DeveloperTestimonials,
  style: 'developer',
  name: 'Developer Portfolio',
  description: 'Split-screen layout with fixed sidebar, inspired by Brittany Chiang',
  layout: 'split-fixed', // New layout type
};
