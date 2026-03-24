import { useState, useEffect } from 'react';
import { X, User, GraduationCap, Briefcase, Award, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Calendar, Building, Star } from 'lucide-react';
import api from '../../../services/api';

const TemplatePreviewModal = ({ template, onClose, onSelect }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    profile: null,
    career: [],
    education: [],
    awards: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [profileRes, careerRes, educationRes, awardsRes] = await Promise.all([
          api.get('/profile/contact-info/').catch(() => ({ data: null })),
          api.get('/career/entries/').catch(() => ({ data: [] })),
          api.get('/education/entries/').catch(() => ({ data: [] })),
          api.get('/achievements/').catch(() => ({ data: [] }))
        ]);

        setUserData({
          profile: profileRes.data,
          career: Array.isArray(careerRes.data) ? careerRes.data : [],
          education: Array.isArray(educationRes.data) ? educationRes.data : [],
          awards: Array.isArray(awardsRes.data) ? awardsRes.data : []
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (!template) return null;

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'awards', label: 'Awards', icon: Award },
  ];

  const currentIndex = sections.findIndex(s => s.id === activeSection);

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  // Render completely different designs based on template style
  const renderPreview = () => {
    const style = template.style;

    switch (style) {
      case 'minimal':
        return <MinimalStyle section={activeSection} userData={userData} loading={loading} />;
      case 'dark':
        return <DarkStyle section={activeSection} templateName={template.name} userData={userData} loading={loading} />;
      case 'glassmorphism':
        return <GlassmorphismStyle section={activeSection} templateName={template.name} userData={userData} loading={loading} />;
      case 'gradient':
        return <GradientStyle section={activeSection} userData={userData} loading={loading} />;
      case 'colorful':
        return <ColorfulStyle section={activeSection} userData={userData} loading={loading} />;
      case 'professional':
        return <ProfessionalStyle section={activeSection} userData={userData} loading={loading} />;
      default:
        return <MinimalStyle section={activeSection} userData={userData} loading={loading} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">{template.name}</h2>
            <p className="text-sm text-gray-400">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="text-gray-400" size={24} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Preview Area */}
        <div className="h-[450px] overflow-auto">
          {renderPreview()}
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-slate-900">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={() => onSelect(template)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition"
          >
            Select This Template
          </button>

          <button
            onClick={goNext}
            disabled={currentIndex === sections.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get user initials
const getInitials = (profile) => {
  if (!profile) return 'U';
  const firstName = profile.first_name || profile.name?.split(' ')[0] || '';
  const lastName = profile.last_name || profile.name?.split(' ')[1] || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
};

// Helper function to get full name
const getFullName = (profile) => {
  if (!profile) return 'Your Name';
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  return profile.name || 'Your Name';
};

// Helper function to format date range
const formatDateRange = (startDate, endDate, isCurrent) => {
  const start = startDate ? new Date(startDate).getFullYear() : '';
  const end = isCurrent ? 'Present' : (endDate ? new Date(endDate).getFullYear() : '');
  return `${start}${start && end ? ' - ' : ''}${end}`;
};

// ============================================
// MINIMAL STYLE - Clean, lots of whitespace
// ============================================
const MinimalStyle = ({ section, userData, loading }) => {
  const bgColor = '#fafafa';
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full p-12 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="text-gray-500">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="min-h-full p-12" style={{ backgroundColor: bgColor }}>
        <div className="max-w-2xl mx-auto">
          {/* Horizontal layout with image on left */}
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-light flex-shrink-0">
              {getInitials(profile)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-light text-gray-900 mb-1">{getFullName(profile)}</h1>
              <p className="text-gray-500 text-lg mb-4">{profile?.title || profile?.headline || 'Your Title'}</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                {profile?.bio || profile?.about || 'Your professional bio will appear here.'}
              </p>
            </div>
          </div>

          {/* Minimal contact line */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex gap-8 text-sm text-gray-500">
            <span>{profile?.email || 'your@email.com'}</span>
            <span>{profile?.phone || 'Your phone'}</span>
            <span>{profile?.location || profile?.city || 'Your location'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    return (
      <div className="min-h-full p-12" style={{ backgroundColor: bgColor }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Education</h2>

          {/* Simple list style */}
          <div className="space-y-6">
            {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
              <div key={edu.id || index} className="border-l-2 border-gray-300 pl-6">
                <div className="text-sm text-gray-400 mb-1">{formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</div>
                <h3 className="text-lg font-medium text-gray-900">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                <p className="text-gray-500">{edu.university || edu.institution || edu.school || 'Institution'}</p>
              </div>
            )) : (
              <>
                <div className="border-l-2 border-gray-300 pl-6">
                  <div className="text-sm text-gray-400 mb-1">Year - Year</div>
                  <h3 className="text-lg font-medium text-gray-900">Your Degree</h3>
                  <p className="text-gray-500">Your Institution</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    return (
      <div className="min-h-full p-12" style={{ backgroundColor: bgColor }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Experience</h2>

          <div className="space-y-8">
            {career.length > 0 ? career.slice(0, 2).map((job, index) => (
              <div key={job.id || index}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{job.title || job.position || 'Position'}</h3>
                  <span className="text-sm text-gray-400">{formatDateRange(job.start_date, job.end_date, job.is_current)}</span>
                </div>
                <p className="text-gray-500 mb-2">{job.company || job.organization || 'Company'}</p>
                <p className="text-sm text-gray-600">{job.description || ''}</p>
              </div>
            )) : (
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Your Position</h3>
                  <span className="text-sm text-gray-400">Year - Present</span>
                </div>
                <p className="text-gray-500 mb-2">Your Company</p>
                <p className="text-sm text-gray-600">Your job description will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    return (
      <div className="min-h-full p-12" style={{ backgroundColor: bgColor }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Awards</h2>

          <div className="space-y-4">
            {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
              <div key={award.id || index} className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">{award.title || award.name || 'Award'}</h3>
                  <p className="text-sm text-gray-500">{award.issuer || award.organization || ''}</p>
                </div>
                <span className="text-sm text-gray-400">{award.year || (award.date ? new Date(award.date).getFullYear() : '')}</span>
              </div>
            )) : (
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Your Award</h3>
                  <p className="text-sm text-gray-500">Issuing Organization</p>
                </div>
                <span className="text-sm text-gray-400">Year</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// DARK STYLE - High contrast, bold typography
// ============================================
const DarkStyle = ({ section, templateName, userData, loading }) => {
  const isStarterDark = templateName === 'Starter Dark';
  const accentColor = isStarterDark ? '#a855f7' : '#22d3ee';
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full bg-gray-950 p-8 flex items-center justify-center">
        <div className="text-gray-400">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="min-h-full bg-gray-950 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Large hero style */}
          <div className="text-center mb-8">
            <div
              className="w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl font-bold"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              {getInitials(profile)}
            </div>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">{getFullName(profile).toUpperCase()}</h1>
            <p className="text-xl" style={{ color: accentColor }}>{(profile?.title || profile?.headline || 'YOUR TITLE').toUpperCase()}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <div className="text-3xl font-bold text-white">{career.length || '0'}+</div>
              <div className="text-gray-500 text-sm">Positions</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <div className="text-3xl font-bold text-white">{education.length || '0'}+</div>
              <div className="text-gray-500 text-sm">Degrees</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <div className="text-3xl font-bold text-white">{awards.length || '0'}+</div>
              <div className="text-gray-500 text-sm">Awards</div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-300 leading-relaxed">
              {profile?.bio || profile?.about || 'Your professional bio will appear here.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    return (
      <div className="min-h-full bg-gray-950 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">EDUCATION</h2>

          {/* Card stack */}
          <div className="space-y-4">
            {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
              <div key={edu.id || index} className="bg-gray-900 rounded-xl p-6 border-l-4" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                    <p style={{ color: accentColor }}>{edu.university || edu.institution || edu.school || 'Institution'}</p>
                    <p className="text-gray-500 text-sm mt-2">{edu.field_of_study || edu.description || ''}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">
                      {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-gray-900 rounded-xl p-6 border-l-4" style={{ borderColor: accentColor }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Degree</h3>
                    <p style={{ color: accentColor }}>Your Institution</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300">Year - Year</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    return (
      <div className="min-h-full bg-gray-950 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">CAREER</h2>

          {/* Timeline with dots */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>

            <div className="space-y-6">
              {career.length > 0 ? career.slice(0, 2).map((job, index) => (
                <div key={job.id || index} className="relative pl-12">
                  <div
                    className="absolute left-2 w-5 h-5 rounded-full border-4 border-gray-950"
                    style={{ backgroundColor: index === 0 ? accentColor : '#374151' }}
                  ></div>
                  <div className="bg-gray-900 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{job.title || job.position || 'Position'}</h3>
                      {job.is_current && (
                        <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: accentColor, color: '#000' }}>
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">{job.company || job.organization || 'Company'} • {formatDateRange(job.start_date, job.end_date, job.is_current)}</p>
                    <p className="text-gray-500 text-sm mt-2">{job.description || ''}</p>
                  </div>
                </div>
              )) : (
                <div className="relative pl-12">
                  <div className="absolute left-2 w-5 h-5 rounded-full border-4 border-gray-950" style={{ backgroundColor: accentColor }}></div>
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white">Your Position</h3>
                    <p className="text-gray-400">Your Company • Year - Present</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    return (
      <div className="min-h-full bg-gray-950 p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">AWARDS</h2>

          <div className="grid grid-cols-2 gap-4">
            {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
              <div key={award.id || index} className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800 hover:border-cyan-500 transition-colors">
                <div className="text-4xl mb-3">{index === 0 ? '🏆' : '⭐'}</div>
                <h3 className="font-bold text-white mb-1">{award.title || award.name || 'Award'}</h3>
                <p style={{ color: accentColor }}>{award.issuer || award.organization || ''}{award.year || award.date ? `, ${award.year || new Date(award.date).getFullYear()}` : ''}</p>
              </div>
            )) : (
              <div className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-bold text-white mb-1">Your Award</h3>
                <p style={{ color: accentColor }}>Organization, Year</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// GLASSMORPHISM STYLE - Blur, glass cards
// ============================================
const GlassmorphismStyle = ({ section, templateName, userData, loading }) => {
  const isNexaverse = templateName === 'Nexaverse';
  const gradientBg = isNexaverse
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
  const accentColor = isNexaverse ? '#00ff88' : '#ffffff';
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full p-8 flex items-center justify-center" style={{ background: gradientBg }}>
        <div className="text-white/70">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="min-h-full p-8" style={{ background: gradientBg }}>
        <div className="max-w-3xl mx-auto">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-6">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${isNexaverse ? '#00cc6a' : '#e0e0e0'})`,
                  color: '#1a1a2e'
                }}
              >
                {getInitials(profile)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{getFullName(profile)}</h1>
                <p className="text-lg" style={{ color: accentColor }}>{profile?.title || profile?.headline || 'Your Title'}</p>
              </div>
            </div>

            <div className="mt-6 backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/80 leading-relaxed">
                {profile?.bio || profile?.about || 'Your professional bio will appear here.'}
              </p>
            </div>

            {/* Glass contact pills */}
            <div className="mt-6 flex gap-3 flex-wrap">
              <div className="backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20 text-white/90 text-sm flex items-center gap-2">
                <Mail size={14} />
                {profile?.email || 'your@email.com'}
              </div>
              <div className="backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20 text-white/90 text-sm flex items-center gap-2">
                <Phone size={14} />
                {profile?.phone || 'Your phone'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    return (
      <div className="min-h-full p-8" style={{ background: gradientBg }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <GraduationCap style={{ color: accentColor }} />
            Education
          </h2>

          <div className="space-y-4">
            {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
              <div key={edu.id || index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                    <p style={{ color: accentColor }}>{edu.university || edu.institution || edu.school || 'Institution'}</p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm">
                    {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                  </div>
                </div>
              </div>
            )) : (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Your Degree</h3>
                    <p style={{ color: accentColor }}>Your Institution</p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1 border border-white/20 text-white/80 text-sm">
                    Year - Year
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    return (
      <div className="min-h-full p-8" style={{ background: gradientBg }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase style={{ color: accentColor }} />
            Career
          </h2>

          {/* Floating glass timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${accentColor}, transparent)` }}></div>

            <div className="space-y-6">
              {career.length > 0 ? career.slice(0, 2).map((job, index) => (
                <div key={job.id || index} className="relative pl-16">
                  <div
                    className="absolute left-4 w-5 h-5 rounded-full shadow-lg"
                    style={{
                      backgroundColor: index === 0 ? accentColor : 'rgba(255,255,255,0.3)',
                      boxShadow: index === 0 ? `0 0 20px ${accentColor}` : 'none'
                    }}
                  ></div>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white">{job.title || job.position || 'Position'}</h3>
                    <p style={{ color: accentColor }}>{job.company || job.organization || 'Company'} • {formatDateRange(job.start_date, job.end_date, job.is_current)}</p>
                    <p className="text-white/60 text-sm mt-2">{job.description || ''}</p>
                  </div>
                </div>
              )) : (
                <div className="relative pl-16">
                  <div className="absolute left-4 w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}></div>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white">Your Position</h3>
                    <p style={{ color: accentColor }}>Your Company • Year - Present</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    return (
      <div className="min-h-full p-8" style={{ background: gradientBg }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award style={{ color: accentColor }} />
            Awards
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
              <div key={award.id || index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-transform">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${accentColor}30` }}
                >
                  {index === 0 ? '🏆' : '⭐'}
                </div>
                <h3 className="font-semibold text-white">{award.title || award.name || 'Award'}</h3>
                <p className="text-sm" style={{ color: accentColor }}>{award.issuer || award.organization || ''}{award.year || award.date ? `, ${award.year || new Date(award.date).getFullYear()}` : ''}</p>
              </div>
            )) : (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: `${accentColor}30` }}>
                  🏆
                </div>
                <h3 className="font-semibold text-white">Your Award</h3>
                <p className="text-sm" style={{ color: accentColor }}>Organization, Year</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// GRADIENT STYLE - Bold gradients, colorful
// ============================================
const GradientStyle = ({ section, userData, loading }) => {
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full p-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-white">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    const firstName = profile?.first_name || profile?.name?.split(' ')[0] || 'Your Name';
    const currentJob = career.length > 0 ? career[0] : null;
    return (
      <div className="min-h-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            {/* Split layout */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-3">
                {/* Left gradient section */}
                <div className="p-8 flex flex-col items-center justify-center text-white" style={{ background: 'linear-gradient(180deg, #667eea, #764ba2)' }}>
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-4">
                    {getInitials(profile)}
                  </div>
                  <h3 className="font-bold text-lg">{getFullName(profile)}</h3>
                  <p className="text-white/80 text-sm">{profile?.title || profile?.headline || 'Your Title'}</p>
                </div>

                {/* Right content */}
                <div className="col-span-2 p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, I'm {firstName}</h1>
                  <p className="text-purple-600 font-medium mb-4">
                    {currentJob ? `${currentJob.title || currentJob.position} @ ${currentJob.company || currentJob.organization}` : (profile?.title || 'Your Title')}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {profile?.bio || profile?.about || 'Your professional bio will appear here.'}
                  </p>

                  <div className="flex gap-2">
                    <span className="px-4 py-2 rounded-full text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      {profile?.email || 'Email'}
                    </span>
                    <span className="px-4 py-2 rounded-full text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                      {profile?.phone || 'Phone'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    const gradients = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)'
    ];
    const colors = ['text-purple-600', 'text-pink-600'];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Education</h2>

          {/* Stacked gradient cards */}
          <div className="space-y-4">
            {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
              <div key={edu.id || index} className="bg-white rounded-2xl p-6 shadow-xl transform hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: gradients[index % 2] }}>
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                    <p className={colors[index % 2]}>{edu.university || edu.institution || edu.school || 'Institution'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: gradients[0] }}>
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Your Degree</h3>
                    <p className="text-purple-600">Your Institution</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Year - Year</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    const dotColors = ['bg-purple-600', 'bg-pink-500'];
    const textColors = ['text-purple-600', 'text-pink-600'];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Career Journey</h2>

          {/* Horizontal timeline */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="relative">
              <div className="absolute top-8 left-0 right-0 h-1 rounded" style={{ background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)' }}></div>

              <div className="grid grid-cols-2 gap-8">
                {career.length > 0 ? career.slice(0, 2).map((job, index) => (
                  <div key={job.id || index} className="pt-12">
                    <div className={`w-4 h-4 rounded-full ${dotColors[index % 2]} mb-4 shadow-lg`}></div>
                    <h3 className="font-bold text-gray-900">{job.title || job.position || 'Position'}</h3>
                    <p className={`${textColors[index % 2]} font-medium`}>{job.company || job.organization || 'Company'}</p>
                    <p className="text-sm text-gray-500 mt-2">{formatDateRange(job.start_date, job.end_date, job.is_current)}</p>
                  </div>
                )) : (
                  <div className="pt-12">
                    <div className="w-4 h-4 rounded-full bg-purple-600 mb-4 shadow-lg"></div>
                    <h3 className="font-bold text-gray-900">Your Position</h3>
                    <p className="text-purple-600 font-medium">Your Company</p>
                    <p className="text-sm text-gray-500 mt-2">Year - Present</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    const bgGradients = [
      'linear-gradient(135deg, #ffd700, #ffaa00)',
      'linear-gradient(135deg, #c0c0c0, #a0a0a0)'
    ];
    const textColors = ['text-purple-600', 'text-pink-600'];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Achievements</h2>

          <div className="grid grid-cols-2 gap-6">
            {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
              <div key={award.id || index} className="bg-white rounded-2xl p-6 text-center shadow-xl">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: bgGradients[index % 2] }}>
                  {index === 0 ? '🏆' : '⭐'}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{award.title || award.name || 'Award'}</h3>
                <p className={textColors[index % 2]}>{award.issuer || award.organization || ''}{award.year || award.date ? `, ${award.year || new Date(award.date).getFullYear()}` : ''}</p>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: bgGradients[0] }}>
                  🏆
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Your Award</h3>
                <p className="text-purple-600">Organization, Year</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// COLORFUL STYLE - Vibrant, playful
// ============================================
const ColorfulStyle = ({ section, userData, loading }) => {
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full p-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
        <div className="text-gray-700">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
        <div className="max-w-3xl mx-auto">
          {/* Fun card layout */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-yellow-400">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {getInitials(profile)}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
                  ✨
                </div>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-2">{getFullName(profile)}</h1>
              <p className="text-xl font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {profile?.title || profile?.headline || 'Your Title'}
              </p>

              <div className="mt-6 flex gap-3 flex-wrap justify-center">
                <span className="px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-medium">{profile?.email || 'Your Email'}</span>
                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">{profile?.phone || 'Your Phone'}</span>
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 font-medium">{profile?.location || profile?.city || 'Your Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    const bookStyles = [
      { bg: 'from-indigo-400 to-indigo-600', text: 'text-indigo-200', rotate: '-rotate-2' },
      { bg: 'from-pink-400 to-pink-600', text: 'text-pink-200', rotate: 'rotate-2' }
    ];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Education</h2>

          {/* Fun bookshelf style */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-purple-300">
            <div className="flex gap-4">
              {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
                <div key={edu.id || index} className={`flex-1 bg-gradient-to-b ${bookStyles[index % 2].bg} rounded-lg p-4 text-white transform ${bookStyles[index % 2].rotate} hover:rotate-0 transition-transform`}>
                  <div className="text-xs mb-2">{index === 0 ? '📚' : '📖'} {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</div>
                  <h3 className="font-bold text-sm leading-tight">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                  <p className={`${bookStyles[index % 2].text} text-xs mt-2`}>{edu.university || edu.institution || edu.school || 'Institution'}</p>
                </div>
              )) : (
                <div className="flex-1 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-lg p-4 text-white transform -rotate-2 hover:rotate-0 transition-transform">
                  <div className="text-xs mb-2">📚 Year - Year</div>
                  <h3 className="font-bold text-sm leading-tight">Your Degree</h3>
                  <p className="text-indigo-200 text-xs mt-2">Your Institution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    const cardStyles = [
      { border: 'border-green-400', bg: 'bg-green-100', text: 'text-green-600', emoji: '🚀' },
      { border: 'border-blue-400', bg: 'bg-blue-100', text: 'text-blue-600', emoji: '💻' }
    ];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Career</h2>

          {/* Colorful cards */}
          <div className="space-y-4">
            {career.length > 0 ? career.slice(0, 2).map((job, index) => (
              <div key={job.id || index} className={`bg-white rounded-2xl p-6 shadow-lg border-l-8 ${cardStyles[index % 2].border} transform hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl ${cardStyles[index % 2].bg} flex items-center justify-center text-2xl`}>
                    {cardStyles[index % 2].emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{job.title || job.position || 'Position'}</h3>
                    <p className={`${cardStyles[index % 2].text} font-medium`}>{job.company || job.organization || 'Company'} • {formatDateRange(job.start_date, job.end_date, job.is_current)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-8 border-green-400">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                    🚀
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Your Position</h3>
                    <p className="text-green-600 font-medium">Your Company • Year - Present</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    const awardStyles = [
      { border: 'border-yellow-300', text: 'text-orange-500', emoji: '🏆' },
      { border: 'border-pink-300', text: 'text-pink-500', emoji: '⭐' }
    ];
    return (
      <div className="min-h-full p-8" style={{ background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Awards</h2>

          <div className="grid grid-cols-2 gap-4">
            {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
              <div key={award.id || index} className={`bg-white rounded-[2rem] p-6 text-center shadow-lg border-4 ${awardStyles[index % 2].border} transform hover:scale-105 transition-transform`}>
                <div className="text-5xl mb-4">{awardStyles[index % 2].emoji}</div>
                <h3 className="font-bold text-gray-900">{award.title || award.name || 'Award'}</h3>
                <p className={`${awardStyles[index % 2].text} font-medium`}>{award.issuer || award.organization || ''}{award.year || award.date ? `, ${award.year || new Date(award.date).getFullYear()}` : ''}</p>
              </div>
            )) : (
              <div className="bg-white rounded-[2rem] p-6 text-center shadow-lg border-4 border-yellow-300">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="font-bold text-gray-900">Your Award</h3>
                <p className="text-orange-500 font-medium">Organization, Year</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============================================
// PROFESSIONAL STYLE - Classic, elegant
// ============================================
const ProfessionalStyle = ({ section, userData, loading }) => {
  const { profile, career, education, awards } = userData;

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-slate-500">Loading your data...</div>
      </div>
    );
  }

  if (section === 'profile') {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Classic two-column */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-800 p-6 text-center">
              <div className="w-28 h-28 rounded-full bg-slate-600 mx-auto mb-4 flex items-center justify-center text-3xl font-serif text-white border-4 border-white">
                {getInitials(profile)}
              </div>
              <h1 className="text-2xl font-serif text-white">{getFullName(profile)}</h1>
              <p className="text-slate-300">{profile?.title || profile?.headline || 'Your Title'}</p>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">About</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {profile?.bio || profile?.about || 'Your professional bio will appear here.'}
              </p>

              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact</h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  {profile?.email || 'your@email.com'}
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400" />
                  {profile?.phone || 'Your phone'}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400" />
                  {profile?.location || profile?.city || 'Your location'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'education') {
    const barColors = ['bg-slate-800', 'bg-slate-600'];
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
            <h2 className="text-xl font-serif text-slate-800 mb-6 pb-3 border-b-2 border-slate-800">Education</h2>

            <div className="space-y-6">
              {education.length > 0 ? education.slice(0, 2).map((edu, index) => (
                <div key={edu.id || index} className="flex gap-4">
                  <div className={`flex-shrink-0 w-2 ${barColors[index % 2]} rounded`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-800">{edu.degree || edu.field_of_study || 'Degree'}</h3>
                      <span className="text-sm text-slate-500">{formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</span>
                    </div>
                    <p className="text-slate-600">{edu.university || edu.institution || edu.school || 'Institution'}</p>
                    {edu.description && <p className="text-sm text-slate-500 mt-1">{edu.description}</p>}
                  </div>
                </div>
              )) : (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-2 bg-slate-800 rounded"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-800">Your Degree</h3>
                      <span className="text-sm text-slate-500">Year - Year</span>
                    </div>
                    <p className="text-slate-600">Your Institution</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'career') {
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
            <h2 className="text-xl font-serif text-slate-800 mb-6 pb-3 border-b-2 border-slate-800">Professional Experience</h2>

            <div className="space-y-8">
              {career.length > 0 ? career.slice(0, 2).map((job, index) => (
                <div key={job.id || index} className={index > 0 ? 'border-t border-slate-100 pt-8' : ''}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                      <Building size={20} className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-slate-800">{job.title || job.position || 'Position'}</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar size={14} />
                          {formatDateRange(job.start_date, job.end_date, job.is_current)}
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium">{job.company || job.organization || 'Company'}</p>
                      {job.description && <p className="text-sm text-slate-500 mt-2">{job.description}</p>}
                    </div>
                  </div>
                </div>
              )) : (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                      <Building size={20} className="text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-slate-800">Your Position</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar size={14} />
                          Year - Present
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium">Your Company</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'awards') {
    const iconColors = [
      { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
      { bg: 'bg-blue-100', icon: 'text-blue-600' }
    ];
    return (
      <div className="min-h-full bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
            <h2 className="text-xl font-serif text-slate-800 mb-6 pb-3 border-b-2 border-slate-800">Awards & Recognition</h2>

            <div className="space-y-4">
              {awards.length > 0 ? awards.slice(0, 2).map((award, index) => (
                <div key={award.id || index} className="flex items-center gap-4 p-4 bg-slate-50 rounded border border-slate-200">
                  <div className={`flex-shrink-0 w-10 h-10 ${iconColors[index % 2].bg} rounded-full flex items-center justify-center`}>
                    <Star size={20} className={iconColors[index % 2].icon} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{award.title || award.name || 'Award'}</h3>
                    <p className="text-sm text-slate-600">{award.issuer || award.organization || ''}{award.year || award.date ? ` • ${award.year || new Date(award.date).getFullYear()}` : ''}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded border border-slate-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star size={20} className="text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">Your Award</h3>
                    <p className="text-sm text-slate-600">Organization • Year</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TemplatePreviewModal;
