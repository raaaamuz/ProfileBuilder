import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PreviewPanel from './PreviewPanel';
import { PreviewContext } from './PreviewContext';
import api from '../../services/api';
import {
  Home, User, GraduationCap, Briefcase, Wrench, FileText, Settings, ScrollText, Trophy, ArrowRight, Mail, UserCircle, Package, Quote
} from 'lucide-react';

// Professional Design System - Single accent color, clean typography
const theme = {
  // Backgrounds
  bgPrimary: '#0f172a',      // Main background
  bgSecondary: '#1e293b',    // Cards, elevated surfaces
  bgTertiary: '#334155',     // Hover states
  bgInput: '#1e293b',        // Input fields

  // Borders
  border: '#334155',
  borderLight: '#475569',

  // Text
  textPrimary: '#f8fafc',    // White text
  textSecondary: '#94a3b8',  // Muted text
  textTertiary: '#64748b',   // Very muted

  // Accent - Single professional color
  accent: '#6366f1',         // Indigo
  accentHover: '#4f46e5',
  accentMuted: 'rgba(99, 102, 241, 0.15)',

  // Status
  success: '#22c55e',
  error: '#ef4444',
};

const SectionNavigator = () => {
  const [inboxCount, setInboxCount] = useState(0);
  const [completedSections, setCompletedSections] = useState(() => {
    // Load from localStorage or start fresh
    try {
      const saved = localStorage.getItem('onboardingProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading onboarding progress:', e);
    }
    // First time user - only home is unlocked
    return ['home'];
  });

  // Temporarily disabled onboarding - all sections unlocked
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('onboardingProgress', JSON.stringify(completedSections));
  }, [completedSections]);

  // Check if a section is unlocked
  const isSectionUnlocked = (sectionKey, index) => {
    // If onboarding is complete, all sections are unlocked
    if (!isFirstTimeUser) return true;
    // Section is unlocked if it's completed OR it's the next one after completed sections
    return completedSections.includes(sectionKey) || index <= completedSections.length;
  };

  // Mark a section as completed and unlock the next one
  const completeSection = (sectionKey) => {
    if (!completedSections.includes(sectionKey)) {
      setCompletedSections(prev => [...prev, sectionKey]);
    }
  };

  // Skip onboarding (unlock all sections)
  const skipOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsFirstTimeUser(false);
  };

  useEffect(() => {
    const fetchInboxCount = async () => {
      try {
        const response = await api.get('/contact/inbox/');
        setInboxCount(response.data.messages?.length || 0);
      } catch (error) {
        console.error('Error fetching inbox count:', error);
      }
    };
    fetchInboxCount();
  }, []);

  // Sections - all use same accent color for consistency
  const baseSections = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'career', label: 'Career', icon: Briefcase },
    { key: 'skills', label: 'Skills', icon: Wrench },
    { key: 'services', label: 'Services', icon: Package },
    { key: 'awards', label: 'Awards', icon: Trophy },
    { key: 'testimonials', label: 'Testimonials', icon: Quote },
    { key: 'resume', label: 'AI Resume', icon: ScrollText },
    { key: 'blogs', label: 'Blogs', icon: FileText },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  const sections = inboxCount > 0
    ? [...baseSections, { key: 'inbox', label: `Inbox (${inboxCount})`, icon: Mail }]
    : baseSections;

  const navigate = useNavigate();
  const location = useLocation();
  const { previewData, setPreviewData, goToNextTab } = useContext(PreviewContext);

  const pathParts = location.pathname.split('/');
  const rawSection = pathParts[pathParts.length - 1];
  const currentSection = rawSection === 'blog' ? 'blogs' : rawSection;
  const currentIndex = sections.findIndex(s => s.key === currentSection);

  useEffect(() => {
    if (currentSection && currentIndex !== -1 && !previewData[currentSection]) {
      setPreviewData((prevData) => ({
        ...prevData,
        [currentSection]: `Content for ${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} page enabled`,
      }));
    }
  }, [currentSection, currentIndex, previewData, setPreviewData]);

  const goToSection = (index) => {
    if (index >= 0 && index < sections.length) {
      navigate(`/dashboard/${sections[index].key}`);
    }
  };

  const goToNextSection = () => {
    const movedToNextTab = goToNextTab();
    if (movedToNextTab) return;

    // Mark current section as completed
    if (currentIndex >= 0) {
      completeSection(sections[currentIndex].key);
    }

    // Move to next section
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      navigate(`/dashboard/${sections[currentIndex + 1].key}`);
    }

    // If this was the last section, mark onboarding as complete
    if (currentIndex === sections.length - 2) {
      localStorage.setItem('onboardingComplete', 'true');
      setIsFirstTimeUser(false);
    }
  };

  const currentSectionInfo = sections[currentIndex] || sections[0];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: theme.bgPrimary }}>
      {/* Sidebar - Clean minimal design */}
      <div
        className="w-16 flex flex-col items-center py-4 flex-shrink-0"
        style={{ backgroundColor: theme.bgPrimary, borderRight: `1px solid ${theme.border}`, zIndex: 100, position: 'relative' }}
      >
        {/* Logo */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-6"
          style={{ backgroundColor: theme.accent }}
        >
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>P2C</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-1">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = currentSection === section.key;
            const isUnlocked = isSectionUnlocked(section.key, index);
            const isCompleted = completedSections.includes(section.key);
            return (
              <button
                key={section.key}
                onClick={() => isUnlocked && goToSection(index)}
                disabled={!isUnlocked}
                className="group relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  backgroundColor: isActive ? theme.accentMuted : 'transparent',
                  color: isActive ? theme.accent : isUnlocked ? theme.textTertiary : theme.textTertiary + '40',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.4,
                }}
                title={isUnlocked ? section.label : `Complete previous sections to unlock ${section.label}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {/* Completed checkmark */}
                {isCompleted && !isActive && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.success, fontSize: '8px', color: '#fff' }}
                  >
                    ✓
                  </span>
                )}
                {/* Tooltip */}
                <span
                  className="absolute left-full ml-3 px-3 py-1.5 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none"
                  style={{
                    backgroundColor: theme.bgSecondary,
                    color: isUnlocked ? theme.textPrimary : theme.textTertiary,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {section.label} {!isUnlocked && '🔒'}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ backgroundColor: theme.accent, marginLeft: '-1px' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Skip Onboarding (only for first-time users) */}
        {isFirstTimeUser && (
          <button
            onClick={skipOnboarding}
            className="group relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors mb-2"
            style={{ color: theme.textTertiary, fontSize: '10px' }}
            title="Unlock all sections"
          >
            <span style={{ fontSize: '16px' }}>⏭</span>
            <span
              className="absolute left-full ml-3 px-3 py-1.5 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none"
              style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary, border: `1px solid ${theme.border}` }}
            >
              Skip & Unlock All
            </span>
          </button>
        )}

        {/* Account at bottom */}
        <button
          onClick={() => navigate('/dashboard/account')}
          className="group relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 mt-auto"
          style={{
            backgroundColor: currentSection === 'account' ? theme.accentMuted : 'transparent',
            color: currentSection === 'account' ? theme.accent : theme.textTertiary,
          }}
          title="Account"
        >
          <UserCircle size={20} strokeWidth={currentSection === 'account' ? 2 : 1.5} />
          {currentSection === 'account' && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
              style={{ backgroundColor: theme.accent, marginLeft: '-1px' }}
            />
          )}
          <span
            className="absolute left-full ml-3 px-3 py-1.5 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none"
            style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary, border: `1px solid ${theme.border}` }}
          >
            Account
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            width: '520px',
            minWidth: '480px',
            maxWidth: '600px',
            backgroundColor: theme.bgSecondary,
            borderRight: `1px solid ${theme.border}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.accentMuted }}
            >
              {React.createElement(currentSectionInfo.icon, { size: 18, color: theme.accent })}
            </div>
            <div>
              <h1 style={{ color: theme.textPrimary, fontWeight: 600, fontSize: '15px', margin: 0 }}>
                {currentSectionInfo.label}
              </h1>
              <p style={{ color: theme.textTertiary, fontSize: '12px', margin: 0 }}>
                Edit your {currentSectionInfo.label.toLowerCase()} content
              </p>
            </div>
          </div>

          {/* Onboarding Progress & Next Button */}
          {currentIndex >= 0 && currentIndex < sections.length - 1 && (
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
              {/* Progress bar for first-time users */}
              {isFirstTimeUser && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ color: theme.textSecondary, fontSize: '11px' }}>
                      Setup Progress
                    </span>
                    <span style={{ color: theme.accent, fontSize: '11px', fontWeight: 500 }}>
                      {completedSections.length} / {sections.length - 1} completed
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bgPrimary }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: theme.accent,
                        width: `${(completedSections.length / (sections.length - 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={goToNextSection}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all duration-150"
                style={{
                  backgroundColor: theme.accent,
                  color: '#ffffff',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.accentHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.accent}
              >
                {isFirstTimeUser ? 'Complete & Continue to' : 'Continue to'} {sections[currentIndex + 1]?.label}
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto admin-scrollbar">
            <div className="admin-editor-theme" key={`editor-${currentSection}-${location.pathname}`}>
              <Outlet key={`outlet-${currentSection}-${location.pathname}`} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: theme.bgPrimary }}>
          {/* Preview Header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.success }} />
              <span style={{ color: theme.textTertiary, fontSize: '12px', fontWeight: 500 }}>
                Live Preview
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#ffffff',
                minHeight: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <PreviewPanel key={currentSection} />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Editor Theme Styles */}
      <style>{`
        .admin-editor-theme {
          --admin-bg: ${theme.bgSecondary};
          --admin-bg-input: ${theme.bgInput};
          --admin-border: ${theme.border};
          --admin-text: ${theme.textPrimary};
          --admin-text-muted: ${theme.textSecondary};
          --admin-text-dim: ${theme.textTertiary};
          --admin-accent: ${theme.accent};
        }

        /* Input fields */
        .admin-editor-theme input,
        .admin-editor-theme textarea,
        .admin-editor-theme select {
          background-color: ${theme.bgPrimary} !important;
          border: 1px solid ${theme.border} !important;
          color: ${theme.textPrimary} !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          padding: 10px 12px !important;
          transition: border-color 0.15s ease !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .admin-editor-theme input:focus,
        .admin-editor-theme textarea:focus,
        .admin-editor-theme select:focus {
          border-color: ${theme.accent} !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${theme.accentMuted} !important;
        }

        .admin-editor-theme input::placeholder,
        .admin-editor-theme textarea::placeholder {
          color: ${theme.textTertiary} !important;
        }

        /* Labels */
        .admin-editor-theme label {
          color: ${theme.textSecondary} !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          letter-spacing: 0.025em !important;
          margin-bottom: 6px !important;
          display: block !important;
        }

        /* Headings */
        .admin-editor-theme h1,
        .admin-editor-theme h2,
        .admin-editor-theme h3,
        .admin-editor-theme h4 {
          color: ${theme.textPrimary} !important;
          font-weight: 600 !important;
        }

        /* Paragraphs and spans */
        .admin-editor-theme p {
          color: ${theme.textSecondary} !important;
        }

        .admin-editor-theme span {
          color: inherit;
        }

        /* Background overrides */
        .admin-editor-theme .bg-white,
        .admin-editor-theme .bg-gray-50,
        .admin-editor-theme .bg-gray-100 {
          background-color: ${theme.bgSecondary} !important;
        }

        /* Border overrides */
        .admin-editor-theme .border-gray-200,
        .admin-editor-theme .border-gray-300 {
          border-color: ${theme.border} !important;
        }

        /* Text color overrides */
        .admin-editor-theme .text-gray-700,
        .admin-editor-theme .text-gray-800,
        .admin-editor-theme .text-gray-900 {
          color: ${theme.textPrimary} !important;
        }

        .admin-editor-theme .text-gray-500,
        .admin-editor-theme .text-gray-600 {
          color: ${theme.textSecondary} !important;
        }

        /* Buttons - Primary */
        .admin-editor-theme button[type="submit"],
        .admin-editor-theme .btn-primary {
          background-color: ${theme.accent} !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 500 !important;
          border-radius: 6px !important;
          transition: background-color 0.15s ease !important;
        }

        .admin-editor-theme button[type="submit"]:hover,
        .admin-editor-theme .btn-primary:hover {
          background-color: ${theme.accentHover} !important;
        }

        /* Buttons - Secondary */
        .admin-editor-theme button:not([type="submit"]):not(.btn-primary) {
          color: ${theme.textSecondary} !important;
        }

        /* Cards */
        .admin-editor-theme .shadow,
        .admin-editor-theme .shadow-sm,
        .admin-editor-theme .shadow-md,
        .admin-editor-theme .shadow-lg {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
        }

        /* Remove rounded-xl, use consistent radius */
        .admin-editor-theme .rounded-lg,
        .admin-editor-theme .rounded-xl,
        .admin-editor-theme .rounded-2xl {
          border-radius: 8px !important;
        }

        /* Scrollbar */
        .admin-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .admin-scrollbar::-webkit-scrollbar-track {
          background: ${theme.bgPrimary};
        }

        .admin-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 4px;
        }

        .admin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.borderLight};
        }

        /* Tab buttons - make consistent */
        .admin-editor-theme [role="tab"],
        .admin-editor-theme .tab-button {
          background-color: transparent !important;
          color: ${theme.textSecondary} !important;
          border: none !important;
          font-weight: 500 !important;
        }

        .admin-editor-theme [role="tab"][aria-selected="true"],
        .admin-editor-theme .tab-button.active {
          background-color: ${theme.accentMuted} !important;
          color: ${theme.accent} !important;
        }

        /* Design picker cards */
        .admin-editor-theme .design-card {
          border: 1px solid ${theme.border} !important;
          transition: border-color 0.15s ease !important;
        }

        .admin-editor-theme .design-card:hover {
          border-color: ${theme.borderLight} !important;
        }

        .admin-editor-theme .design-card.selected {
          border-color: ${theme.accent} !important;
          box-shadow: 0 0 0 3px ${theme.accentMuted} !important;
        }
      `}</style>
    </div>
  );
};

export default SectionNavigator;
