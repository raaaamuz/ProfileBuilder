import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Code, Palette, Database, Cloud, Settings, Sparkles, Brain, Cpu, X, BookOpen, Award, Briefcase, GraduationCap } from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../../admin/PreviewContext';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Category config
const categoryConfig = {
  'programming': { icon: Code, color: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600' },
  'tools': { icon: Settings, color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
  'design': { icon: Palette, color: 'from-pink-500 to-rose-600', light: 'bg-pink-50', text: 'text-pink-600' },
  'database': { icon: Database, color: 'from-amber-500 to-orange-600', light: 'bg-amber-50', text: 'text-amber-600' },
  'cloud': { icon: Cloud, color: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-600' },
  'soft_skills': { icon: Brain, color: 'from-purple-500 to-violet-600', light: 'bg-purple-50', text: 'text-purple-600' },
  'other': { icon: Cpu, color: 'from-slate-500 to-gray-600', light: 'bg-slate-50', text: 'text-slate-600' },
};

const SkillsSection = ({ isAdminPreview = false }) => {
  const { liveProfileDesign, liveSkillsData, liveSkillsDesign } = useContext(PreviewContext);
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [designConfig, setDesignConfig] = useState(null);

  // Force admin preview detection from both prop and URL
  const isInAdminPreview = isAdminPreview || window.location.pathname.includes('/dashboard/');

  useEffect(() => {
    if (isInAdminPreview && liveSkillsData && liveSkillsData.length > 0) {
      setSkills(liveSkillsData);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          console.log("Skills from API:", response.data.skills);
          setSkills(response.data.skills || []);
          // Get design config from public profile response
          if (response.data.skills_design_config) {
            setDesignConfig(response.data.skills_design_config);
          }
        } else if (token) {
          // Fix: correct endpoint is /career/skill/ not /career/skills/
          const response = await api.get('/career/skill/', {
            headers: { Authorization: `Token ${token}` }
          });
          console.log("Skills from API:", response.data);
          setSkills(Array.isArray(response.data) ? response.data : response.data.results || []);
          // Fetch design separately for authenticated user
          try {
            const designRes = await api.get('/career/skills-design/', {
              headers: { Authorization: `Token ${token}` }
            });
            if (designRes.data?.design_config) {
              setDesignConfig(designRes.data.design_config);
            }
          } catch (e) {
            console.log("No skills design saved");
          }
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, isInAdminPreview, liveSkillsData]);

  // Use live design from admin preview context if available
  const activeDesign = isInAdminPreview && liveSkillsDesign ? liveSkillsDesign : designConfig;

  if (!loading && skills.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get proficiency level label
  const getProficiencyLabel = (value) => {
    if (value >= 90) return 'Expert';
    if (value >= 75) return 'Advanced';
    if (value >= 50) return 'Intermediate';
    if (value >= 25) return 'Beginner';
    return 'Learning';
  };

  // Get color based on proficiency - using hex values to avoid Tailwind purging issues
  const getProficiencyColors = (value) => {
    if (value >= 80) return { from: '#10b981', to: '#16a34a' }; // emerald-500 to green-600
    if (value >= 60) return { from: '#3b82f6', to: '#4f46e5' }; // blue-500 to indigo-600
    if (value >= 40) return { from: '#f59e0b', to: '#ea580c' }; // amber-500 to orange-600
    return { from: '#f43f5e', to: '#dc2626' }; // rose-500 to red-600
  };

  // Determine if using dark theme based on design
  const isDarkTheme = activeDesign?.backgroundColor &&
    (activeDesign.backgroundColor.startsWith('#0') ||
     activeDesign.backgroundColor.startsWith('#1') ||
     activeDesign.backgroundColor.startsWith('#2'));

  const bgColor = activeDesign?.backgroundColor || '#ffffff';
  const textColor = activeDesign?.textColor || '#1f2937';
  const accentColor = activeDesign?.accentColor || '#6366f1';
  // Normalize layoutType - handle legacy 'cards-grid' value
  const rawLayoutType = activeDesign?.layoutType || 'cards';
  const layoutType = rawLayoutType === 'cards-grid' ? 'cards' : rawLayoutType;
  const cardStyle = activeDesign?.cardStyle || 'elevated';

  // Helper to get skill proficiency normalized
  const getSkillProficiency = (skill) => {
    const rawProficiency = Number(skill.proficiency);
    if (!isNaN(rawProficiency) && rawProficiency > 0) {
      return rawProficiency <= 5 ? rawProficiency * 20 : Math.min(100, rawProficiency);
    }
    return 50;
  };

  // ===== CARDS LAYOUT =====
  const renderCardsLayout = () => (
    <div className={`grid gap-6 ${isInAdminPreview ? 'grid-cols-1 sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {skills.map((skill, index) => {
        const catKey = skill.category?.toLowerCase() || 'other';
        const config = categoryConfig[catKey] || categoryConfig.other;
        const IconComponent = config.icon;
        const proficiency = getSkillProficiency(skill);
        const profColors = getProficiencyColors(proficiency);
        const hasNotes = skill.description && skill.description.trim().length > 0;
        const isGlass = cardStyle === 'glass';

        return (
          <motion.div
            key={skill.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
              isGlass
                ? 'bg-white/10 backdrop-blur-md border border-white/20'
                : 'bg-white border border-gray-100'
            }`}
          >
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${config.color} opacity-5 rounded-full group-hover:opacity-10 transition-opacity`} />

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${isGlass ? 'bg-white/20' : config.light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-6 h-6 ${isGlass ? 'text-white' : config.text}`} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${isGlass ? 'text-white' : 'text-gray-900'}`}>{skill.name}</h4>
                  {skill.category && (
                    <span className={`text-xs font-medium capitalize ${isGlass ? 'text-white/70' : config.text}`}>
                      {skill.category.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>

              {hasNotes && (
                <button
                  onClick={() => setSelectedSkill(skill)}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    flexShrink: 0,
                  }}
                  title="Read skill story"
                >
                  <BookOpen style={{ width: '20px', height: '20px' }} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isGlass ? 'text-white/60' : 'text-gray-500'}`}>{getProficiencyLabel(proficiency)}</span>
                <span
                  className="text-2xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${profColors.from}, ${profColors.to})` }}
                >
                  {proficiency}%
                </span>
              </div>

              <div className={`relative h-3 rounded-full overflow-hidden ${isGlass ? 'bg-white/20' : 'bg-gray-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(to right, ${profColors.from}, ${profColors.to})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              </div>

              {skill.years_experience && (
                <p className={`text-xs pt-1 ${isGlass ? 'text-white/50' : 'text-gray-400'}`}>
                  <span className={`font-semibold ${isGlass ? 'text-white/80' : 'text-gray-600'}`}>{skill.years_experience}</span> years of experience
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // ===== BADGES LAYOUT =====
  const renderBadgesLayout = () => (
    <div className="flex flex-wrap justify-center gap-4">
      {skills.map((skill, index) => {
        const catKey = skill.category?.toLowerCase() || 'other';
        const config = categoryConfig[catKey] || categoryConfig.other;
        const proficiency = getSkillProficiency(skill);
        const hasNotes = skill.description && skill.description.trim().length > 0;

        // Circular progress calculation
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (proficiency / 100) * circumference;

        return (
          <motion.div
            key={skill.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => hasNotes && setSelectedSkill(skill)}
            className={`relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
              hasNotes ? 'cursor-pointer' : ''
            } ${isDarkTheme ? 'bg-white/10 hover:bg-white/15' : 'bg-white shadow-md hover:shadow-lg'}`}
            style={{ minWidth: '120px' }}
          >
            {/* Circular Progress */}
            <div className="relative w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={accentColor}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold" style={{ color: accentColor }}>{proficiency}%</span>
              </div>
            </div>

            <h4 className={`font-semibold text-sm text-center ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              {skill.name}
            </h4>
            <span className={`text-xs capitalize ${isDarkTheme ? 'text-white/50' : 'text-gray-400'}`}>
              {skill.category?.replace('_', ' ') || 'Skill'}
            </span>

            {hasNotes && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                <BookOpen className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  // ===== LIST LAYOUT =====
  const renderListLayout = () => (
    <div className={isInAdminPreview ? 'w-full space-y-4' : 'max-w-3xl mx-auto space-y-4'}>
      {skills.map((skill, index) => {
        const catKey = skill.category?.toLowerCase() || 'other';
        const config = categoryConfig[catKey] || categoryConfig.other;
        const IconComponent = config.icon;
        const proficiency = getSkillProficiency(skill);
        const hasNotes = skill.description && skill.description.trim().length > 0;

        return (
          <motion.div
            key={skill.id || index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
              isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`w-10 h-10 ${isDarkTheme ? 'bg-white/10' : config.light} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 ${isDarkTheme ? 'text-white' : config.text}`} />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold truncate ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                  {skill.name}
                </h4>
                <span className="text-sm font-bold ml-2" style={{ color: accentColor }}>
                  {proficiency}%
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkTheme ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>

            {hasNotes && (
              <button
                onClick={() => setSelectedSkill(skill)}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: accentColor }}
              >
                <BookOpen className="w-4 h-4 text-white" />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  // ===== GROUPED LAYOUT =====
  const renderGroupedLayout = () => {
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const cat = skill.category?.toLowerCase() || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
          const config = categoryConfig[category] || categoryConfig.other;
          const IconComponent = config.icon;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-6 ${isDarkTheme ? 'bg-white/5 border border-white/10' : 'bg-white shadow-lg border border-gray-100'}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                <div className={`w-10 h-10 ${isDarkTheme ? 'bg-white/10' : config.light} rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${isDarkTheme ? 'text-white' : config.text}`} />
                </div>
                <h3 className={`text-xl font-bold capitalize ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                  {category.replace('_', ' ')}
                </h3>
                <span className={`ml-auto text-sm px-3 py-1 rounded-full ${isDarkTheme ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600'}`}>
                  {categorySkills.length} skills
                </span>
              </div>

              {/* Skills in category */}
              <div className="grid sm:grid-cols-2 gap-4">
                {categorySkills.map((skill, index) => {
                  const proficiency = getSkillProficiency(skill);
                  const hasNotes = skill.description && skill.description.trim().length > 0;

                  return (
                    <motion.div
                      key={skill.id || index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-700'}`}>{skill.name}</span>
                          <span className="text-sm font-bold" style={{ color: accentColor }}>{proficiency}%</span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${isDarkTheme ? 'bg-white/10' : 'bg-gray-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: accentColor }}
                          />
                        </div>
                      </div>
                      {hasNotes && (
                        <button
                          onClick={() => setSelectedSkill(skill)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          style={{ backgroundColor: accentColor }}
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // ===== CIRCULAR LAYOUT =====
  const renderCircularLayout = () => (
    <div className={`grid gap-6 justify-items-center ${isInAdminPreview ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
      {skills.map((skill, index) => {
        const catKey = skill.category?.toLowerCase() || 'other';
        const config = categoryConfig[catKey] || categoryConfig.other;
        const proficiency = getSkillProficiency(skill);
        const hasNotes = skill.description && skill.description.trim().length > 0;

        // Large circular progress
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (proficiency / 100) * circumference;

        return (
          <motion.div
            key={skill.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => hasNotes && setSelectedSkill(skill)}
            className={`relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 ${
              hasNotes ? 'cursor-pointer' : ''
            } ${isDarkTheme ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-lg hover:shadow-xl'}`}
          >
            {/* Large Circular Progress */}
            <div className="relative w-28 h-28 mb-4">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={accentColor}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: accentColor }}>{proficiency}%</span>
                <span className={`text-xs ${isDarkTheme ? 'text-white/50' : 'text-gray-400'}`}>
                  {getProficiencyLabel(proficiency)}
                </span>
              </div>
            </div>

            <h4 className={`font-bold text-center ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              {skill.name}
            </h4>
            <span className={`text-xs capitalize mt-1 ${isDarkTheme ? 'text-white/50' : 'text-gray-400'}`}>
              {skill.category?.replace('_', ' ') || 'Skill'}
            </span>

            {hasNotes && (
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  // Select layout renderer based on layoutType
  const renderSkillsLayout = () => {
    switch (layoutType) {
      case 'badges':
        return renderBadgesLayout();
      case 'list':
        return renderListLayout();
      case 'grouped':
        return renderGroupedLayout();
      case 'circular':
        return renderCircularLayout();
      case 'cards':
      default:
        return renderCardsLayout();
    }
  };

  return (
    <div
      className="py-16 transition-colors duration-300 w-full"
      style={{ backgroundColor: bgColor, minWidth: '100%', boxSizing: 'border-box' }}
    >
      <div className={isInAdminPreview ? 'w-full px-4' : 'max-w-6xl mx-auto px-6'}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-6"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: textColor }}>
            Skills & <span style={{ color: accentColor }}>Expertise</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: isDarkTheme ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
            Technologies and tools I work with to build amazing products
          </p>
        </motion.div>

        {/* Render selected layout */}
        {renderSkillsLayout()}

        {/* Category Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            const hasSkillsInCategory = skills.some(s => (s.category?.toLowerCase() || 'other') === key);
            if (!hasSkillsInCategory) return null;

            return (
              <div
                key={key}
                className={`flex items-center gap-2 px-4 py-2 ${config.light} rounded-full`}
              >
                <Icon className={`w-4 h-4 ${config.text}`} />
                <span className={`text-sm font-medium ${config.text} capitalize`}>
                  {key.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Skill Story Modal - rendered via portal to body */}
      {selectedSkill && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setSelectedSkill(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Modal Header */}
              <div className="px-4 py-3 text-white relative" style={{ background: 'linear-gradient(to right, #fbbf24, #f97316)' }}>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedSkill.name}</h3>
                    <p className="text-white/80 text-xs capitalize">{selectedSkill.category?.replace('_', ' ') || 'Skill'}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {/* Proficiency */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">Proficiency Level</span>
                    <span className="text-xl font-bold text-emerald-600">{selectedSkill.proficiency || 50}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedSkill.proficiency || 50}%`,
                        background: 'linear-gradient(to right, #34d399, #22c55e)'
                      }}
                    />
                  </div>
                </div>

                {/* Story/Notes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    My Journey with {selectedSkill.name}
                  </h4>
                  {selectedSkill.description && selectedSkill.description.trim() ? (
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {selectedSkill.description}
                    </p>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No story added yet for this skill.</p>
                    </div>
                  )}
                </div>

                {/* Experience */}
                {selectedSkill.years_experience && (
                  <div className="mt-6 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-700">
                      <strong>{selectedSkill.years_experience}</strong> years of hands-on experience
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="w-full py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SkillsSection;
