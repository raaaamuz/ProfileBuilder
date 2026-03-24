import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, User, GraduationCap, Briefcase, Wrench, Package, Trophy, Quote, Mail, Info } from 'lucide-react';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';
import { PublicTemplateProvider } from '../../../context/PublicTemplateContext';

// Import public-aware section components
import HomeSection from '../Home/Home';
import PublicProfileByStyle from '../Profile/PublicProfileByStyle';
import PublicEducationByStyle from '../Education/PublicEducationByStyle';
import PublicCareerByStyle from '../Career/PublicCareerByStyle';
import PublicSkillsByStyle from '../Profile/PublicSkillsByStyle';
import ServicesSection from '../Services/ServicesSection';
import PublicAwardsByStyle from '../Profile/PublicAwardsByStyle';
import TestimonialsSection from '../Testimonials/TestimonialsSection';
import Contact from '../contact';

const SECTION_ICONS = {
  home: Home,
  profile: User,
  education: GraduationCap,
  career: Briefcase,
  skills: Wrench,
  services: Package,
  awards: Trophy,
  testimonials: Quote,
  contact: Mail,
  footer: Info,
};

// Component renderer - renders inside PublicTemplateProvider context
const SectionRenderer = ({ sectionKey, username, accentColor }) => {
  console.log('SectionRenderer:', { sectionKey, username });
  switch (sectionKey) {
    case 'home': return <HomeSection />;
    case 'profile': return <PublicProfileByStyle />;
    case 'education': return <PublicEducationByStyle />;
    case 'career': return <PublicCareerByStyle />;
    case 'skills': return <PublicSkillsByStyle />;
    case 'services': return <ServicesSection />;
    case 'awards': return <PublicAwardsByStyle />;
    case 'testimonials': return <TestimonialsSection />;
    case 'contact': return <Contact />;
    case 'footer': return <FooterSection username={username} accentColor={accentColor} />;
    default: return null;
  }
};

// Footer Section Component
const FooterSection = ({ username, accentColor }) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (username) {
      api.get(`/public/profile/${username}/`)
        .then(res => {
          setProfile({
            name: res.data?.homeContent?.title || res.data?.userProfile?.full_name || username,
            email: res.data?.userProfile?.email || res.data?.email,
            phone: res.data?.userProfile?.phone || res.data?.phone,
            linkedin: res.data?.linkedinLink || res.data?.linkedin_link,
            twitter: res.data?.twitterLink || res.data?.twitter_link,
            facebook: res.data?.facebookLink || res.data?.facebook_link,
            github: res.data?.githubLink || res.data?.github_link,
            instagram: res.data?.instagramLink || res.data?.instagram_link,
          });
        })
        .catch(err => console.error('Error fetching profile for footer:', err));
    }
  }, [username]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      paddingBottom: '5rem',
      color: '#fff',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Let's Connect
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Thank you for viewing my portfolio. Feel free to reach out!
        </p>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {profile.email && (
            <a href={`mailto:${profile.email}`} style={{ color: accentColor, textDecoration: 'none', fontSize: '1.1rem' }}>
              {profile.email}
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
              {profile.phone}
            </a>
          )}
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{
              width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              transition: 'background-color 0.2s',
            }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{
              width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          )}
          {profile.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={{
              width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{
              width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * HorizontalScrollLayout - Sections scroll horizontally like a slideshow
 * Features left/right navigation and keyboard support
 */
const HorizontalScrollLayout = () => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUser || cachedCustomDomainUser;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [accentColor] = useState('#6366f1');
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (username) {
          const res = await api.get(`/public/settings/${username}/`);
          setSettings(res.data?.settings || {});
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [username]);

  const allSections = [
    { key: 'home', label: 'Home', settingKey: 'show_home' },
    { key: 'profile', label: 'About', settingKey: 'show_profile' },
    { key: 'education', label: 'Education', settingKey: 'show_education' },
    { key: 'career', label: 'Career', settingKey: 'show_career' },
    { key: 'skills', label: 'Skills', settingKey: 'show_skills' },
    { key: 'services', label: 'Services', settingKey: 'show_services' },
    { key: 'awards', label: 'Awards', settingKey: 'show_awards' },
    { key: 'testimonials', label: 'Testimonials', settingKey: 'show_testimonials' },
    { key: 'contact', label: 'Contact', settingKey: 'show_contact' },
    { key: 'footer', label: 'Connect', settingKey: null },
  ];

  const visibleSections = allSections.filter(section => {
    if (section.settingKey === null) return true; // Always show footer
    if (!settings) return true;
    return settings[section.settingKey] !== false;
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activeIndex < visibleSections.length - 1) {
        setActiveIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, visibleSections.length]);

  const goNext = () => {
    if (activeIndex < visibleSections.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: accentColor,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <PublicTemplateProvider>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          backgroundColor: '#0f172a',
        }}
      >
        {/* Horizontal Sections Container */}
        <motion.div
          animate={{ x: `-${activeIndex * (100 / visibleSections.length)}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            display: 'flex',
            height: '100vh',
            width: `${visibleSections.length * 100}%`,
          }}
        >
          {visibleSections.map((section, index) => (
            <div
              key={section.key}
              style={{
                width: `${100 / visibleSections.length}%`,
                height: '100%',
                overflow: 'auto',
                flexShrink: 0,
              }}
            >
              <SectionRenderer sectionKey={section.key} username={username} accentColor={accentColor} />
            </div>
          ))}
        </motion.div>

        {/* Top Navigation Bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4rem',
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.95), transparent)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0 2rem',
        }}>
          {visibleSections.map((section, index) => {
            const Icon = SECTION_ICONS[section.key] || User;
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={section.key}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: isActive ? accentColor : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                <Icon size={16} />
                <span style={{ display: isActive ? 'inline' : 'none' }}>{section.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Left Arrow */}
        <motion.button
          onClick={goPrev}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'fixed',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: activeIndex > 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
            backdropFilter: 'blur(8px)',
            cursor: activeIndex > 0 ? 'pointer' : 'default',
            opacity: activeIndex > 0 ? 1 : 0.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} style={{ color: '#fff' }} />
        </motion.button>

        {/* Right Arrow */}
        <motion.button
          onClick={goNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={activeIndex < visibleSections.length - 1 ? { x: [0, 5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            position: 'fixed',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: activeIndex < visibleSections.length - 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
            backdropFilter: 'blur(8px)',
            cursor: activeIndex < visibleSections.length - 1 ? 'pointer' : 'default',
            opacity: activeIndex < visibleSections.length - 1 ? 1 : 0.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={24} style={{ color: '#fff' }} />
        </motion.button>

        {/* Bottom Progress Dots */}
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '0.5rem',
        }}>
          {visibleSections.map((section, index) => (
            <motion.button
              key={section.key}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              style={{
                width: index === activeIndex ? '2rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: index === activeIndex ? accentColor : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Section Counter */}
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.875rem',
        }}>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.25rem' }}>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span> / {String(visibleSections.length).padStart(2, '0')}</span>
        </div>

        {/* Persistent Footer Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3rem',
          background: 'linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.8))',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          zIndex: 99,
          padding: '0 2rem',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} All rights reserved
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <a
            href="https://profile2connect.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: accentColor, fontSize: '0.75rem', textDecoration: 'none' }}
          >
            Powered by Profile2Connect
          </a>
        </div>
      </div>
    </PublicTemplateProvider>
  );
};

export default HorizontalScrollLayout;
