import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Home, User, GraduationCap, Briefcase, Wrench, Package, Trophy, Quote, Mail, Info } from 'lucide-react';

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

const VerticalSliderLayout = ({ children, sections = [], accentColor = '#6366f1' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartScrollTop = useRef(0);

  // Filter out empty/null children
  const validSections = sections.filter(s => s.component);

  // Check if section content can scroll and if at boundaries
  const canScrollUp = () => {
    if (!sectionRef.current) return false;
    return sectionRef.current.scrollTop > 5;
  };

  const canScrollDown = () => {
    if (!sectionRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = sectionRef.current;
    return scrollTop < scrollHeight - clientHeight - 5;
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      // Check if we should allow internal scrolling
      if (e.deltaY > 0 && canScrollDown()) {
        // Scrolling down but content has more to show - allow normal scroll
        return;
      }
      if (e.deltaY < 0 && canScrollUp()) {
        // Scrolling up but content has more above - allow normal scroll
        return;
      }

      // At boundary - trigger section navigation
      e.preventDefault();

      if (e.deltaY > 50 && activeIndex < validSections.length - 1) {
        setIsScrolling(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 800);
      } else if (e.deltaY < -50 && activeIndex > 0) {
        setIsScrolling(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    const handleKeyDown = (e) => {
      if (isScrolling) return;

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && activeIndex < validSections.length - 1) {
        if (canScrollDown()) return; // Allow normal scroll
        setIsScrolling(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 800);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && activeIndex > 0) {
        if (canScrollUp()) return; // Allow normal scroll
        setIsScrolling(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartScrollTop.current = sectionRef.current?.scrollTop || 0;
    };

    const handleTouchEnd = (e) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      const currentScrollTop = sectionRef.current?.scrollTop || 0;

      // If the scroll position changed significantly, user was scrolling content
      if (Math.abs(currentScrollTop - touchStartScrollTop.current) > 20) {
        return; // Internal scroll happened, don't navigate
      }

      // Check boundaries before navigating
      if (diff > 50 && activeIndex < validSections.length - 1 && !canScrollDown()) {
        setIsScrolling(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 800);
      } else if (diff < -50 && activeIndex > 0 && !canScrollUp()) {
        setIsScrolling(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, isScrolling, validSections.length]);

  const goToSection = (index) => {
    if (isScrolling || index === activeIndex) return;
    setIsScrolling(true);
    setActiveIndex(index);
    setTimeout(() => setIsScrolling(false), 800);
  };

  return (
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
      {/* Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          ref={sectionRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => {
            // Reset scroll position when entering a new section
            if (sectionRef.current) {
              sectionRef.current.scrollTop = 0;
            }
          }}
          style={{
            width: '100%',
            height: '100vh',
            overflow: 'auto',
            paddingBottom: '4rem', // Space for footer bar
          }}
        >
          {validSections[activeIndex]?.component}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div
        style={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 100,
        }}
      >
        {validSections.map((section, index) => {
          const Icon = SECTION_ICONS[section.key] || User;
          const isActive = index === activeIndex;
          return (
            <motion.button
              key={section.key}
              onClick={() => goToSection(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: isActive ? '3rem' : '2.5rem',
                height: isActive ? '3rem' : '2.5rem',
                borderRadius: '50%',
                border: `2px solid ${isActive ? accentColor : 'rgba(255,255,255,0.3)'}`,
                backgroundColor: isActive ? accentColor : 'rgba(15, 23, 42, 0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
              }}
              title={section.label}
            >
              <Icon
                size={isActive ? 18 : 14}
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Section Label */}
      <motion.div
        key={`label-${activeIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'fixed',
          right: '5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 99,
        }}
      >
        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}>
          {validSections[activeIndex]?.label}
        </span>
      </motion.div>

      {/* Up/Down Arrows */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 100,
        }}
      >
        <motion.button
          onClick={() => activeIndex > 0 && goToSection(activeIndex - 1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: activeIndex > 0 ? 'rgba(255,255,255,0.1)' : 'transparent',
            cursor: activeIndex > 0 ? 'pointer' : 'default',
            opacity: activeIndex > 0 ? 1 : 0.3,
          }}
        >
          <ChevronUp size={24} style={{ color: '#fff' }} />
        </motion.button>

        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.75rem',
        }}>
          {activeIndex + 1} / {validSections.length}
        </span>

        <motion.button
          onClick={() => activeIndex < validSections.length - 1 && goToSection(activeIndex + 1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: activeIndex < validSections.length - 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
            cursor: activeIndex < validSections.length - 1 ? 'pointer' : 'default',
            opacity: activeIndex < validSections.length - 1 ? 1 : 0.3,
          }}
        >
          <ChevronDown size={24} style={{ color: '#fff' }} />
        </motion.button>
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

      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          bottom: '3rem',
          height: '3px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          width: '100%',
          zIndex: 100,
        }}
      >
        <motion.div
          animate={{ width: `${((activeIndex + 1) / validSections.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            backgroundColor: accentColor,
          }}
        />
      </div>
    </div>
  );
};

export default VerticalSliderLayout;
