import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Home, User, GraduationCap, Briefcase, Wrench, Package, Trophy, Quote, Mail } from 'lucide-react';
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
            twitter: res.data?.twitter_link || res.data?.twitterLink,
            instagram: res.data?.instagram_link || res.data?.instagramLink,
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
          Let's Connect
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Thank you for viewing my portfolio. Feel free to reach out!
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
          {profile.twitter && (
            <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
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
 * DefaultProfileLayout - Simple scrolling layout with modern design
 * Sections stack vertically with smooth scrolling navigation
 */
const DefaultProfileLayout = () => {
  const { username: urlUsername } = useParams();
  const subdomainUser = getSubdomainUsername();
  // Also check cached custom domain username (resolved in App.js)
  const cachedCustomDomainUser = getUsernameSyncOnly();
  const username = urlUsername || subdomainUser || cachedCustomDomainUser;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (username) {
          const res = await api.get(`/public/settings/${username}/`);
          setSettings(res.data?.settings || {});

          // Try to get accent color from template
          const templateRes = await api.get(`/public/template/${username}/`).catch(() => null);
          if (templateRes?.data?.config?.global?.accentColor) {
            setAccentColor(templateRes.data.config.global.accentColor);
          }
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

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = visibleSections.map(s => document.getElementById(`section-${s.key}`));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(visibleSections[i].key);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

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
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
        {/* Sticky Navigation */}
        <nav style={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '0.25rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {visibleSections.map((section) => {
            const Icon = SECTION_ICONS[section.key] || User;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => {
                  document.getElementById(`section-${section.key}`)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: isActive ? accentColor : 'transparent',
                  cursor: 'pointer',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                }}
                title={section.label}
              >
                <Icon size={14} />
                <span className="hidden md:inline">{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sections */}
        <div style={{ paddingTop: '4rem' }}>
          {visibleSections.map((section, index) => (
            <section
              key={section.key}
              id={`section-${section.key}`}
              style={{
                minHeight: index === 0 ? '100vh' : 'auto',
                backgroundColor: index % 2 === 0 ? '#0f172a' : '#1e293b',
              }}
            >
              <SectionRenderer sectionKey={section.key} />
            </section>
          ))}

          {/* Footer */}
          <FooterSection username={username} accentColor={accentColor} />
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

export default DefaultProfileLayout;
