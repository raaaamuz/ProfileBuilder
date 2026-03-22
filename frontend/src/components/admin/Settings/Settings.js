import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  LayoutGrid,
  Palette,
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
} from "lucide-react";
import api from "../../../services/api";
import ThemeSelector from "./ThemeSelector";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("pages");
  const [expandedSections, setExpandedSections] = useState({});

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
    Awards: Trophy,
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
        { name: "Awards", key: "show_awards", enabled: true },
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/users/settings/");
        console.log("Fetched settings:", response.data);
        if (response.data && response.data.settings) {
          const settings = response.data.settings;
          const updatedTabs = availableTabs.map((tab) => {
            if (tab.subSections) {
              let orderedSubSections = tab.subSections.map((sub) => ({
                ...sub,
                enabled: settings[sub.key] !== false,
              }));
              // Apply saved order if exists
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
          console.log("Updated tabs from settings:", updatedTabs);
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
    const success = await saveSettings(settingsPayload);
    if (success) {
      console.log("Settings saved successfully:", settingsPayload);
    }
    setTimeout(() => setSavingIndex(null), 500);
  };

  const handleToggleSubSection = async (tabIndex, subIndex) => {
    setSavingIndex(`${tabIndex}-${subIndex}`);
    const updatedTabs = [...availableTabs];
    updatedTabs[tabIndex].subSections[subIndex].enabled = !updatedTabs[tabIndex].subSections[subIndex].enabled;
    setAvailableTabs(updatedTabs);

    const settingsPayload = buildSettingsPayload(updatedTabs);
    const success = await saveSettings(settingsPayload);
    if (success) {
      console.log("Settings saved successfully:", settingsPayload);
    }
    setTimeout(() => setSavingIndex(null), 500);
  };

  const buildSettingsPayload = (tabs) => {
    const payload = {};
    tabs.forEach((tab) => {
      payload[tab.key] = tab.enabled;
      if (tab.subSections) {
        tab.subSections.forEach((sub) => {
          payload[sub.key] = sub.enabled;
        });
        // Save section order
        payload.section_order = tab.subSections.map((sub) => sub.key);
      }
    });
    return payload;
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

  const handleDragOver = (e, subIndex) => {
    e.preventDefault();
    if (draggedSubIndex === null || draggedSubIndex === subIndex) return;
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

    // Save the new order
    const settingsPayload = buildSettingsPayload(updatedTabs);
    await saveSettings(settingsPayload);
  };

  const handleDragEnd = () => {
    setDraggedSubIndex(null);
  };

  const saveSettings = async (settings) => {
    try {
      const response = await api.post("/users/settings/update/", { settings });
      console.log("Save settings response:", response.data);
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      // Revert the change on error
      setError("Failed to save settings. Please try again.");
      return false;
    }
  };

  const tabs = [
    { id: "pages", label: "Page Visibility", icon: LayoutGrid },
    { id: "theme", label: "Theme & Appearance", icon: Palette },
  ];

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
      {/* Override admin-editor-theme styles */}
      <style>{`
        .settings-page h1, .settings-page h2, .settings-page h3, .settings-page h4, .settings-page p, .settings-page span {
          color: inherit !important;
        }
        .settings-page button:not(.visibility-toggle) {
          color: inherit !important;
        }
        .settings-page .visibility-toggle,
        .settings-page .visibility-toggle span,
        .settings-page .visibility-toggle svg {
          color: black !important;
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Settings</h1>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Customize your website appearance and visibility</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: theme.bgTertiary, padding: '0.375rem', borderRadius: '0.75rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                flex: 1,
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? theme.bgSecondary : 'transparent',
                color: activeTab === tab.id ? theme.textPrimary : theme.textSecondary,
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "pages" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Info Card */}
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: `1px solid ${theme.accent}40`, borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '0.5rem' }}>
                <Eye style={{ width: '1.25rem', height: '1.25rem', color: theme.accent }} />
              </div>
              <div>
                <h3 style={{ fontWeight: '600', color: theme.textPrimary, marginBottom: '0.25rem' }}>Page Visibility</h3>
                <p style={{ fontSize: '0.875rem', color: theme.textSecondary, margin: 0 }}>
                  Control which pages are visible to visitors on your public profile.
                  Hidden pages won't appear in navigation.
                </p>
              </div>
            </div>
          </div>

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

                        {/* Expand button for sections with sub-options */}
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
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        )}
                      </div>

                      {/* Toggle Button */}
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

                    {/* Sub-sections */}
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
                                onDragOver={(e) => handleDragOver(e, subIndex)}
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
        </div>
      )}

      {activeTab === "theme" && <ThemeSelector />}
      </div>
    </div>
  );
};

export default Settings;
