import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Home,
  User,
  FileText,
  BookOpen,
  Mail,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Wrench,
  Trophy,
  Award,
  GripVertical,
  Package,
  Quote,
  Layout,
  Layers,
  ArrowLeftRight,
  ArrowUpDown,
  Check,
  Palette,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import CustomDomainSettings from "./CustomDomainSettings";

const Settings = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({ Profile: true });

  const pageIcons = {
    Home: Home,
    Profile: User,
    Blog: FileText,
    Stories: BookOpen,
    Contact: Mail
  };

  const subSectionIcons = {
    Education: GraduationCap,
    Career: Briefcase,
    Skills: Wrench,
    Services: Package,
    Awards: Trophy,
    Testimonials: Quote,
    Achievements: Award,
  };

  const [availableTabs, setAvailableTabs] = useState([
    { name: "Home", path: "/", key: "show_home", enabled: true },
    {
      name: "Profile",
      path: "/profile",
      key: "show_profile",
      enabled: true,
      subSections: [
        { name: "Education", key: "show_education", enabled: true },
        { name: "Career", key: "show_career", enabled: true },
        { name: "Skills", key: "show_skills", enabled: true },
        { name: "Services", key: "show_services", enabled: true },
        { name: "Awards", key: "show_awards", enabled: true },
        { name: "Testimonials", key: "show_testimonials", enabled: true },
        { name: "Achievements", key: "show_achievements", enabled: true },
      ]
    },
    { name: "Blog", path: "/blog", key: "show_blog", enabled: true },
    { name: "Stories", path: "/stories", key: "show_stories", enabled: true },
    { name: "Contact", path: "/contact", key: "show_contact", enabled: true },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingIndex, setSavingIndex] = useState(null);
  const [draggedSubIndex, setDraggedSubIndex] = useState(null);
  const [contentCounts, setContentCounts] = useState({});
  const [publicLayout, setPublicLayout] = useState('default');
  const [savingLayout, setSavingLayout] = useState(false);

  const layoutOptions = [
    { id: 'default', name: 'Classic', description: 'Traditional page-by-page navigation', icon: Layout },
    { id: 'vertical', name: 'Vertical Slider', description: 'Full-page sections with scroll/swipe', icon: ArrowUpDown },
    { id: 'horizontal', name: 'Horizontal Slideshow', description: 'Left/right navigation between sections', icon: ArrowLeftRight },
    { id: 'cards', name: 'Card Stack', description: 'Stacked cards that reveal on scroll', icon: Layers },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch content counts to determine which sections have data
        const [settingsRes, educationRes, careerRes, skillsRes, servicesRes, awardsRes, testimonialsRes] = await Promise.all([
          api.get("/users/settings/").catch(() => ({ data: { settings: {} } })),
          api.get("/education/entries/").catch(() => ({ data: [] })),
          api.get("/career/entries/").catch(() => ({ data: [] })),
          api.get("/career/skill/").catch(() => ({ data: [] })),
          api.get("/services/").catch(() => ({ data: [] })),
          api.get("/achievements/awards/").catch(() => ({ data: [] })),
          api.get("/testimonials/").catch(() => ({ data: [] })),
        ]);

        // Handle different API response structures
        const getArrayLength = (data, nestedKey = null) => {
          if (nestedKey && data && data[nestedKey]) {
            return Array.isArray(data[nestedKey]) ? data[nestedKey].length : 0;
          }
          return Array.isArray(data) ? data.length : 0;
        };

        const counts = {
          show_education: getArrayLength(educationRes.data),
          show_career: getArrayLength(careerRes.data, 'careerEntries'), // Career returns nested structure
          show_skills: getArrayLength(skillsRes.data),
          show_services: getArrayLength(servicesRes.data),
          show_awards: getArrayLength(awardsRes.data),
          show_testimonials: getArrayLength(testimonialsRes.data),
          show_achievements: 0, // Achievements handled separately
        };
        setContentCounts(counts);

        if (settingsRes.data && settingsRes.data.settings) {
          const settings = settingsRes.data.settings;
          // Load public layout setting
          if (settings.public_layout) {
            setPublicLayout(settings.public_layout);
          }
          const updatedTabs = availableTabs.map((tab) => {
            if (tab.subSections) {
              let orderedSubSections = tab.subSections.map((sub) => {
                // If setting exists, use it; otherwise, default based on content
                const hasExplicitSetting = settings[sub.key] !== undefined;
                const hasContent = counts[sub.key] > 0;
                const isEnabled = hasExplicitSetting ? settings[sub.key] !== false : hasContent;
                return {
                  ...sub,
                  enabled: isEnabled,
                  hasContent: hasContent,
                };
              });
              if (settings.section_order && Array.isArray(settings.section_order)) {
                orderedSubSections.sort((a, b) => {
                  const indexA = settings.section_order.indexOf(a.key);
                  const indexB = settings.section_order.indexOf(b.key);
                  if (indexA === -1) return 1;
                  if (indexB === -1) return -1;
                  return indexA - indexB;
                });
              }
              return {
                ...tab,
                enabled: settings[tab.key] !== false,
                subSections: orderedSubSections,
              };
            }
            return {
              ...tab,
              enabled: settings[tab.key] !== false,
            };
          });
          setAvailableTabs(updatedTabs);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleTab = async (index) => {
    setSavingIndex(index);
    const updatedTabs = [...availableTabs];
    updatedTabs[index].enabled = !updatedTabs[index].enabled;
    setAvailableTabs(updatedTabs);

    const settingsPayload = buildSettingsPayload(updatedTabs);
    await saveSettings(settingsPayload);
    setTimeout(() => setSavingIndex(null), 500);
  };

  const handleToggleSubSection = async (tabIndex, subIndex) => {
    setSavingIndex(`${tabIndex}-${subIndex}`);
    const updatedTabs = [...availableTabs];
    updatedTabs[tabIndex].subSections[subIndex].enabled = !updatedTabs[tabIndex].subSections[subIndex].enabled;
    setAvailableTabs(updatedTabs);

    const settingsPayload = buildSettingsPayload(updatedTabs);
    await saveSettings(settingsPayload);
    setTimeout(() => setSavingIndex(null), 500);
  };

  const buildSettingsPayload = (tabs, layout = null) => {
    const payload = {};
    tabs.forEach((tab) => {
      payload[tab.key] = tab.enabled;
      if (tab.subSections) {
        tab.subSections.forEach((sub) => {
          payload[sub.key] = sub.enabled;
        });
        payload.section_order = tab.subSections.map((sub) => sub.key);
      }
    });
    if (layout) {
      payload.public_layout = layout;
    }
    return payload;
  };

  const handleLayoutChange = async (layoutId) => {
    setSavingLayout(true);
    setPublicLayout(layoutId);
    const settingsPayload = buildSettingsPayload(availableTabs, layoutId);
    await saveSettings(settingsPayload);
    setSavingLayout(false);
  };

  const toggleExpand = (tabName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  };

  const handleDragStart = (e, subIndex) => {
    setDraggedSubIndex(subIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, tabIndex, dropIndex) => {
    e.preventDefault();
    if (draggedSubIndex === null || draggedSubIndex === dropIndex) {
      setDraggedSubIndex(null);
      return;
    }

    const updatedTabs = [...availableTabs];
    const subSections = [...updatedTabs[tabIndex].subSections];
    const [draggedItem] = subSections.splice(draggedSubIndex, 1);
    subSections.splice(dropIndex, 0, draggedItem);
    updatedTabs[tabIndex].subSections = subSections;
    setAvailableTabs(updatedTabs);
    setDraggedSubIndex(null);

    const settingsPayload = buildSettingsPayload(updatedTabs);
    await saveSettings(settingsPayload);
  };

  const handleDragEnd = () => {
    setDraggedSubIndex(null);
  };

  const saveSettings = async (settings) => {
    try {
      await api.post("/users/settings/update/", { settings });
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
      return false;
    }
  };

  // Dark theme colors
  const theme = {
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accent: '#6366f1',
    border: '#334155',
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1.5rem' }}>
      <style>{`
        .settings-page .visibility-toggle,
        .settings-page .visibility-toggle span,
        .settings-page .visibility-toggle svg {
          color: black !important;
        }
        .section-name {
          color: #f8fafc !important;
        }
        .item-count {
          color: inherit !important;
        }
      `}</style>
      <div className="settings-page">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: theme.accent, borderRadius: '1rem' }}>
              <SettingsIcon style={{ width: '2rem', height: '2rem', color: '#ffffff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Page Visibility</h1>
              <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Control which pages are visible on your public profile</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: `1px solid ${theme.accent}40`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem' }}>
              <Eye style={{ width: '1.25rem', height: '1.25rem', color: theme.accent }} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: theme.textPrimary, marginBottom: '0.25rem' }}>Visibility Settings</h3>
              <p style={{ fontSize: '0.875rem', color: theme.textSecondary, margin: 0 }}>
                Hidden pages won't appear in navigation. Drag profile sections to reorder them.
              </p>
            </div>
          </div>
        </div>

        {/* Page List */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
            <div style={{ width: '3rem', height: '3rem', border: `4px solid ${theme.bgTertiary}`, borderTopColor: theme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {availableTabs.map((tab, index) => {
              const Icon = pageIcons[tab.name];
              const isEnabled = tab.enabled === true;
              const hasSubSections = tab.subSections && tab.subSections.length > 0;
              const isExpanded = expandedSections[tab.name];

              return (
                <div
                  key={tab.name}
                  style={{
                    backgroundColor: theme.bgSecondary,
                    borderRadius: '0.75rem',
                    border: `1px solid ${theme.border}`,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        backgroundColor: isEnabled ? 'rgba(16, 185, 129, 0.15)' : theme.bgTertiary
                      }}>
                        <Icon style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          color: isEnabled ? '#10b981' : theme.textSecondary
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '600', color: theme.textPrimary, fontSize: '1.1rem', margin: 0 }}>{tab.name}</h4>
                        <p style={{ fontSize: '0.875rem', color: theme.textSecondary, margin: 0 }}>{tab.path}</p>
                      </div>

                      {hasSubSections && (
                        <button
                          onClick={() => toggleExpand(tab.name)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      )}
                    </div>

                    <button
                      className="visibility-toggle"
                      onClick={() => handleToggleTab(index)}
                      disabled={savingIndex === index}
                      style={{
                        backgroundColor: isEnabled ? '#10b981' : theme.bgTertiary,
                        color: isEnabled ? '#000000' : theme.textSecondary,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {savingIndex === index ? (
                        <div style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid currentColor',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                      ) : isEnabled ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                      <span>{isEnabled ? "Visible" : "Hidden"}</span>
                    </button>
                  </div>

                  {hasSubSections && isExpanded && (
                    <div style={{
                      borderTop: `1px solid ${theme.border}`,
                      backgroundColor: theme.bgPrimary,
                      padding: '0.75rem 1rem'
                    }}>
                      <p style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Profile Sections (drag to reorder)
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tab.subSections.map((sub, subIndex) => {
                          const SubIcon = subSectionIcons[sub.name];
                          const subEnabled = sub.enabled === true;
                          return (
                            <div
                              key={sub.key}
                              draggable
                              onDragStart={(e) => handleDragStart(e, subIndex)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, index, subIndex)}
                              onDragEnd={handleDragEnd}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.625rem 0.75rem',
                                backgroundColor: draggedSubIndex === subIndex ? theme.bgTertiary : theme.bgSecondary,
                                borderRadius: '0.5rem',
                                border: `1px solid ${draggedSubIndex === subIndex ? theme.accent : theme.border}`,
                                cursor: 'grab',
                                opacity: draggedSubIndex === subIndex ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <GripVertical style={{
                                  width: '1rem',
                                  height: '1rem',
                                  color: theme.textSecondary,
                                  cursor: 'grab'
                                }} />
                                <SubIcon style={{
                                  width: '1.125rem',
                                  height: '1.125rem',
                                  color: subEnabled ? '#10b981' : theme.textSecondary
                                }} />
                                <span style={{ color: theme.textPrimary, fontSize: '0.9rem', fontWeight: '500' }}>{sub.name}</span>
                                {contentCounts[sub.key] !== undefined && (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '999px',
                                    backgroundColor: contentCounts[sub.key] > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: contentCounts[sub.key] > 0 ? '#10b981' : '#ef4444',
                                    fontWeight: '600',
                                  }}>
                                    {contentCounts[sub.key] > 0 ? `${contentCounts[sub.key]} items` : 'Empty'}
                                  </span>
                                )}
                              </div>
                              <button
                                className="visibility-toggle"
                                onClick={() => handleToggleSubSection(index, subIndex)}
                                disabled={savingIndex === `${index}-${subIndex}`}
                                style={{
                                  backgroundColor: subEnabled ? '#10b981' : theme.bgTertiary,
                                  color: subEnabled ? '#000000' : theme.textSecondary,
                                  padding: '0.375rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.375rem',
                                  fontWeight: '500',
                                  fontSize: '0.8rem',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {savingIndex === `${index}-${subIndex}` ? (
                                  <div style={{
                                    width: '14px',
                                    height: '14px',
                                    border: '2px solid currentColor',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                  }} />
                                ) : subEnabled ? (
                                  <Eye size={14} />
                                ) : (
                                  <EyeOff size={14} />
                                )}
                                <span>{subEnabled ? "Show" : "Hide"}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Public Layout Selection */}
        {!loading && !error && (
          <>
            <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: theme.accent, borderRadius: '1rem' }}>
                  <Layout style={{ width: '2rem', height: '2rem', color: '#ffffff' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Portfolio Layout</h2>
                  <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Choose how visitors experience your public profile</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {layoutOptions.map((layout) => {
                const LayoutIcon = layout.icon;
                const isSelected = publicLayout === layout.id;
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutChange(layout.id)}
                    disabled={savingLayout}
                    style={{
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.15)' : theme.bgSecondary,
                      border: `2px solid ${isSelected ? theme.accent : theme.border}`,
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: theme.accent,
                        borderRadius: '50%',
                        padding: '0.25rem',
                      }}>
                        <Check size={14} style={{ color: '#fff' }} />
                      </div>
                    )}
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.2)' : theme.bgTertiary,
                      borderRadius: '0.75rem',
                      width: 'fit-content',
                      marginBottom: '0.75rem',
                    }}>
                      <LayoutIcon style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color: isSelected ? theme.accent : theme.textSecondary
                      }} />
                    </div>
                    <h4 style={{
                      fontWeight: '600',
                      color: theme.textPrimary,
                      margin: '0 0 0.25rem 0',
                      fontSize: '1rem',
                    }}>
                      {layout.name}
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: theme.textSecondary,
                      margin: 0,
                    }}>
                      {layout.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {publicLayout !== 'default' && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '0.5rem',
                border: `1px solid ${theme.accent}40`,
              }}>
                <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>
                  <strong style={{ color: theme.textPrimary }}>Preview URL:</strong>{' '}
                  <code style={{ backgroundColor: theme.bgTertiary, padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    /{publicLayout}
                  </code>
                  {' '}or{' '}
                  <code style={{ backgroundColor: theme.bgTertiary, padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    /public/{publicLayout}/username
                  </code>
                </p>
              </div>
            )}

            {/* Template Style Selection */}
            <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#8b5cf6', borderRadius: '1rem' }}>
                  <Palette style={{ width: '2rem', height: '2rem', color: '#ffffff' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Template Style</h2>
                  <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Change the visual design of your portfolio sections</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.bgSecondary,
              borderRadius: '0.75rem',
              border: `1px solid ${theme.border}`,
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '600', color: theme.textPrimary, margin: '0 0 0.5rem 0' }}>
                    Choose Your Design Template
                  </h4>
                  <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>
                    Select from beautiful pre-designed templates for your profile, education, career, and skills sections.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard/onboarding/select-template')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Palette size={18} />
                  Change Template
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Custom Domain Settings */}
        <div style={{ marginTop: '2rem' }}>
          <CustomDomainSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
