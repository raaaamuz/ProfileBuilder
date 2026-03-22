import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PreviewContext } from './PreviewContext';
import Settings from './Settings/Settings';

import Home from '../Public/Home/Home';
import Profile from '../Public/Profile/Profile';
import Education from '../Public/Education/Education';
import Blog from '../Public/Blogs/Blog';
import CareerTimeline from '../Public/Career/CareerTimeline';
import AwardsSection from '../Public/Profile/AwardsSection';

import { Sparkles, Loader2, Check, Palette, Copy, ExternalLink, Globe, X, LayoutGrid } from 'lucide-react';
import { SampleResumePreview, resumeTemplates as allResumeTemplates } from './Resume/ResumeTemplates';
import BioSection from '../Public/Profile/BioSection';
import SkillsSection from '../Public/Profile/SkillsSection';
import api from '../../services/api';

// Publish Panel Component
const PublishPanel = () => {
  const [username, setUsername] = React.useState('');
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [publishStatus, setPublishStatus] = React.useState('');

  React.useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get('/users/username/');
        if (response.data.username) {
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsername();
  }, []);

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const profileUrl = username
    ? (isLocalhost
        ? `http://localhost:3000/public/profile/${username}`
        : `https://${username}.profile2connect.com`)
    : '';

  const handleCopyLink = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus('');

    try {
      // Publish home content - this sets is_published=True on HomePageContent
      await api.post('/home/publish/');

      setPublishStatus('success');
      setTimeout(() => setPublishStatus(''), 3000);
    } catch (error) {
      console.error('Error publishing:', error);
      setPublishStatus('error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleViewProfile = () => {
    if (profileUrl) {
      window.open(profileUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-4 mb-4 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Globe size={20} />
        <h3 className="font-bold text-lg">Your Public Profile</h3>
      </div>

      {username ? (
        <>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
            <p className="text-xs text-white/80 mb-1">Share your profile:</p>
            <div className="flex items-center gap-2">
              <code className="text-xs flex-1 truncate">{profileUrl}</code>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-white/20 rounded-lg transition flex-shrink-0"
                title="Copy link"
              >
                {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publishing...
                </>
              ) : publishStatus === 'success' ? (
                <>
                  <Check size={18} />
                  Published!
                </>
              ) : (
                <>
                  <Globe size={18} />
                  Publish
                </>
              )}
            </button>
            <button
              onClick={handleViewProfile}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition"
              title="View profile"
            >
              <ExternalLink size={18} />
            </button>
          </div>

          {publishStatus === 'success' && (
            <p className="text-xs text-green-200 mt-2 text-center">
              Your profile is now live!
            </p>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-2">
          <Loader2 size={20} className="animate-spin" />
        </div>
      )}
    </div>
  );
};

// Layout icon component
const LayoutIcon = ({ type }) => {
  const icons = {
    cards: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <rect x="2" y="2" width="9" height="9" rx="1" />
        <rect x="13" y="2" width="9" height="9" rx="1" />
        <rect x="2" y="13" width="9" height="9" rx="1" />
        <rect x="13" y="13" width="9" height="9" rx="1" />
      </svg>
    ),
    timeline: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="6" cy="4" r="2" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="6" cy="20" r="2" />
        <rect x="10" y="3" width="12" height="2" rx="1" />
        <rect x="10" y="11" width="12" height="2" rx="1" />
        <rect x="10" y="19" width="12" height="2" rx="1" />
      </svg>
    ),
    stacked: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="6" rx="1" />
        <rect x="2" y="10" width="20" height="6" rx="1" />
        <rect x="2" y="18" width="20" height="4" rx="1" />
      </svg>
    ),
    minimal: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <rect x="2" y="4" width="20" height="2" rx="1" />
        <rect x="2" y="11" width="20" height="2" rx="1" />
        <rect x="2" y="18" width="20" height="2" rx="1" />
      </svg>
    ),
  };
  return icons[type] || icons.cards;
};

// AI Design Card Component - Shows distinct design concepts visually
const AIDesignCard = ({ design, isSelected, onSelect, index }) => {
  // Generate preview elements based on design concept
  const renderConceptPreview = () => {
    const cardStyle = design.cardStyle || 'elevated';
    const borderRadius = design.borderRadius || 12;

    // Mini card preview based on card style
    const miniCardStyle = {
      width: '100%',
      height: '20px',
      borderRadius: `${Math.min(borderRadius, 8)}px`,
      backgroundColor: design.cardBg || `${design.accentColor}15`,
      border: design.cardBorder || `1px solid ${design.accentColor}30`,
      boxShadow: cardStyle === 'elevated' ? '0 2px 4px rgba(0,0,0,0.1)' :
                 cardStyle === 'glassmorphism' ? '0 4px 12px rgba(0,0,0,0.15)' :
                 cardStyle === 'neumorphism' ? '2px 2px 4px #c8ccd4, -2px -2px 4px #ffffff' : 'none',
    };

    return (
      <div className="space-y-1 w-full">
        {/* Layout indicator dots/lines */}
        <div className="flex items-center gap-1 mb-1">
          {design.layoutType === 'timeline' && (
            <>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: design.accentColor }} />
              <div className="flex-1 h-0.5" style={{ backgroundColor: `${design.accentColor}40` }} />
            </>
          )}
          {design.layoutType === 'grid' && (
            <div className="grid grid-cols-2 gap-0.5 w-full">
              {[1, 2].map(i => (
                <div key={i} className="h-1 rounded-sm" style={{ backgroundColor: `${design.accentColor}40` }} />
              ))}
            </div>
          )}
          {(design.layoutType === 'cards' || design.layoutType === 'list') && (
            <div className="w-full space-y-0.5">
              <div className="h-1 rounded-sm" style={{ backgroundColor: `${design.accentColor}40` }} />
              <div className="h-1 w-3/4 rounded-sm" style={{ backgroundColor: `${design.accentColor}25` }} />
            </div>
          )}
          {!['timeline', 'grid', 'cards', 'list'].includes(design.layoutType) && (
            <div className="w-full h-1 rounded-sm" style={{ backgroundColor: `${design.accentColor}40` }} />
          )}
        </div>
        {/* Sample card with actual styling */}
        <div style={miniCardStyle} className="flex items-center px-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: design.accentColor }} />
          <div className="ml-1 flex-1 h-1 rounded" style={{ backgroundColor: `${design.textColor}30` }} />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(design)}
      className={`relative cursor-pointer overflow-hidden transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : 'hover:scale-[1.02]'
      }`}
      style={{
        borderRadius: `${Math.min(design.borderRadius || 12, 12)}px`,
        border: isSelected ? '2px solid #3b82f6' : `1px solid ${design.accentColor}40`,
      }}
    >
      {isSelected && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5 z-10">
          <Check size={10} />
        </div>
      )}
      <div
        className="p-2 flex flex-col gap-1.5"
        style={{
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          fontFamily: design.fontFamily,
          minHeight: '70px',
        }}
      >
        {/* Concept name and layout type */}
        <div className="flex items-center justify-between">
          <span
            className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: `${design.accentColor}20`,
              color: design.accentColor,
              borderRadius: `${Math.min(design.borderRadius || 4, 6)}px`,
            }}
          >
            {design.layoutType || 'cards'}
          </span>
          {design.glowEffect && (
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: design.accentColor, boxShadow: `0 0 6px ${design.accentColor}` }} />
          )}
        </div>

        {/* Visual preview */}
        {renderConceptPreview()}

        {/* Design name */}
        <h4 className="font-bold text-[10px] truncate mt-auto" style={{ color: design.textColor }}>
          {design.name}
        </h4>
      </div>
    </motion.div>
  );
};

// Resume template definitions
const resumeTemplates = [
  { id: 'professional', name: 'Professional', tag: 'classic', bgColor: 'bg-gradient-to-r from-blue-900 to-blue-700' },
  { id: 'modern', name: 'Modern', tag: 'trending', bgColor: 'bg-gradient-to-r from-purple-600 to-indigo-600' },
  { id: 'minimal', name: 'Minimal', tag: 'clean', bgColor: 'bg-white border-2 border-gray-200' },
  { id: 'executive', name: 'Executive', tag: 'premium', bgColor: 'bg-gray-900' },
  { id: 'creative', name: 'Creative', tag: 'colorful', bgColor: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
  { id: 'tech', name: 'Tech', tag: 'developer', bgColor: 'bg-slate-900' },
];

// Helper to process resume HTML - reorder, hide, and move sections between columns
const processResumeHtml = (html, sections) => {
  if (!html || !sections) return html;

  // Section heading patterns to match (case insensitive)
  const sectionMatchers = {
    skills: ['SKILLS', 'Skills', 'Technical Skills', 'Core Skills', 'TECHNICAL SKILLS'],
    education: ['EDUCATION', 'Education', 'Academic Background', 'ACADEMIC'],
    summary: ['PROFESSIONAL SUMMARY', 'Summary', 'Profile', 'About', 'SUMMARY', 'PROFILE'],
    experience: ['PROFESSIONAL EXPERIENCE', 'Experience', 'Work Experience', 'Employment', 'EXPERIENCE', 'WORK EXPERIENCE'],
    awards: ['AWARDS', 'Awards', 'Honors', 'HONORS'],
    achievements: ['ACHIEVEMENTS', 'Achievements', 'Accomplishments', 'ACCOMPLISHMENTS'],
  };

  // Parse HTML into DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Find the two-column containers (sidebar and main)
  // Look for common patterns: .sidebar/.main, .left/.right, or flex children with specific widths
  let sidebarContainer = doc.querySelector('.sidebar, .left-column, [class*="sidebar"]');
  let mainContainer = doc.querySelector('.main, .right-column, .main-content, [class*="main"]:not([class*="domain"])');

  // If not found by class, try to find by structure (two flex children in a content wrapper)
  if (!sidebarContainer || !mainContainer) {
    // Try various content wrapper selectors
    const contentSelectors = ['.content', '.columns', '.two-column', '.resume-content', '.body', '[style*="display: flex"]', '[style*="display:flex"]'];
    let contentDiv = null;

    for (const selector of contentSelectors) {
      contentDiv = doc.querySelector(selector);
      if (contentDiv) break;
    }

    // If still not found, look for a div with exactly 2 child divs after the header
    if (!contentDiv) {
      const allDivs = doc.querySelectorAll('.resume > div, body > div > div');
      for (const div of allDivs) {
        const children = Array.from(div.children).filter(c => c.tagName === 'DIV' || c.tagName === 'SECTION');
        if (children.length === 2) {
          contentDiv = div;
          break;
        }
      }
    }

    if (contentDiv) {
      const children = Array.from(contentDiv.children).filter(c => c.tagName === 'DIV' || c.tagName === 'SECTION');
      if (children.length >= 2) {
        // Check widths - sidebar is typically narrower (30-40%)
        const child0Style = children[0].getAttribute('style') || '';

        // Look for width percentages or classes indicating left/right
        const isChild0Sidebar = child0Style.includes('35%') || child0Style.includes('30%') ||
                                children[0].classList.contains('sidebar') ||
                                children[0].classList.contains('left');

        if (isChild0Sidebar) {
          sidebarContainer = children[0];
          mainContainer = children[1];
        } else {
          // Default: first is sidebar, second is main
          sidebarContainer = children[0];
          mainContainer = children[1];
        }
      }
    }
  }

  console.log('[Resume Preview] Sidebar container found:', !!sidebarContainer);
  console.log('[Resume Preview] Main container found:', !!mainContainer);

  // Find all headings that might be section headers
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="section-title"], [class*="section-header"]');

  // Map sections to their container elements
  const sectionElements = {};

  headings.forEach(heading => {
    const text = heading.textContent.trim().toUpperCase();
    for (const [sectionKey, matchers] of Object.entries(sectionMatchers)) {
      if (matchers.some(m => text.includes(m.toUpperCase()))) {
        // Find the section container (parent div/section)
        let container = heading.parentElement;
        // Walk up to find a reasonable container (with class "section" or a div/section)
        while (container && container !== doc.body) {
          if (container.classList?.contains('section') ||
              container.getAttribute('data-resume-section') ||
              (container.tagName === 'DIV' && container.querySelector('.section-title, h2, h3'))) {
            break;
          }
          container = container.parentElement;
        }
        // Fallback: use the heading's immediate parent if it's a reasonable container
        if (!container || container === doc.body) {
          container = heading.parentElement;
        }
        if (container && container !== doc.body) {
          sectionElements[sectionKey] = container;
          container.setAttribute('data-resume-section', sectionKey);
        }
        break;
      }
    }
  });

  // Get all sections with their enabled state and order
  const allSections = [...(sections.sidebar || []), ...(sections.main || [])];

  // Hide disabled sections
  allSections.forEach(section => {
    if (!section.enabled && sectionElements[section.key]) {
      sectionElements[section.key].style.display = 'none';
    } else if (section.enabled && sectionElements[section.key]) {
      sectionElements[section.key].style.display = '';
    }
  });

  // Move sections between containers if needed
  const sidebarKeys = (sections.sidebar || []).map(s => s.key);
  const mainKeys = (sections.main || []).map(s => s.key);

  if (sidebarContainer && mainContainer) {
    // Move sections that should be in sidebar
    sidebarKeys.forEach(key => {
      const el = sectionElements[key];
      if (el && !sidebarContainer.contains(el)) {
        sidebarContainer.appendChild(el);
      }
    });

    // Move sections that should be in main
    mainKeys.forEach(key => {
      const el = sectionElements[key];
      if (el && !mainContainer.contains(el)) {
        mainContainer.appendChild(el);
      }
    });
  }

  // Reorder sections within their containers
  const sidebarOrder = (sections.sidebar || []).filter(s => s.enabled).map(s => s.key);
  reorderSectionsInContainer(sectionElements, sidebarOrder, sidebarContainer);

  const mainOrder = (sections.main || []).filter(s => s.enabled).map(s => s.key);
  reorderSectionsInContainer(sectionElements, mainOrder, mainContainer);

  return doc.documentElement.outerHTML;
};

// Helper to reorder sections within a specific container
const reorderSectionsInContainer = (sectionElements, orderedKeys, container) => {
  if (orderedKeys.length < 1 || !container) return;

  // Get elements for ordered keys
  const elements = orderedKeys
    .map(key => sectionElements[key])
    .filter(el => el && container.contains(el));

  if (elements.length < 1) return;

  // Reorder by appending in correct order (this moves them to end in order)
  elements.forEach(el => {
    container.appendChild(el);
  });
};

// Resume Preview Component - shows generated resume with template info and sample preview
const ResumePreview = ({ selectedTemplate, liveResumeHtml, liveResumeSections, onTemplateChange, onShowLayoutModal, onGenerate, generating, canGenerate }) => {
  const [resumeHtml, setResumeHtml] = React.useState(liveResumeHtml || null);
  const [savedTemplate, setSavedTemplate] = React.useState(selectedTemplate || 'professional');
  const [loading, setLoading] = React.useState(!liveResumeHtml);
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [previewTemplate, setPreviewTemplate] = React.useState(null); // For hover preview

  // Update local state when context changes (new resume generated)
  React.useEffect(() => {
    if (liveResumeHtml) {
      setResumeHtml(liveResumeHtml);
      setSavedTemplate(selectedTemplate);
      setLoading(false);
    }
  }, [liveResumeHtml, selectedTemplate]);

  // Update savedTemplate when selectedTemplate changes
  React.useEffect(() => {
    if (selectedTemplate) {
      setSavedTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  // Fetch from API only if no live data (returning to tab)
  React.useEffect(() => {
    if (!liveResumeHtml && loading) {
      const fetchResume = async () => {
        try {
          const response = await api.get("/profile/resume/html/");
          if (response.data.resume_html) {
            setResumeHtml(response.data.resume_html);
            if (response.data.template) {
              setSavedTemplate(response.data.template);
            }
          }
        } catch (error) {
          console.log("No resume available yet");
        } finally {
          setLoading(false);
        }
      };
      fetchResume();
    }
  }, [liveResumeHtml, loading]);

  // Process HTML with section visibility
  const displayHtml = React.useMemo(() => {
    return processResumeHtml(resumeHtml, liveResumeSections);
  }, [resumeHtml, liveResumeSections]);

  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    setSavedTemplate(templateId);
    if (onTemplateChange) {
      onTemplateChange(templateId);
    }
    setShowTemplateModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  // Get template info
  const templateInfo = resumeTemplates.find(t => t.id === savedTemplate) || resumeTemplates[0];

  return (
    <div>
      {/* Template Selector Modal with Sample Preview */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a]">
              <div>
                <h2 className="text-lg font-bold text-[#d4a853]">Choose Resume Template</h2>
                <p className="text-sm text-gray-300">Hover over templates to preview, click to select</p>
              </div>
              <button
                onClick={() => { setShowTemplateModal(false); setPreviewTemplate(null); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {/* Left: Template Grid */}
              <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {allResumeTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      onMouseEnter={() => setPreviewTemplate(template.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg hover:scale-105 ${
                        savedTemplate === template.id
                          ? 'border-[#d4a853] shadow-lg ring-2 ring-[#d4a853]/30'
                          : previewTemplate === template.id
                          ? 'border-purple-400 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-[3/4] p-1.5 bg-gray-50">
                        {template.preview}
                      </div>
                      <div className="p-2 bg-white border-t border-gray-100 flex items-center justify-between">
                        <span className="font-medium text-xs text-gray-800">{template.name}</span>
                        {savedTemplate === template.id && (
                          <Check size={14} className="text-[#d4a853]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Sample Preview */}
              <div className="w-1/2 p-4 bg-gray-50 overflow-y-auto">
                <div className="sticky top-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">
                      {previewTemplate
                        ? `Preview: ${allResumeTemplates.find(t => t.id === previewTemplate)?.name || 'Template'}`
                        : `Selected: ${allResumeTemplates.find(t => t.id === savedTemplate)?.name || 'Professional'}`
                      }
                    </h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Sample Data</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <SampleResumePreview templateId={previewTemplate || savedTemplate} />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    This preview uses sample data. Your actual resume will use your profile information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview */}
      {resumeHtml ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a] text-white text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-[#d4a853]" />
              <span className="text-[#d4a853]">Resume Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowLayoutModal && onShowLayoutModal()}
                className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors flex items-center gap-1"
              >
                <LayoutGrid size={12} />
                Layout
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-3 py-1 bg-[#d4a853] text-[#4a4a4a] rounded-lg text-xs font-medium hover:bg-[#c49843] transition-colors flex items-center gap-1"
              >
                <Palette size={12} />
                {templateInfo.name}
              </button>
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px', overflow: 'auto', backgroundColor: '#f3f4f6', padding: '16px' }}>
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '520px',
                height: '735px',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                borderRadius: '6px',
                overflow: 'hidden',
                background: 'white'
              }}>
                <iframe
                  srcDoc={displayHtml}
                  title="Resume Preview"
                  className="border-0"
                  style={{
                    width: '794px',
                    height: '1123px',
                    transform: 'scale(0.655)',
                    transformOrigin: 'top left',
                    background: 'white',
                    border: 'none'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t">
            <button
              onClick={onGenerate}
              disabled={generating || !canGenerate}
              style={{
                backgroundColor: generating ? '#666' : !canGenerate ? '#22c55e' : '#4a4a4a',
                color: !canGenerate ? '#ffffff' : '#d4a853',
                border: '2px solid #d4a853'
              }}
              className={`w-full py-2.5 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${
                generating || !canGenerate ? 'cursor-not-allowed' : 'hover:bg-[#3a3a3a]'
              }`}
            >
              {generating ? (
                <><Loader2 className="animate-spin" size={16} /> Regenerating...</>
              ) : !canGenerate ? (
                <><Check size={16} /> Resume Up to Date</>
              ) : (
                <><Sparkles size={16} /> Regenerate Resume</>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {!canGenerate ? "Change template or layout to regenerate" : "Click to regenerate with current settings"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with Change Template button */}
          <div className="p-3 bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a] text-white text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#d4a853]">Template Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowLayoutModal && onShowLayoutModal()}
                className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors flex items-center gap-1"
              >
                <LayoutGrid size={12} />
                Layout
              </button>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-3 py-1 bg-[#d4a853] text-[#4a4a4a] rounded-lg text-xs font-medium hover:bg-[#c49843] transition-colors flex items-center gap-1"
              >
                <Palette size={12} />
                Template
              </button>
            </div>
          </div>

          {/* Sample Resume Preview */}
          <div className="p-4">
            <SampleResumePreview templateId={savedTemplate} />

            {/* Generate Resume Button */}
            <div className="mt-4 space-y-2">
              <button
                onClick={onGenerate}
                disabled={generating || !canGenerate}
                style={{
                  backgroundColor: generating ? '#666' : !canGenerate ? '#22c55e' : '#4a4a4a',
                  color: !canGenerate ? '#ffffff' : '#d4a853',
                  border: '2px solid #d4a853'
                }}
                className={`w-full py-3 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                  generating || !canGenerate ? 'cursor-not-allowed' : 'hover:bg-[#3a3a3a]'
                }`}
              >
                {generating ? (
                  <><Loader2 className="animate-spin" size={18} /> Generating... (15-30s)</>
                ) : !canGenerate ? (
                  <><Check size={18} /> Resume Up to Date</>
                ) : (
                  <><Sparkles size={18} /> Generate Resume</>
                )}
              </button>
              <p className="text-center text-xs text-gray-500">
                {!canGenerate
                  ? "Change template, sections, or styles to regenerate"
                  : "Generate your resume using your profile data"
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewPanel = () => {
  const location = useLocation();
  const {
    previewData,
    refreshPreview,
    liveHomeData,
    liveCareerDesign,
    liveCareerData,
    liveEducationDesign,
    liveEducationData,
    liveProfileDesign,
    liveAwardsDesign,
    updateCareerDesign,
    updateEducationDesign,
    updateProfileDesign,
    updateAwardsDesign,
    careerAiDesigns,
    setCareerAiDesigns,
    educationAiDesigns,
    setEducationAiDesigns,
    profileAiDesigns,
    setProfileAiDesigns,
    awardsAiDesigns,
    setAwardsAiDesigns,
    isGeneratingDesigns,
    generateAiDesigns,
    liveResumeTemplate,
    liveResumeHtml,
    liveResumeSections,
    updateResumeTemplate,
    setShowResumeLayoutModal,
    resumeGenerateCallback,
    resumeGenerating,
    resumeCanGenerate
  } = useContext(PreviewContext);

  const [selectedDesign, setSelectedDesign] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Extract the active section from the URL (assumes URL format: /dashboard/sectionName)
  const pathParts = location.pathname.split('/');
  const activeSection = pathParts[pathParts.length - 1];

  // Get current designs based on section
  const currentDesigns = activeSection === 'career'
    ? careerAiDesigns
    : activeSection === 'profile'
      ? profileAiDesigns
      : activeSection === 'awards'
        ? awardsAiDesigns
        : educationAiDesigns;
  const currentLiveDesign = activeSection === 'career'
    ? liveCareerDesign
    : activeSection === 'profile'
      ? liveProfileDesign
      : activeSection === 'awards'
        ? liveAwardsDesign
        : liveEducationDesign;

  // Default designs for each section - Advanced modern designs like Replit
  const defaultCareerDesigns = [
    { id: 'neon-cyber', name: 'Neon Cyber', layoutType: 'timeline', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 16, spacing: 'relaxed', gradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)', glowEffect: true },
    { id: 'aurora-dark', name: 'Aurora Dark', layoutType: 'cards', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#7c3aed', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20, spacing: 'normal', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'frosted-glass', name: 'Frosted Glass', layoutType: 'stacked', backgroundColor: 'rgba(255,255,255,0.1)', textColor: '#1e293b', accentColor: '#06b6d4', fontFamily: 'Poppins, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, spacing: 'relaxed', backdropBlur: true },
    { id: 'gradient-wave', name: 'Gradient Wave', layoutType: 'timeline', backgroundColor: '#1a1a2e', textColor: '#f8fafc', accentColor: '#f472b6', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'elevated', borderRadius: 16, spacing: 'normal', gradient: 'linear-gradient(to right, #ec4899, #8b5cf6)' },
    { id: 'minimal-zen', name: 'Minimal Zen', layoutType: 'minimal', backgroundColor: '#fafafa', textColor: '#18181b', accentColor: '#000000', fontFamily: 'Inter, sans-serif', cardStyle: 'flat', borderRadius: 8, spacing: 'compact' }
  ];

  const defaultEducationDesigns = [
    { id: 'zigzag-neon', name: 'Zigzag Neon', layoutType: 'alternating', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, spacing: 'relaxed', glowEffect: true },
    { id: 'aurora-journey', name: 'Aurora Journey', layoutType: 'journey', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, spacing: 'relaxed' },
    { id: 'floating-cosmic', name: 'Floating Cosmic', layoutType: 'floating', backgroundColor: '#13111c', textColor: '#e2e8f0', accentColor: '#ec4899', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20, spacing: 'normal' },
    { id: 'book-stack', name: 'Book Stack', layoutType: 'bookstack', backgroundColor: '#1c1917', textColor: '#fef3c7', accentColor: '#f59e0b', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 12, spacing: 'compact' },
    { id: 'ocean-timeline', name: 'Ocean Timeline', layoutType: 'alternating', backgroundColor: '#0c1929', textColor: '#e0f2fe', accentColor: '#22d3ee', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 16, spacing: 'normal' },
    { id: 'sunset-path', name: 'Sunset Path', layoutType: 'journey', backgroundColor: '#1a1a2e', textColor: '#fef3c7', accentColor: '#fb923c', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, spacing: 'relaxed' },
    { id: 'mint-cards', name: 'Mint Cards', layoutType: 'cards', backgroundColor: '#f0fdf4', textColor: '#166534', accentColor: '#10b981', fontFamily: 'DM Sans, sans-serif', cardStyle: 'bordered', borderRadius: 16, spacing: 'normal' },
    { id: 'nordic-float', name: 'Nordic Float', layoutType: 'floating', backgroundColor: '#f8fafc', textColor: '#0f172a', accentColor: '#3b82f6', fontFamily: 'Inter, sans-serif', cardStyle: 'elevated', borderRadius: 20, spacing: 'normal' }
  ];

  const defaultProfileDesigns = [
    { id: 'replit-dark', name: 'Replit Dark', layoutType: 'horizontal', backgroundColor: '#0e1525', textColor: '#f5f9fc', accentColor: '#ff6b35', nameColor: '#ffffff', fontFamily: 'IBM Plex Sans, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'circle', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', glowEffect: true },
    { id: 'neon-nights', name: 'Neon Nights', layoutType: 'centered', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', nameColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, imageStyle: 'rounded', gradient: 'radial-gradient(circle at top, #1a1a2e, #0a0a0f)' },
    { id: 'aurora-borealis', name: 'Aurora Borealis', layoutType: 'horizontal', backgroundColor: '#0f0f23', textColor: '#ffffff', accentColor: '#a78bfa', nameColor: '#c4b5fd', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 28, imageStyle: 'circle', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f472b6 100%)' },
    { id: 'sunset-vibes', name: 'Sunset Vibes', layoutType: 'centered', backgroundColor: '#1c1917', textColor: '#fef3c7', accentColor: '#fb923c', nameColor: '#fbbf24', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 20, imageStyle: 'rounded', gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
    { id: 'ocean-depths', name: 'Ocean Depths', layoutType: 'horizontal', backgroundColor: '#0c1929', textColor: '#e0f2fe', accentColor: '#22d3ee', nameColor: '#67e8f9', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'circle', gradient: 'linear-gradient(180deg, #0369a1 0%, #0c4a6e 100%)' },
    { id: 'minimalist-pro', name: 'Minimalist Pro', layoutType: 'horizontal', backgroundColor: '#ffffff', textColor: '#18181b', accentColor: '#6366f1', nameColor: '#4f46e5', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 16, imageStyle: 'circle' },
    { id: 'forest-mist', name: 'Forest Mist', layoutType: 'centered', backgroundColor: '#14532d', textColor: '#dcfce7', accentColor: '#4ade80', nameColor: '#86efac', fontFamily: 'DM Sans, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, imageStyle: 'rounded', gradient: 'linear-gradient(135deg, #166534 0%, #15803d 100%)' },
    { id: 'rose-gold', name: 'Rose Gold', layoutType: 'horizontal', backgroundColor: '#18181b', textColor: '#fce7f3', accentColor: '#f472b6', nameColor: '#fb7185', fontFamily: 'Playfair Display, serif', cardStyle: 'elevated', borderRadius: 20, imageStyle: 'circle', gradient: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)' }
  ];

  const defaultAwardsDesigns = [
    { id: 'trophy-gold', name: 'Trophy Gold', layoutType: 'grid', backgroundColor: '#0c0a1d', textColor: '#ffffff', accentColor: '#fbbf24', fontFamily: 'Inter, sans-serif', cardStyle: 'glassmorphism', borderRadius: 24, gradient: 'linear-gradient(180deg, #0c0a1d 0%, #1a1333 100%)' },
    { id: 'royal-purple', name: 'Royal Purple', layoutType: 'grid', backgroundColor: '#1a1333', textColor: '#e0e0e0', accentColor: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif', cardStyle: 'glassmorphism', borderRadius: 20, gradient: 'linear-gradient(135deg, #581c87 0%, #1a1333 100%)' },
    { id: 'midnight-amber', name: 'Midnight Amber', layoutType: 'list', backgroundColor: '#0f172a', textColor: '#f8fafc', accentColor: '#f59e0b', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 16 },
    { id: 'neon-achievement', name: 'Neon Achievement', layoutType: 'grid', backgroundColor: '#0a0a0f', textColor: '#e0e0e0', accentColor: '#00ff88', fontFamily: 'JetBrains Mono, monospace', cardStyle: 'glassmorphism', borderRadius: 20, glowEffect: true },
    { id: 'clean-white', name: 'Clean White', layoutType: 'grid', backgroundColor: '#ffffff', textColor: '#18181b', accentColor: '#6366f1', fontFamily: 'Inter, sans-serif', cardStyle: 'bordered', borderRadius: 16 },
    { id: 'sunset-glory', name: 'Sunset Glory', layoutType: 'grid', backgroundColor: '#1c1917', textColor: '#fef3c7', accentColor: '#fb923c', fontFamily: 'Poppins, sans-serif', cardStyle: 'elevated', borderRadius: 24, gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }
  ];

  // Initialize designs if empty
  React.useEffect(() => {
    if (activeSection === 'career' && careerAiDesigns.length === 0) {
      setCareerAiDesigns(defaultCareerDesigns);
    }
    if (activeSection === 'education' && educationAiDesigns.length === 0) {
      setEducationAiDesigns(defaultEducationDesigns);
    }
    if (activeSection === 'profile' && profileAiDesigns.length === 0) {
      setProfileAiDesigns(defaultProfileDesigns);
    }
    if (activeSection === 'awards' && awardsAiDesigns.length === 0) {
      setAwardsAiDesigns(defaultAwardsDesigns);
    }
  }, [activeSection, careerAiDesigns.length, educationAiDesigns.length, profileAiDesigns.length, awardsAiDesigns.length, setCareerAiDesigns, setEducationAiDesigns, setProfileAiDesigns, setAwardsAiDesigns]);

  // Sync selected design with live design
  React.useEffect(() => {
    if (currentLiveDesign && !selectedDesign) {
      setSelectedDesign(currentLiveDesign);
    }
  }, [currentLiveDesign, selectedDesign]);

  const handleSelectDesign = async (design) => {
    setSelectedDesign(design);
    setIsSaving(true);

    const token = localStorage.getItem("token");

    if (activeSection === 'career') {
      updateCareerDesign(design);
      try {
        await api.post(
          "/career/settings/",
          { design_config: design, card_width: 300, card_height: 150, font_size: 16, font_family: design.fontFamily },
          { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error saving career design:", error);
      }
    } else if (activeSection === 'education') {
      updateEducationDesign(design);
      try {
        await api.put(
          "/education/update-selected-design/",
          { selected_design: design.id || design.name, design_config: design },
          { headers: { Authorization: `Token ${token}` } }
        );
      } catch (error) {
        console.error("Error saving education design:", error);
      }
    } else if (activeSection === 'profile') {
      updateProfileDesign(design);
      try {
        await api.put(
          "/profile/design/",
          { design_config: design },
          { headers: { Authorization: `Token ${token}` } }
        );
      } catch (error) {
        console.error("Error saving profile design:", error);
      }
    } else if (activeSection === 'awards') {
      updateAwardsDesign(design);
      try {
        await api.put(
          "/achievements/design/",
          { design_config: design },
          { headers: { Authorization: `Token ${token}` } }
        );
      } catch (error) {
        console.error("Error saving awards design:", error);
      }
    }

    setIsSaving(false);
  };

  const handleGenerateDesigns = () => {
    const context = activeSection === 'career' ? 'career timeline' :
                    activeSection === 'profile' ? 'profile' :
                    activeSection === 'awards' ? 'awards' : 'education';
    generateAiDesigns(context);
  };

  const renderDesignTemplates = () => {
    const getDefaultDesigns = () => {
      if (activeSection === 'career') return defaultCareerDesigns;
      if (activeSection === 'profile') return defaultProfileDesigns;
      if (activeSection === 'awards') return defaultAwardsDesigns;
      return defaultEducationDesigns;
    };
    const designs = currentDesigns.length > 0 ? currentDesigns : getDefaultDesigns();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="text-purple-600" size={18} />
            <h3 className="text-sm font-semibold text-gray-800">
              {activeSection === 'career' ? 'Timeline Designs' :
               activeSection === 'profile' ? 'Profile Designs' :
               activeSection === 'awards' ? 'Awards Designs' : 'Design Templates'}
            </h3>
          </div>
          <button
            onClick={handleGenerateDesigns}
            disabled={isGeneratingDesigns}
            style={{
              background: activeSection === 'career'
                ? 'linear-gradient(to right, #f97316, #ef4444)'
                : activeSection === 'profile'
                  ? 'linear-gradient(to right, #ec4899, #f43f5e)'
                  : activeSection === 'awards'
                    ? 'linear-gradient(to right, #fbbf24, #f59e0b)'
                    : 'linear-gradient(to right, #9333ea, #3b82f6)',
              color: '#ffffff'
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isGeneratingDesigns ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {isGeneratingDesigns ? 'Generating...' : 'AI Generate'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {designs.map((design, index) => (
            <AIDesignCard
              key={design.id || index}
              design={design}
              index={index}
              isSelected={selectedDesign?.id === design.id || selectedDesign?.name === design.name}
              onSelect={handleSelectDesign}
            />
          ))}
        </div>

        {isSaving && (
          <div className="mt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <Loader2 className="animate-spin" size={12} />
            Saving...
          </div>
        )}
        {selectedDesign && !isSaving && (
          <div className="mt-2 text-center text-xs text-green-600 flex items-center justify-center gap-1">
            <Check size={12} />
            Design applied
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    switch (activeSection) {
      case 'home':
        return <Home data={liveHomeData} />;
      case 'profile':
        return <BioSection isAdminPreview={true} globalFont={liveHomeData?.customSettings?.fontFamily} />;
      case 'education':
        return <Education liveDesignConfig={liveEducationDesign} liveEducationData={liveEducationData} globalFont={liveHomeData?.customSettings?.fontFamily} />;
      case 'blogs':
        return <Blog isAdminPreview={true} />;
      case 'career':
        return <CareerTimeline liveDesignConfig={liveCareerDesign} liveCareerData={liveCareerData} globalFont={liveHomeData?.customSettings?.fontFamily} />;
      case 'skills':
        return <SkillsSection isAdminPreview={true} globalFont={liveHomeData?.customSettings?.fontFamily} />;
      case 'awards':
        return <AwardsSection isAdminPreview={true} liveDesignConfig={liveAwardsDesign} globalFont={liveHomeData?.customSettings?.fontFamily} />;
      case 'resume':
        return <ResumePreview
          selectedTemplate={liveResumeTemplate}
          liveResumeHtml={liveResumeHtml}
          liveResumeSections={liveResumeSections}
          onTemplateChange={updateResumeTemplate}
          onShowLayoutModal={() => setShowResumeLayoutModal(true)}
          onGenerate={resumeGenerateCallback}
          generating={resumeGenerating}
          canGenerate={resumeCanGenerate}
        />;
      case 'settings':
        return previewData[activeSection] ? (
          <p>{previewData[activeSection]}</p>
        ) : (
          <p style={{ color: '#999' }}>Preview not enabled yet.</p>
        );
      default:
        return <p style={{ color: '#999' }}>No preview available.</p>;
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Publish Panel - Show only on settings page */}
      {activeSection === 'settings' && <PublishPanel />}

      {/* Hide preview content for settings page */}
      {activeSection !== 'settings' && (
        <>
          {/* Design Templates at top for career/education/profile/awards */}
          {(activeSection === 'career' || activeSection === 'education' || activeSection === 'profile' || activeSection === 'awards') && renderDesignTemplates()}

          {renderPreview()}
        </>
      )}
    </div>
  );
};

export default PreviewPanel;
