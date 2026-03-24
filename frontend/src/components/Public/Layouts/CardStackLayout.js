import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ChevronDown, Home, User, GraduationCap, Briefcase, Wrench, Package, Trophy, Quote, Mail } from 'lucide-react';
import api from '../../../services/api';
import { getSubdomainUsername, getUsernameSyncOnly } from '../../../utils/subdomain';
import { PublicTemplateProvider } from '../../../context/PublicTemplateContext';

// Import public-aware sections
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
};

// Component renderer - renders inside PublicTemplateProvider context
const SectionRenderer = ({ sectionKey }) => {
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
    default: return null;
  }
};

// Footer Component
const FooterSection = ({ username, accentColor }) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (username) {
      api.get(`/public/profile/${username}/`)
        .then(res => {
          setProfile({
            name: res.data?.homeContent?.title || res.data?.userProfile?.full_name || username,
            email: res.data?.userProfile?.email || res.data?.email,
            linkedin: res.data?.linkedin_link || res.data?.linkedinLink,
            github: res.data?.github_link || res.data?.githubLink,
          });
        })
        .catch(err => console.error('Error fetching profile:', err));
    }
  }, [username]);

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#fff',
      padding: '4rem 2rem',
      paddingBottom: '5rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Thank you for visiting
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Feel free to connect with me on social media or reach out via email.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

/**
 * CardStackLayout - Sections appear as stacked cards that reveal on scroll
 * Each card has a 3D perspective effect and stacks behind the current one
 */
const CardStackLayout = () => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUser || cachedCustomDomainUser;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
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
  ];

  const visibleSections = allSections.filter(section => {
    if (!settings) return true;
    return settings[section.settingKey] !== false;
  });

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
          backgroundColor: '#0f172a',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {/* Sticky Navigation */}
        <nav style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {visibleSections.map((section, index) => {
            const Icon = SECTION_ICONS[section.key] || User;
            return (
              <motion.button
                key={section.key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById(`section-${section.key}`)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                style={{
                  padding: '0.625rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.7)',
                }}
                title={section.label}
              >
                <Icon size={18} />
              </motion.button>
            );
          })}
        </nav>

        {/* Sections as Cards */}
        <div style={{ paddingTop: '4rem' }}>
          {visibleSections.map((section, index) => (
            <motion.section
              key={section.key}
              id={`section-${section.key}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                minHeight: index === 0 ? '100vh' : 'auto',
                position: 'relative',
                backgroundColor: index % 2 === 0 ? '#0f172a' : '#1e293b',
                borderRadius: index === 0 ? 0 : '2rem 2rem 0 0',
                marginTop: index === 0 ? 0 : '-2rem',
                zIndex: index + 1,
                boxShadow: index > 0 ? '0 -10px 40px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {/* Section Label */}
              {index > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  {React.createElement(SECTION_ICONS[section.key] || User, {
                    size: 20,
                    style: { color: accentColor }
                  })}
                  <span style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: '600',
                  }}>
                    {section.label}
                  </span>
                </div>
              )}

              <div style={{ paddingTop: index > 0 ? '3rem' : 0 }}>
                <SectionRenderer sectionKey={section.key} />
              </div>
            </motion.section>
          ))}

          {/* Footer */}
          <FooterSection username={username} accentColor={accentColor} />
        </div>

        {/* Scroll Indicator (only on first section) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Scroll
            </span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>

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

export default CardStackLayout;
