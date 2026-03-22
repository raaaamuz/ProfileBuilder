import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Award, Star, Medal, Target, Crown, Gem,
  Building2, Zap, TrendingUp
} from 'lucide-react';
import api from '../../../services/api';
import { PreviewContext } from '../../admin/PreviewContext';
import { getSubdomainUsername } from '../../../utils/subdomain';

// Render different layouts based on layoutType
const RenderLayout = ({ items, layoutType, activeDesign, activeTab, designBgColor, designTextColor, designAccentColor, getColorScheme, getIcon }) => {
  const cardBorderRadius = activeDesign?.borderRadius || 24;
  const cardBackground = activeDesign?.cardBg || 'rgba(20, 15, 35, 0.9)';
  const cardBorder = activeDesign?.cardBorder || '1px solid rgba(255,255,255,0.1)';
  const cardShadow = activeDesign?.cardShadow || 'none';

  // GRID LAYOUT - 2 column masonry style
  if (layoutType === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {items.map((item, index) => {
          const colorScheme = getColorScheme(index, activeTab);
          const IconComponent = getIcon(index, activeTab);
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: cardBackground,
                borderRadius: `${cardBorderRadius}px`,
                padding: '1.5rem',
                boxShadow: cardShadow,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <IconComponent style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                {item.year && (
                  <span style={{ marginLeft: 'auto', padding: '4px 12px', background: `${colorScheme.primary}20`, color: colorScheme.primary, borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {item.year}
                  </span>
                )}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: designTextColor, marginBottom: '0.5rem' }}>{item.title}</h4>
              {item.organization && <p style={{ color: colorScheme.primary, fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>{item.organization}</p>}
              {item.description && <p style={{ color: `${designTextColor}99`, fontSize: '0.85rem', lineHeight: 1.6 }}>{item.description}</p>}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // LIST LAYOUT - Clean minimal list
  if (layoutType === 'list') {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {items.map((item, index) => {
          const colorScheme = getColorScheme(index, activeTab);
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.25rem 0',
                borderBottom: index < items.length - 1 ? `1px solid ${designAccentColor}20` : 'none'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colorScheme.primary, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: designTextColor, marginBottom: '2px' }}>{item.title}</h4>
                {item.organization && <span style={{ color: `${designTextColor}70`, fontSize: '0.85rem' }}>{item.organization}</span>}
              </div>
              {item.year && <span style={{ color: colorScheme.primary, fontSize: '0.9rem', fontWeight: '600' }}>{item.year}</span>}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // TIMELINE LAYOUT - Vertical timeline
  if (layoutType === 'timeline') {
    return (
      <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', paddingLeft: '3rem' }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '2px', background: `linear-gradient(180deg, ${designAccentColor}, ${designAccentColor}40)` }} />
        {items.map((item, index) => {
          const colorScheme = getColorScheme(index, activeTab);
          const IconComponent = getIcon(index, activeTab);
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              style={{ position: 'relative', marginBottom: '2rem' }}
            >
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: '-3rem', top: '0.5rem',
                width: '24px', height: '24px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${colorScheme.primary}50`
              }}>
                <IconComponent style={{ width: '12px', height: '12px', color: 'white' }} />
              </div>
              <div style={{ background: cardBackground, borderRadius: '12px', padding: '1.25rem', borderLeft: `3px solid ${colorScheme.primary}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: designTextColor }}>{item.title}</h4>
                  {item.year && <span style={{ padding: '4px 10px', background: colorScheme.primary, color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{item.year}</span>}
                </div>
                {item.organization && <p style={{ color: colorScheme.primary, fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>{item.organization}</p>}
                {item.description && <p style={{ color: `${designTextColor}70`, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.description}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // STACKED LAYOUT - Overlapping cards
  if (layoutType === 'stacked') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {items.map((item, index) => {
          const colorScheme = getColorScheme(index, activeTab);
          const IconComponent = getIcon(index, activeTab);
          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 8, boxShadow: `12px 12px 0 ${designTextColor}` }}
              style={{
                background: cardBackground,
                border: cardBorder,
                boxShadow: cardShadow,
                borderRadius: 0,
                padding: '1.5rem',
                marginBottom: '-0.5rem',
                marginLeft: `${index * 12}px`,
                position: 'relative',
                zIndex: items.length - index,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ width: '50px', height: '50px', background: colorScheme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: designTextColor, textTransform: 'uppercase' }}>{item.title}</h4>
                    {item.year && <span style={{ fontWeight: '900', fontSize: '1.2rem', color: colorScheme.primary }}>{item.year}</span>}
                  </div>
                  {item.organization && <p style={{ color: `${designTextColor}80`, fontSize: '0.9rem', fontWeight: '500', marginTop: '4px' }}>{item.organization}</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // CARDS LAYOUT (default) - Horizontal cards with icon
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      {items.map((item, index) => {
        const colorScheme = getColorScheme(index, activeTab);
        const IconComponent = getIcon(index, activeTab);
        return (
          <motion.article
            key={item.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, boxShadow: `0 20px 40px ${colorScheme.glow}` }}
            style={{
              background: cardBackground,
              backdropFilter: 'blur(20px)',
              border: cardBorder,
              borderRadius: `${cardBorderRadius}px`,
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: '64px', height: '64px',
                background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`,
                borderRadius: `${Math.min(cardBorderRadius, 18)}px`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 24px ${colorScheme.glow}`
              }}>
                <IconComponent style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: designTextColor, lineHeight: 1.3, margin: 0 }}>{item.title}</h4>
                  {item.year && (
                    <span style={{ flexShrink: 0, padding: '6px 14px', background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary})`, color: 'white', fontSize: '0.8rem', fontWeight: '700', borderRadius: '20px' }}>
                      {item.year}
                    </span>
                  )}
                </div>
                {item.organization && (
                  <p style={{ color: colorScheme.primary, fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 style={{ width: '16px', height: '16px' }} />
                    {item.organization}
                  </p>
                )}
                {item.description && <p style={{ color: `${designTextColor}88`, fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>{item.description}</p>}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: '2rem', right: '2rem', height: '3px', background: `linear-gradient(90deg, ${colorScheme.primary}, ${colorScheme.secondary}, transparent)`, borderRadius: '3px 3px 0 0', opacity: 0.6 }} />
          </motion.article>
        );
      })}
    </div>
  );
};

const AwardsSection = ({ isAdminPreview = false, liveDesignConfig = null, globalFont }) => {
  const { liveAwardsDesign } = useContext(PreviewContext);

  // Use prop design if provided, otherwise use context design
  const activeDesign = liveDesignConfig || liveAwardsDesign;
  const { username: urlUsername } = useParams();
  const subdomainUsername = getSubdomainUsername();
  const username = urlUsername || subdomainUsername;
  const [awards, setAwards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('awards');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (username) {
          const response = await api.get(`/public/profile/${username}/`);
          setAwards(response.data.awards || []);
          setAchievements(response.data.achievements || []);
        } else if (token) {
          const [awardsRes, achievementsRes] = await Promise.all([
            api.get('/achievements/awards/', { headers: { Authorization: `Token ${token}` } }),
            api.get('/achievements/achievements/', { headers: { Authorization: `Token ${token}` } })
          ]);
          setAwards(Array.isArray(awardsRes.data) ? awardsRes.data : awardsRes.data.results || []);
          setAchievements(Array.isArray(achievementsRes.data) ? achievementsRes.data : achievementsRes.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching awards/achievements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (!loading && awards.length === 0 && achievements.length === 0) {
    return null;
  }

  // Get design colors for loading state
  const loadingBgColor = activeDesign?.backgroundColor || '#0c0a1d';
  const loadingAccentColor = activeDesign?.accentColor || '#fbbf24';

  // Loading state with elegant skeleton
  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(180deg, ${loadingBgColor} 0%, ${loadingBgColor}ee 100%)`
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: `3px solid ${loadingAccentColor}1a`,
            borderTopColor: loadingAccentColor,
          }}
        />
      </div>
    );
  }

  const currentItems = activeTab === 'awards' ? awards : achievements;

  // Icon mapping for variety
  const awardIcons = [Crown, Trophy, Medal, Gem, Award];
  const achievementIcons = [Star, Target, Award, Zap, TrendingUp];
  const getIcon = (index, type) => {
    const icons = type === 'awards' ? awardIcons : achievementIcons;
    return icons[index % icons.length];
  };

  // Get design colors from activeDesign or use defaults
  const designBgColor = activeDesign?.backgroundColor || '#0c0a1d';
  const designTextColor = activeDesign?.textColor || '#ffffff';
  const designAccentColor = activeDesign?.accentColor || '#fbbf24';
  const designSecondaryColor = activeDesign?.secondaryColor || '#a78bfa';

  // Color schemes for visual variety
  const colorSchemes = {
    awards: [
      { primary: designAccentColor, secondary: activeDesign?.secondaryAccent || '#f59e0b', glow: `${designAccentColor}4d` },
      { primary: '#f97316', secondary: '#ea580c', glow: 'rgba(249, 115, 22, 0.3)' },
      { primary: '#ef4444', secondary: '#dc2626', glow: 'rgba(239, 68, 68, 0.3)' },
      { primary: '#eab308', secondary: '#ca8a04', glow: 'rgba(234, 179, 8, 0.3)' },
    ],
    achievements: [
      { primary: designSecondaryColor, secondary: activeDesign?.secondaryAccent || '#8b5cf6', glow: `${designSecondaryColor}4d` },
      { primary: '#60a5fa', secondary: '#3b82f6', glow: 'rgba(96, 165, 250, 0.3)' },
      { primary: '#34d399', secondary: '#10b981', glow: 'rgba(52, 211, 153, 0.3)' },
      { primary: '#22d3ee', secondary: '#06b6d4', glow: 'rgba(34, 211, 238, 0.3)' },
    ]
  };

  const getColorScheme = (index, type) => {
    const schemes = colorSchemes[type];
    return schemes[index % schemes.length];
  };

  // Get design style
  const cardStyle = activeDesign?.cardStyle || 'glassmorphism';
  const layoutType = activeDesign?.layoutType || 'cards';
  const borderRadius = activeDesign?.borderRadius || 20;

  // Render different header styles based on design - icon always first, then title
  const renderHeader = () => {
    const conceptId = activeDesign?.conceptId || cardStyle;

    // MINIMAL HEADER - Clean with Award icon
    if (conceptId === 'minimal-lines' || conceptId === 'bordered' || layoutType === 'list') {
      return (
        <motion.header
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: `1px solid ${designAccentColor}30`, paddingBottom: '1.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', background: `${designAccentColor}15`, borderRadius: '16px', marginBottom: '1rem' }}>
            <Award style={{ width: '32px', height: '32px', color: designAccentColor }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: designTextColor, margin: 0 }}>
            Awards & Achievements
          </h2>
        </motion.header>
      );
    }

    // BRUTALIST HEADER - Bold with Medal icon
    if (conceptId === 'brutalist' || layoutType === 'stacked') {
      return (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: designAccentColor,
            padding: '1rem 2rem',
            marginBottom: '1rem'
          }}>
            <Medal style={{ width: '32px', height: '32px', color: designTextColor === '#ffffff' ? '#000' : '#fff' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            color: designTextColor,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>
            AWARDS
          </h2>
          <div style={{ width: '100px', height: '6px', background: designAccentColor, margin: '1rem auto 0' }} />
        </motion.header>
      );
    }

    // NEON HEADER - Glowing with Zap icon
    if (conceptId === 'neon-glow' || conceptId === 'neon' || cardStyle === 'neon') {
      return (
        <motion.header
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.div
            animate={{ boxShadow: [`0 0 20px ${designAccentColor}60`, `0 0 40px ${designAccentColor}80`, `0 0 20px ${designAccentColor}60`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              border: `2px solid ${designAccentColor}`,
              borderRadius: '50%',
              marginBottom: '1.5rem',
              background: `${designAccentColor}15`
            }}
          >
            <Zap style={{ width: '36px', height: '36px', color: designAccentColor }} />
          </motion.div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '700',
            color: designAccentColor,
            margin: 0,
            textShadow: `0 0 30px ${designAccentColor}80, 0 0 60px ${designAccentColor}40`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Recognition
          </h2>
          <p style={{ color: `${designTextColor}60`, fontSize: '0.9rem', marginTop: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Celebrating professional excellence
          </p>
        </motion.header>
      );
    }

    // GRADIENT/AURORA HEADER - With Crown icon
    if (conceptId === 'gradient-mesh' || conceptId === 'gradient' || cardStyle === 'gradient') {
      return (
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90px',
            height: '90px',
            background: `linear-gradient(135deg, ${designAccentColor}30 0%, ${designSecondaryColor}30 100%)`,
            borderRadius: '24px',
            marginBottom: '1.5rem',
            border: `1px solid ${designAccentColor}30`
          }}>
            <Crown style={{ width: '42px', height: '42px', color: designAccentColor }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: '800',
            background: `linear-gradient(135deg, ${designAccentColor} 0%, ${designSecondaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Recognition <span style={{ color: designAccentColor }}>&</span> Milestones
          </h2>
          <p style={{ color: `${designTextColor}70`, fontSize: '1rem', marginTop: '0.75rem', fontStyle: 'italic' }}>
            A showcase of professional achievements
          </p>
        </motion.header>
      );
    }

    // NEUMORPHISM HEADER - With Star icon
    if (conceptId === 'neumorphism') {
      const isLight = designBgColor === '#e0e5ec' || designBgColor.startsWith('#e') || designBgColor.startsWith('#f');
      return (
        <motion.header
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '30px',
            background: designBgColor,
            boxShadow: isLight
              ? '12px 12px 24px #c8ccd4, -12px -12px 24px #ffffff'
              : '12px 12px 24px #0a0a0f, -12px -12px 24px #1a1a2e',
            marginBottom: '1.5rem'
          }}>
            <Star style={{ width: '40px', height: '40px', color: designAccentColor }} />
          </div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: designTextColor,
            margin: 0
          }}>
            Awards & Achievements
          </h2>
        </motion.header>
      );
    }

    // DEFAULT GLASSMORPHISM HEADER - Modern glass effect
    return (
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            background: `linear-gradient(135deg, ${designAccentColor} 0%, ${activeDesign?.secondaryAccent || designSecondaryColor} 100%)`,
            borderRadius: `${Math.min(borderRadius, 20)}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 16px 40px ${designAccentColor}50`
          }}>
            <Trophy style={{ width: '36px', height: '36px', color: 'white' }} />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: designTextColor,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}
        >
          Recognition <span style={{ color: designAccentColor }}>&</span> Milestones
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ color: `${designTextColor}80`, fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}
        >
          A showcase of professional achievements
        </motion.p>
      </motion.header>
    );
  };

  // Background based on design style
  const renderBackground = () => {
    if (cardStyle === 'brutalist' || cardStyle === 'bordered') {
      return null; // No fancy background for minimal/brutalist
    }

    if (cardStyle === 'neumorphism') {
      return null; // Neumorphism has solid bg
    }

    // Default animated background
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '20%',
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, ${designAccentColor}30 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(60px)'
          }}
        />
        {cardStyle === 'neon' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${designAccentColor}05 1px, transparent 1px), linear-gradient(90deg, ${designAccentColor}05 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        )}
      </div>
    );
  };

  return (
    <section style={{
      padding: '4rem 0',
      paddingTop: '5rem',
      background: designBgColor,
      position: 'relative',
      overflow: 'visible',
      minHeight: 'auto',
      fontFamily: activeDesign?.fontFamily || 'inherit'
    }}>
      {renderBackground()}

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        {renderHeader()}

        {/* Tab Navigation - Style based on design */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: cardStyle === 'brutalist' ? 'flex-start' : 'center',
            marginBottom: '3rem'
          }}
        >
          {cardStyle === 'brutalist' ? (
            // Brutalist tabs - simple underlined
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[
                { id: 'awards', label: 'AWARDS', count: awards.length },
                { id: 'achievements', label: 'ACHIEVEMENTS', count: achievements.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 0',
                    fontSize: '1rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    color: activeTab === tab.id ? designAccentColor : designTextColor,
                    borderBottom: activeTab === tab.id ? `4px solid ${designAccentColor}` : '4px solid transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          ) : cardStyle === 'neon' ? (
            // Neon tabs - glowing borders
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { id: 'awards', label: 'Awards', count: awards.length, icon: Trophy },
                { id: 'achievements', label: 'Achievements', count: achievements.length, icon: Star }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: activeTab === tab.id ? `${designAccentColor}20` : 'transparent',
                    border: `2px solid ${activeTab === tab.id ? designAccentColor : `${designAccentColor}40`}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: activeTab === tab.id ? designAccentColor : `${designTextColor}80`,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: activeTab === tab.id ? `0 0 20px ${designAccentColor}50` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <tab.icon style={{ width: '16px', height: '16px' }} />
                  {tab.label}
                  <span style={{
                    padding: '2px 8px',
                    background: activeTab === tab.id ? designAccentColor : `${designAccentColor}30`,
                    color: activeTab === tab.id ? designBgColor : designAccentColor,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>
          ) : cardStyle === 'neumorphism' ? (
            // Neumorphism tabs
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '8px',
              background: designBgColor,
              borderRadius: '16px',
              boxShadow: `inset 4px 4px 8px ${designBgColor === '#e0e5ec' ? '#c8ccd4' : '#0a0a0f'}, inset -4px -4px 8px ${designBgColor === '#e0e5ec' ? '#ffffff' : '#1a1a2e'}`
            }}>
              {[
                { id: 'awards', label: 'Awards', count: awards.length, icon: Trophy },
                { id: 'achievements', label: 'Achievements', count: achievements.length, icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: designBgColor,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: activeTab === tab.id ? designAccentColor : designTextColor,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: activeTab === tab.id
                      ? `inset 2px 2px 4px ${designBgColor === '#e0e5ec' ? '#c8ccd4' : '#0a0a0f'}, inset -2px -2px 4px ${designBgColor === '#e0e5ec' ? '#ffffff' : '#1a1a2e'}`
                      : `4px 4px 8px ${designBgColor === '#e0e5ec' ? '#c8ccd4' : '#0a0a0f'}, -4px -4px 8px ${designBgColor === '#e0e5ec' ? '#ffffff' : '#1a1a2e'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <tab.icon style={{ width: '16px', height: '16px' }} />
                  {tab.label}
                  <span style={{
                    padding: '2px 8px',
                    background: `${designAccentColor}20`,
                    color: designAccentColor,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            // Default glassmorphism tabs
            <div style={{
              display: 'inline-flex',
              padding: '6px',
              background: `${designBgColor}cc`,
              backdropFilter: 'blur(20px)',
              borderRadius: `${Math.min(borderRadius, 20)}px`,
              border: `1px solid ${designAccentColor}20`,
              gap: '4px'
            }}>
              {[
                { id: 'awards', label: 'Awards', count: awards.length, icon: Trophy },
                { id: 'achievements', label: 'Achievements', count: achievements.length, icon: Star }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    borderRadius: `${Math.min(borderRadius - 4, 16)}px`,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: activeTab === tab.id
                      ? `linear-gradient(135deg, ${designAccentColor}, ${designSecondaryColor})`
                      : 'transparent',
                    color: activeTab === tab.id ? 'white' : `${designTextColor}80`,
                    boxShadow: activeTab === tab.id ? `0 8px 24px ${designAccentColor}40` : 'none'
                  }}
                >
                  <tab.icon style={{ width: '16px', height: '16px' }} />
                  <span>{tab.label}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : `${designAccentColor}20`,
                    color: activeTab === tab.id ? 'white' : designAccentColor
                  }}>
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </motion.nav>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentItems.length > 0 && (
              <RenderLayout
                items={currentItems}
                layoutType={activeDesign?.layoutType || 'cards'}
                activeDesign={activeDesign}
                activeTab={activeTab}
                designBgColor={designBgColor}
                designTextColor={designTextColor}
                designAccentColor={designAccentColor}
                getColorScheme={getColorScheme}
                getIcon={getIcon}
              />
            )}

            {/* Empty State */}
            {currentItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  color: 'rgba(255,255,255,0.4)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  background: 'rgba(20, 15, 35, 0.9)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTab === 'awards'
                    ? <Trophy style={{ width: '36px', height: '36px' }} />
                    : <Star style={{ width: '36px', height: '36px' }} />
                  }
                </div>
                <p style={{ fontSize: '1.1rem' }}>
                  No {activeTab} to display yet
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Summary Stats - Minimal Footer */}
        {(awards.length > 0 || achievements.length > 0) && (
          <motion.footer
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '5rem',
              paddingTop: '3rem',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {[
              { value: awards.length, label: 'Awards', color: '#fbbf24' },
              { value: achievements.length, label: 'Achievements', color: '#a78bfa' },
              { value: awards.length + achievements.length, label: 'Total Recognition', color: '#34d399' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.footer>
        )}
      </div>
    </section>
  );
};

export default AwardsSection;
