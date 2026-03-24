import React from "react";
import { Check, Sparkles, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

// Sample dummy data for resume previews
export const sampleResumeData = {
  name: "John Anderson",
  title: "Senior Software Engineer",
  email: "john.anderson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/johnanderson",
  website: "johnanderson.dev",
  summary: "Results-driven software engineer with 8+ years of experience building scalable web applications. Passionate about clean code, system design, and mentoring junior developers. Led teams that delivered products serving 2M+ users.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp Inc.",
      period: "2021 - Present",
      description: "Led development of microservices architecture, reducing deployment time by 60%. Mentored 5 junior developers and established coding standards across the organization."
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      period: "2018 - 2021",
      description: "Built real-time data pipeline processing 10M+ events daily. Implemented CI/CD workflows and improved test coverage from 45% to 92%."
    }
  ],
  education: [
    {
      degree: "M.S. Computer Science",
      school: "Stanford University",
      year: "2018"
    },
    {
      degree: "B.S. Computer Science",
      school: "UC Berkeley",
      year: "2016"
    }
  ],
  skills: ["React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL", "TypeScript"],
  awards: [
    { title: "Innovation Award", org: "Tech Corp", year: "2023" },
    { title: "Best Team Lead", org: "StartupXYZ", year: "2020" }
  ],
  achievements: [
    "Reduced system latency by 40% through optimization",
    "Grew user base from 500K to 2M in 18 months"
  ]
};

// Sample Resume Preview Component - shows full template with dummy data
export const SampleResumePreview = ({ templateId }) => {
  const template = resumeTemplates.find(t => t.id === templateId);
  if (!template) return null;

  const { colors, layout } = template;
  const data = sampleResumeData;

  // Common styles based on template
  const getTemplateStyles = () => {
    switch (templateId) {
      case 'professional':
      case 'corporate':
      case 'classic':
        return {
          headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          headerText: '#ffffff',
          sidebarBg: colors.bg,
          mainBg: '#ffffff',
          headingColor: colors.primary,
          accentColor: colors.secondary,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
      case 'modern':
      case 'elegant':
        return {
          headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          headerText: '#ffffff',
          sidebarBg: colors.bg,
          mainBg: '#ffffff',
          headingColor: colors.secondary,
          accentColor: colors.accent,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
      case 'executive':
      case 'midnight':
      case 'tech':
        return {
          headerBg: colors.primary,
          headerText: colors.accent,
          sidebarBg: colors.bg,
          mainBg: colors.bg,
          headingColor: colors.accent,
          accentColor: colors.secondary,
          textColor: '#e5e7eb',
          subtextColor: '#9ca3af'
        };
      case 'minimal':
      case 'swiss':
      case 'nordic':
      case 'paper':
      case 'mono':
        return {
          headerBg: '#ffffff',
          headerText: colors.primary,
          sidebarBg: '#f9fafb',
          mainBg: '#ffffff',
          headingColor: colors.primary,
          accentColor: colors.secondary,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
      case 'creative':
      case 'nature':
        return {
          headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          headerText: '#ffffff',
          sidebarBg: colors.bg,
          mainBg: '#ffffff',
          headingColor: colors.primary,
          accentColor: colors.secondary,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
      case 'bold':
      case 'sunset':
        return {
          headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          headerText: '#ffffff',
          sidebarBg: colors.bg,
          mainBg: '#ffffff',
          headingColor: colors.primary,
          accentColor: colors.secondary,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
      case 'developer-pro':
        return {
          headerBg: 'transparent',
          headerText: '#ffffff',
          sidebarBg: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
          mainBg: '#ffffff',
          headingColor: colors.accent,
          accentColor: colors.accent,
          textColor: '#374151',
          subtextColor: '#6b7280',
          sidebarText: '#f8fafc',
          sidebarSubtext: '#94a3b8',
          skillBarBg: '#334155',
          skillBarFill: `linear-gradient(90deg, ${colors.accent}, #8b5cf6)`
        };
      default:
        return {
          headerBg: colors.primary,
          headerText: '#ffffff',
          sidebarBg: colors.bg,
          mainBg: '#ffffff',
          headingColor: colors.primary,
          accentColor: colors.secondary,
          textColor: '#374151',
          subtextColor: '#6b7280'
        };
    }
  };

  const styles = getTemplateStyles();
  const isDarkTheme = ['executive', 'midnight', 'tech'].includes(templateId);
  const hasDarkSidebar = ['developer-pro'].includes(templateId);

  // Render Single Column Layout
  const renderSingleColumnLayout = () => (
    <div className="p-4" style={{ backgroundColor: styles.mainBg }}>
      {/* Summary */}
      <div className="mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
          style={{ color: styles.headingColor, borderColor: styles.accentColor }}
        >
          Professional Summary
        </h3>
        <p className="text-[11px] leading-relaxed" style={{ color: styles.textColor }}>
          {data.summary}
        </p>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
          style={{ color: styles.headingColor, borderColor: styles.accentColor }}
        >
          Work Experience
        </h3>
        <div className="space-y-2">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: isDarkTheme ? '#e5e7eb' : '#374151' }}>
                    {exp.title}
                  </p>
                  <p className="text-[10px]" style={{ color: styles.accentColor }}>
                    {exp.company}
                  </p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded" style={{
                  backgroundColor: isDarkTheme ? styles.accentColor + '20' : '#f3f4f6',
                  color: styles.subtextColor
                }}>
                  {exp.period}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: styles.textColor }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills - inline for single column */}
      <div className="mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
          style={{ color: styles.headingColor, borderColor: styles.accentColor }}
        >
          Skills
        </h3>
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[10px] font-medium"
              style={{
                backgroundColor: isDarkTheme ? styles.accentColor + '20' : styles.accentColor + '15',
                color: isDarkTheme ? styles.accentColor : styles.headingColor,
                border: `1px solid ${styles.accentColor}40`
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-4">
        <h3
          className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
          style={{ color: styles.headingColor, borderColor: styles.accentColor }}
        >
          Education
        </h3>
        <div className="space-y-2">
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between">
              <div>
                <p className="text-[11px] font-semibold" style={{ color: isDarkTheme ? '#e5e7eb' : '#374151' }}>
                  {edu.degree}
                </p>
                <p className="text-[10px]" style={{ color: styles.subtextColor }}>
                  {edu.school}
                </p>
              </div>
              <span className="text-[9px]" style={{ color: styles.subtextColor }}>{edu.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Academic Layout
  const renderAcademicLayout = () => (
    <div className="p-4" style={{ backgroundColor: '#ffffff' }}>
      {/* Academic style: Name centered with line underneath */}
      <div className="text-center mb-4 pb-2" style={{ borderBottom: `2px solid ${colors.primary}` }}>
        <h1 className="text-lg font-serif font-bold" style={{ color: colors.primary }}>{data.name}</h1>
        <p className="text-[11px] italic" style={{ color: styles.subtextColor }}>{data.title}</p>
      </div>

      {/* Contact in single line */}
      <div className="flex justify-center flex-wrap gap-3 text-[9px] mb-4 pb-2 border-b border-gray-200">
        <span>{data.email}</span>
        <span>|</span>
        <span>{data.phone}</span>
        <span>|</span>
        <span>{data.location}</span>
      </div>

      {/* Education first for academic */}
      <div className="mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.primary }}>
          Education
        </h3>
        <div className="space-y-1 pl-2 border-l-2" style={{ borderColor: colors.secondary }}>
          {data.education.map((edu, i) => (
            <div key={i}>
              <p className="text-[10px] font-semibold">{edu.degree}</p>
              <p className="text-[9px] text-gray-600">{edu.school}, {edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.primary }}>
          Professional Experience
        </h3>
        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: colors.secondary }}>
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <p className="text-[10px] font-semibold">{exp.title}</p>
                <span className="text-[9px] text-gray-500">{exp.period}</span>
              </div>
              <p className="text-[9px] italic text-gray-600">{exp.company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.primary }}>
          Technical Skills
        </h3>
        <p className="text-[9px] text-gray-700">{data.skills.join(' • ')}</p>
      </div>
    </div>
  );

  // Render Header-Focused Layout
  const renderHeaderFocusedLayout = () => (
    <div style={{ backgroundColor: styles.mainBg }}>
      {/* Large prominent header */}
      <div
        className="px-4 py-6 text-center"
        style={{ background: styles.headerBg, color: styles.headerText }}
      >
        <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
        <p className="text-sm mb-2">{data.title}</p>
        <p className="text-[10px] opacity-80 max-w-md mx-auto leading-relaxed">{data.summary}</p>
        <div className="flex justify-center flex-wrap gap-3 mt-3 text-[9px] opacity-70">
          <span className="flex items-center gap-1"><Mail size={10} />{data.email}</span>
          <span className="flex items-center gap-1"><Phone size={10} />{data.phone}</span>
          <span className="flex items-center gap-1"><MapPin size={10} />{data.location}</span>
        </div>
      </div>

      {/* Compact content below */}
      <div className="p-3 grid grid-cols-2 gap-3">
        {/* Experience */}
        <div>
          <h3 className="text-[10px] font-bold uppercase mb-1" style={{ color: styles.headingColor }}>
            Experience
          </h3>
          <div className="space-y-1">
            {data.experience.slice(0, 2).map((exp, i) => (
              <div key={i}>
                <p className="text-[9px] font-semibold" style={{ color: styles.textColor }}>{exp.title}</p>
                <p className="text-[8px]" style={{ color: styles.subtextColor }}>{exp.company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills */}
        <div>
          <h3 className="text-[10px] font-bold uppercase mb-1" style={{ color: styles.headingColor }}>
            Education
          </h3>
          <div className="space-y-1 mb-2">
            {data.education.slice(0, 1).map((edu, i) => (
              <div key={i}>
                <p className="text-[9px] font-semibold" style={{ color: styles.textColor }}>{edu.degree}</p>
                <p className="text-[8px]" style={{ color: styles.subtextColor }}>{edu.school}</p>
              </div>
            ))}
          </div>
          <h3 className="text-[10px] font-bold uppercase mb-1" style={{ color: styles.headingColor }}>
            Skills
          </h3>
          <p className="text-[8px]" style={{ color: styles.textColor }}>{data.skills.slice(0, 4).join(', ')}</p>
        </div>
      </div>
    </div>
  );

  // Render Two Column Layout (default)
  const renderTwoColumnLayout = () => (
    <div className="flex">
      {/* Sidebar */}
      <div
        className="w-1/3 p-4 border-r"
        style={{
          backgroundColor: styles.sidebarBg,
          borderColor: isDarkTheme ? '#374151' : '#e5e7eb'
        }}
      >
        {/* Skills */}
        <div className="mb-5">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Skills
          </h3>
          <div className="flex flex-wrap gap-1">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: isDarkTheme ? styles.accentColor + '20' : styles.accentColor + '30',
                  color: isDarkTheme ? styles.accentColor : styles.headingColor
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-5">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Education
          </h3>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i}>
                <p className="text-[11px] font-semibold" style={{ color: isDarkTheme ? '#e5e7eb' : '#374151' }}>
                  {edu.degree}
                </p>
                <p className="text-[10px]" style={{ color: styles.subtextColor }}>
                  {edu.school} • {edu.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-2/3 p-4"
        style={{ backgroundColor: styles.mainBg }}
      >
        {/* Summary */}
        <div className="mb-5">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Professional Summary
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: styles.textColor }}>
            {data.summary}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-5">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Work Experience
          </h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: isDarkTheme ? '#e5e7eb' : '#374151' }}>
                      {exp.title}
                    </p>
                    <p className="text-[10px]" style={{ color: styles.accentColor }}>
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded" style={{
                    backgroundColor: isDarkTheme ? styles.accentColor + '20' : '#f3f4f6',
                    color: styles.subtextColor
                  }}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed" style={{ color: styles.textColor }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="mb-5">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Awards
          </h3>
          <div className="space-y-1">
            {data.awards.map((award, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px]">+</span>
                <div>
                  <p className="text-[10px] font-medium" style={{ color: isDarkTheme ? '#e5e7eb' : '#374151' }}>
                    {award.title}
                  </p>
                  <p className="text-[9px]" style={{ color: styles.subtextColor }}>
                    {award.org} - {award.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: styles.headingColor, borderColor: styles.accentColor }}
          >
            Achievements
          </h3>
          <ul className="space-y-1 ml-3">
            {data.achievements.map((achievement, i) => (
              <li key={i} className="text-[10px] list-disc" style={{ color: styles.textColor }}>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  // Render Sidebar Left Layout (dark sidebar with skill bars)
  const renderSidebarLeftLayout = () => (
    <div className="flex h-full">
      {/* Dark Sidebar */}
      <div
        className="w-1/3 p-4"
        style={{
          background: styles.sidebarBg,
          color: styles.sidebarText || '#f8fafc'
        }}
      >
        {/* Profile Photo Placeholder */}
        <div className="flex justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, #8b5cf6)` }}
          >
            {data.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-bold mb-0.5" style={{ color: '#f8fafc' }}>{data.name}</h2>
          <p className="text-[10px]" style={{ color: styles.sidebarSubtext || '#94a3b8' }}>{data.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <h3
            className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1"
            style={{ color: colors.accent, borderBottom: `1px solid ${colors.accent}40` }}
          >
            Contact
          </h3>
          <div className="space-y-1.5 text-[9px]" style={{ color: styles.sidebarSubtext || '#94a3b8' }}>
            <div className="flex items-center gap-2">
              <span style={{ color: colors.accent }}>@</span>
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: colors.accent }}>#</span>
              <span>{data.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: colors.accent }}>O</span>
              <span>{data.location}</span>
            </div>
          </div>
        </div>

        {/* Skills with Progress Bars */}
        <div className="mb-4">
          <h3
            className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1"
            style={{ color: colors.accent, borderBottom: `1px solid ${colors.accent}40` }}
          >
            Skills
          </h3>
          <div className="space-y-2">
            {data.skills.slice(0, 6).map((skill, i) => {
              const proficiency = 95 - (i * 5); // Simulate different proficiency levels
              return (
                <div key={i}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span style={{ color: '#f8fafc' }}>{skill}</span>
                    <span style={{ color: styles.sidebarSubtext || '#94a3b8' }}>{proficiency}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: styles.skillBarBg || '#334155' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${proficiency}%`,
                        background: styles.skillBarFill || `linear-gradient(90deg, ${colors.accent}, #8b5cf6)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3
            className="text-[10px] font-bold uppercase tracking-wider mb-2 pb-1"
            style={{ color: colors.accent, borderBottom: `1px solid ${colors.accent}40` }}
          >
            Education
          </h3>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i}>
                <p className="text-[10px] font-semibold" style={{ color: '#f8fafc' }}>{edu.degree}</p>
                <p className="text-[9px]" style={{ color: styles.sidebarSubtext || '#94a3b8' }}>{edu.school}</p>
                <p className="text-[8px]" style={{ color: styles.sidebarSubtext || '#64748b' }}>{edu.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-4" style={{ backgroundColor: '#ffffff' }}>
        {/* Summary */}
        <div className="mb-4">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: colors.accent, borderColor: colors.accent }}
          >
            Professional Summary
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: '#374151' }}>
            {data.summary}
          </p>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: colors.accent, borderColor: colors.accent }}
          >
            Work Experience
          </h3>
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-4" style={{ borderLeft: `2px solid ${colors.accent}` }}>
                <div
                  className="absolute w-2 h-2 rounded-full -left-[5px] top-1"
                  style={{ backgroundColor: colors.accent }}
                />
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: '#1e293b' }}>{exp.title}</p>
                    <p className="text-[10px]" style={{ color: colors.accent }}>{exp.company}</p>
                  </div>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed" style={{ color: '#64748b' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wide mb-2 pb-1 border-b"
            style={{ color: colors.accent, borderColor: colors.accent }}
          >
            Awards & Achievements
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {data.awards.map((award, i) => (
              <div
                key={i}
                className="p-2 rounded"
                style={{ backgroundColor: '#f8fafc', borderLeft: `3px solid ${colors.accent}` }}
              >
                <p className="text-[10px] font-semibold" style={{ color: '#1e293b' }}>{award.title}</p>
                <p className="text-[9px]" style={{ color: '#64748b' }}>{award.org} - {award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on layout type
  const renderLayoutContent = () => {
    switch (layout) {
      case 'single-column':
        return renderSingleColumnLayout();
      case 'academic':
        return renderAcademicLayout();
      case 'header-focused':
        return renderHeaderFocusedLayout();
      case 'sidebar-left':
        return renderSidebarLeftLayout();
      case 'two-column':
      default:
        return renderTwoColumnLayout();
    }
  };

  // Header is different for academic layout
  const renderHeader = () => {
    if (layout === 'academic') return null; // Academic has its own header in content
    if (layout === 'header-focused') return null; // Header-focused has its own header in content
    if (layout === 'sidebar-left') return null; // Sidebar-left has name in sidebar

    return (
      <div
        className="px-6 py-5"
        style={{ background: styles.headerBg, color: styles.headerText }}
      >
        <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
        <p className="text-sm opacity-90 mb-3">{data.title}</p>
        <div className="flex flex-wrap gap-4 text-xs opacity-80">
          <span className="flex items-center gap-1">
            <Mail size={12} />
            {data.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {data.phone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {data.location}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white overflow-hidden" style={{ maxHeight: '450px', overflowY: 'auto' }}>
      {/* Header */}
      {renderHeader()}

      {/* Layout Content */}
      {renderLayoutContent()}

      {/* Footer */}
      <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-gray-200 text-center sticky bottom-0">
        <p className="text-[10px] text-purple-600 font-medium">
          This is a sample preview. Click "Generate Resume" to create yours with your actual profile data.
        </p>
      </div>
    </div>
  );
};

// Resume template definitions with CSS themes and layouts
// layout: "two-column" | "single-column" | "header-focused" | "academic"
export const resumeTemplates = [
  {
    id: "professional",
    name: "Professional",
    tag: "classic",
    layout: "two-column",
    colors: { primary: "#1a365d", secondary: "#3182ce", accent: "#90cdf4", bg: "#f7fafc" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
        <div className="h-8 bg-gradient-to-r from-blue-900 to-blue-700"></div>
        <div className="flex h-24">
          <div className="w-1/3 bg-gray-100 p-1">
            <div className="h-2 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-1 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-2/3 p-1">
            <div className="h-2 bg-gray-300 rounded w-1/2 mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    tag: "trending",
    layout: "two-column",
    colors: { primary: "#5b21b6", secondary: "#7c3aed", accent: "#c4b5fd", bg: "#faf5ff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
        <div className="h-10 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-end px-2 pb-1">
          <div className="h-2 bg-white/80 rounded w-1/3"></div>
        </div>
        <div className="flex h-20">
          <div className="w-1/3 bg-purple-50 p-1">
            <div className="h-1 bg-purple-200 rounded w-full mb-1"></div>
            <div className="h-1 bg-purple-200 rounded w-2/3"></div>
          </div>
          <div className="w-2/3 p-1">
            <div className="h-1.5 bg-purple-400 rounded w-1/4 mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#1f2937", secondary: "#4b5563", accent: "#9ca3af", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-2">
        <div className="text-center mb-2">
          <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-1 bg-gray-300 rounded w-1/3 mx-auto"></div>
        </div>
        <div className="border-t border-gray-200 pt-1">
          <div className="h-1.5 bg-gray-400 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "ats-friendly",
    name: "ATS Friendly",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#000000", secondary: "#333333", accent: "#666666", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-2">
        <div className="border-b-2 border-black pb-1 mb-2">
          <div className="h-2.5 bg-black rounded w-2/3 mb-1"></div>
          <div className="h-1 bg-gray-400 rounded w-full"></div>
        </div>
        <div className="mb-2">
          <div className="h-1.5 bg-black rounded w-1/3 mb-1"></div>
          <div className="h-1 bg-gray-300 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-gray-300 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div>
          <div className="h-1.5 bg-black rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "academic",
    name: "Academic CV",
    tag: "single-column",
    layout: "academic",
    colors: { primary: "#1e3a5f", secondary: "#2563eb", accent: "#93c5fd", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-2">
        <div className="text-center border-b border-blue-900 pb-1 mb-2">
          <div className="h-2 bg-blue-900 rounded w-1/2 mx-auto mb-0.5"></div>
          <div className="h-1 bg-blue-300 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="space-y-1.5">
          <div>
            <div className="h-1.5 bg-blue-900 rounded w-1/3 mb-0.5"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-1.5 bg-blue-900 rounded w-1/4 mb-0.5"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-1.5 bg-blue-900 rounded w-1/3 mb-0.5"></div>
            <div className="h-1 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "executive",
    name: "Executive",
    tag: "premium",
    layout: "two-column",
    colors: { primary: "#111827", secondary: "#d97706", accent: "#fbbf24", bg: "#1f2937" },
    preview: (
      <div className="w-full h-full bg-gray-900 rounded overflow-hidden shadow-inner">
        <div className="h-10 border-b border-amber-500/50 flex items-center justify-center">
          <div className="h-2 bg-amber-400 rounded w-1/3"></div>
        </div>
        <div className="p-1">
          <div className="h-1 bg-gray-600 rounded w-full mb-1"></div>
          <div className="h-1 bg-gray-600 rounded w-full mb-1"></div>
          <div className="h-1.5 bg-amber-400/50 rounded w-1/4 mb-1 mt-2"></div>
          <div className="h-1 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative",
    tag: "colorful",
    layout: "two-column",
    colors: { primary: "#0d9488", secondary: "#14b8a6", accent: "#5eead4", bg: "#f0fdfa" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner flex">
        <div className="w-1/3 bg-gradient-to-b from-teal-500 to-cyan-600 p-1">
          <div className="h-6 w-6 bg-white/30 rounded-full mx-auto mb-1"></div>
          <div className="h-1 bg-white/60 rounded w-3/4 mx-auto mb-1"></div>
          <div className="h-1 bg-white/40 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="w-2/3 p-1">
          <div className="h-1.5 bg-teal-400 rounded w-1/3 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-1.5 bg-teal-400 rounded w-1/3 mb-1 mt-2"></div>
          <div className="h-1 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "tech",
    name: "Tech",
    tag: "developer",
    layout: "two-column",
    colors: { primary: "#0f172a", secondary: "#22c55e", accent: "#86efac", bg: "#020617" },
    preview: (
      <div className="w-full h-full bg-slate-900 rounded overflow-hidden shadow-inner p-1">
        <div className="flex items-center gap-1 mb-2">
          <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
          <div className="h-2 bg-slate-700 rounded flex-1 ml-1"></div>
        </div>
        <div className="h-1 bg-green-400 rounded w-1/4 mb-1"></div>
        <div className="h-1 bg-slate-600 rounded w-full mb-1"></div>
        <div className="h-1 bg-cyan-400/50 rounded w-3/4 mb-1"></div>
        <div className="flex gap-1 mt-2">
          <div className="h-3 bg-slate-700 rounded flex-1"></div>
          <div className="h-3 bg-slate-700 rounded flex-1"></div>
        </div>
      </div>
    ),
  },
  {
    id: "elegant",
    name: "Elegant",
    tag: "luxury",
    layout: "header-focused",
    colors: { primary: "#1e1b4b", secondary: "#c084fc", accent: "#e9d5ff", bg: "#faf5ff" },
    preview: (
      <div className="w-full h-full bg-gradient-to-b from-indigo-950 to-purple-900 rounded overflow-hidden shadow-inner">
        <div className="h-12 flex items-center justify-center border-b border-purple-400/30">
          <div className="h-2 bg-purple-300 rounded w-2/5"></div>
        </div>
        <div className="p-1.5">
          <div className="h-1 bg-purple-400/60 rounded w-full mb-1"></div>
          <div className="h-1 bg-purple-400/40 rounded w-3/4 mb-2"></div>
          <div className="h-1.5 bg-purple-300 rounded w-1/3 mb-1"></div>
          <div className="h-1 bg-purple-400/30 rounded w-full"></div>
        </div>
      </div>
    ),
  },
  {
    id: "corporate",
    name: "Corporate",
    tag: "business",
    layout: "two-column",
    colors: { primary: "#0c4a6e", secondary: "#0284c7", accent: "#7dd3fc", bg: "#f0f9ff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
        <div className="h-3 bg-sky-700"></div>
        <div className="flex h-28">
          <div className="w-2/5 bg-sky-50 p-1 border-r border-sky-200">
            <div className="h-5 w-5 bg-sky-200 rounded-full mx-auto mb-1"></div>
            <div className="h-1 bg-sky-300 rounded w-3/4 mx-auto mb-1"></div>
            <div className="h-1 bg-sky-200 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-1 bg-sky-200 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="w-3/5 p-1">
            <div className="h-1.5 bg-sky-600 rounded w-1/3 mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-1.5 bg-sky-600 rounded w-1/3 mb-1"></div>
            <div className="h-1 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "bold",
    name: "Bold",
    tag: "standout",
    layout: "header-focused",
    colors: { primary: "#dc2626", secondary: "#f87171", accent: "#fecaca", bg: "#fef2f2" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
        <div className="h-10 bg-gradient-to-r from-red-600 to-orange-500 flex items-center px-2">
          <div className="h-5 w-5 bg-white/30 rounded-full mr-2"></div>
          <div className="h-2 bg-white/80 rounded w-1/3"></div>
        </div>
        <div className="p-1.5">
          <div className="flex gap-1 mb-2">
            <div className="h-2 bg-red-100 rounded flex-1 flex items-center justify-center">
              <div className="h-1 bg-red-400 rounded w-1/2"></div>
            </div>
            <div className="h-2 bg-red-100 rounded flex-1 flex items-center justify-center">
              <div className="h-1 bg-red-400 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-1.5 bg-red-500 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ),
  },
  {
    id: "nature",
    name: "Nature",
    tag: "organic",
    layout: "two-column",
    colors: { primary: "#166534", secondary: "#22c55e", accent: "#bbf7d0", bg: "#f0fdf4" },
    preview: (
      <div className="w-full h-full bg-gradient-to-b from-green-50 to-emerald-100 rounded overflow-hidden shadow-inner">
        <div className="h-8 bg-gradient-to-r from-green-700 to-emerald-600 flex items-center justify-center">
          <div className="h-2 bg-white/80 rounded w-1/3"></div>
        </div>
        <div className="p-1.5">
          <div className="h-1 bg-green-300 rounded w-full mb-1"></div>
          <div className="h-1 bg-green-200 rounded w-2/3 mb-2"></div>
          <div className="flex gap-1">
            <div className="flex-1 p-1 bg-white/60 rounded">
              <div className="h-1 bg-green-400 rounded w-1/2 mb-1"></div>
              <div className="h-1 bg-green-200 rounded w-full"></div>
            </div>
            <div className="flex-1 p-1 bg-white/60 rounded">
              <div className="h-1 bg-green-400 rounded w-1/2 mb-1"></div>
              <div className="h-1 bg-green-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "midnight",
    name: "Midnight",
    tag: "dark",
    layout: "two-column",
    colors: { primary: "#020617", secondary: "#6366f1", accent: "#a5b4fc", bg: "#0f172a" },
    preview: (
      <div className="w-full h-full bg-slate-950 rounded overflow-hidden shadow-inner">
        <div className="h-10 border-b border-indigo-500/30 flex items-center px-2">
          <div className="h-6 w-6 bg-indigo-500/30 rounded-full mr-2"></div>
          <div>
            <div className="h-1.5 bg-white rounded w-16 mb-1"></div>
            <div className="h-1 bg-indigo-400/50 rounded w-12"></div>
          </div>
        </div>
        <div className="p-1.5">
          <div className="h-1.5 bg-indigo-500 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-slate-700 rounded w-full mb-1"></div>
          <div className="h-1 bg-slate-700 rounded w-full mb-1"></div>
          <div className="h-1.5 bg-indigo-500 rounded w-1/4 mb-1 mt-2"></div>
          <div className="h-1 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    ),
  },
  {
    id: "sunset",
    name: "Sunset",
    tag: "warm",
    layout: "single-column",
    colors: { primary: "#9a3412", secondary: "#f97316", accent: "#fed7aa", bg: "#fff7ed" },
    preview: (
      <div className="w-full h-full bg-gradient-to-b from-orange-100 to-amber-50 rounded overflow-hidden shadow-inner">
        <div className="h-12 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 flex items-end p-1.5">
          <div className="h-2 bg-white/90 rounded w-2/5"></div>
        </div>
        <div className="p-1.5">
          <div className="h-1 bg-orange-300 rounded w-full mb-1"></div>
          <div className="h-1 bg-orange-200 rounded w-3/4 mb-2"></div>
          <div className="h-1.5 bg-orange-500 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-orange-200 rounded w-full mb-1"></div>
          <div className="h-1 bg-orange-200 rounded w-2/3"></div>
        </div>
      </div>
    ),
  },
  {
    id: "swiss",
    name: "Swiss",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#000000", secondary: "#dc2626", accent: "#fca5a5", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-2">
        <div className="border-l-4 border-red-600 pl-2 mb-2">
          <div className="h-2.5 bg-black rounded w-2/3 mb-1"></div>
          <div className="h-1 bg-gray-400 rounded w-1/2"></div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-black rounded w-1/4"></div>
          <div className="h-1 bg-gray-300 rounded w-full"></div>
          <div className="h-1 bg-gray-300 rounded w-full"></div>
          <div className="h-1 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    ),
  },
  {
    id: "nordic",
    name: "Nordic",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#374151", secondary: "#6b7280", accent: "#d1d5db", bg: "#f9fafb" },
    preview: (
      <div className="w-full h-full bg-gray-50 rounded overflow-hidden shadow-inner">
        <div className="p-2 text-center border-b border-gray-200">
          <div className="h-2 bg-gray-700 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-1 bg-gray-400 rounded w-1/3 mx-auto"></div>
        </div>
        <div className="p-2 grid grid-cols-2 gap-2">
          <div>
            <div className="h-1 bg-gray-500 rounded w-3/4 mb-1"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
          </div>
          <div>
            <div className="h-1 bg-gray-500 rounded w-3/4 mb-1"></div>
            <div className="h-1 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "paper",
    name: "Paper",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#292524", secondary: "#78716c", accent: "#d6d3d1", bg: "#fafaf9" },
    preview: (
      <div className="w-full h-full bg-stone-50 rounded overflow-hidden shadow-inner p-2">
        <div className="border-b-2 border-stone-800 pb-1 mb-2">
          <div className="h-2.5 bg-stone-800 rounded w-1/2 mb-1"></div>
          <div className="flex gap-2">
            <div className="h-1 bg-stone-400 rounded w-1/4"></div>
            <div className="h-1 bg-stone-400 rounded w-1/4"></div>
          </div>
        </div>
        <div className="h-1.5 bg-stone-600 rounded w-1/4 mb-1"></div>
        <div className="h-1 bg-stone-300 rounded w-full mb-1"></div>
        <div className="h-1 bg-stone-300 rounded w-5/6"></div>
      </div>
    ),
  },
  {
    id: "mono",
    name: "Mono",
    tag: "single-column",
    layout: "single-column",
    colors: { primary: "#18181b", secondary: "#52525b", accent: "#a1a1aa", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner">
        <div className="h-8 bg-zinc-900 flex items-center px-2">
          <div className="h-2 bg-white rounded w-1/3"></div>
        </div>
        <div className="p-2">
          <div className="flex gap-2 mb-2">
            <div className="h-1 bg-zinc-300 rounded flex-1"></div>
            <div className="h-1 bg-zinc-300 rounded flex-1"></div>
            <div className="h-1 bg-zinc-300 rounded flex-1"></div>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-zinc-200 rounded w-full mb-1"></div>
          <div className="h-1 bg-zinc-200 rounded w-2/3"></div>
        </div>
      </div>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    tag: "traditional",
    layout: "two-column",
    colors: { primary: "#1e3a5f", secondary: "#3b82f6", accent: "#bfdbfe", bg: "#ffffff" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner p-2">
        <div className="text-center pb-1 border-b border-gray-300 mb-2">
          <div className="h-2.5 bg-blue-900 rounded w-1/2 mx-auto mb-1"></div>
          <div className="h-1 bg-gray-400 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center mb-2">
          <div className="h-1 bg-gray-300 rounded"></div>
          <div className="h-1 bg-gray-300 rounded"></div>
          <div className="h-1 bg-gray-300 rounded"></div>
        </div>
        <div className="h-1.5 bg-blue-800 rounded w-1/4 mb-1"></div>
        <div className="h-1 bg-gray-200 rounded w-full"></div>
      </div>
    ),
  },
  {
    id: "developer-pro",
    name: "Developer Pro",
    tag: "developer",
    layout: "sidebar-left",
    colors: { primary: "#0f172a", secondary: "#1e293b", accent: "#6366f1", bg: "#f8fafc" },
    preview: (
      <div className="w-full h-full bg-white rounded overflow-hidden shadow-inner flex">
        <div className="w-1/3 bg-gradient-to-b from-slate-800 to-slate-900 p-1">
          <div className="h-5 w-5 bg-indigo-500/30 rounded-full mx-auto mb-1"></div>
          <div className="h-1.5 bg-white/80 rounded w-3/4 mx-auto mb-0.5"></div>
          <div className="h-1 bg-indigo-400/50 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-1 bg-slate-600 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-slate-600 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-slate-600 rounded w-3/4 mb-2"></div>
          <div className="h-0.5 bg-indigo-500 rounded w-full mb-1"></div>
          <div className="h-1 bg-slate-700 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="w-2/3 p-1.5">
          <div className="h-1.5 bg-indigo-500 rounded w-1/3 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-1.5 bg-indigo-500 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full mb-0.5"></div>
          <div className="h-1 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-1.5 bg-indigo-500 rounded w-1/4 mb-1"></div>
          <div className="h-1 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    ),
  },
];

// Tag color mapping
const tagColors = {
  classic: "bg-blue-100 text-blue-700",
  trending: "bg-purple-100 text-purple-700",
  clean: "bg-gray-100 text-gray-700",
  premium: "bg-amber-100 text-amber-700",
  colorful: "bg-teal-100 text-teal-700",
  developer: "bg-green-100 text-green-700",
  luxury: "bg-violet-100 text-violet-700",
  business: "bg-sky-100 text-sky-700",
  standout: "bg-red-100 text-red-700",
  organic: "bg-emerald-100 text-emerald-700",
  dark: "bg-indigo-100 text-indigo-700",
  warm: "bg-orange-100 text-orange-700",
};

// Horizontal scrollable template selector (like education templates)
const ResumeTemplateSelector = ({ selectedTemplate, onSelect, showAIGenerate = false, onAIGenerate }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="font-medium text-gray-800 text-sm">Design Templates</span>
        </div>
        {showAIGenerate && onAIGenerate && (
          <button
            onClick={onAIGenerate}
            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
          >
            <Sparkles size={12} />
            AI Generate
          </button>
        )}
      </div>

      {/* Horizontal scrollable templates */}
      <div className="p-3 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {resumeTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-md flex-shrink-0 w-36 ${
                selectedTemplate === template.id
                  ? "border-purple-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Tag */}
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${tagColors[template.tag]}`}>
                  {template.tag}
                </span>
              </div>

              {/* Selected checkmark */}
              {selectedTemplate === template.id && (
                <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              {/* Preview thumbnail */}
              <div className="aspect-[3/4] p-1.5 bg-gray-50">
                {template.preview}
              </div>

              {/* Name */}
              <div className="px-2 py-1.5 bg-white border-t border-gray-100">
                <h3 className="font-medium text-gray-800 text-xs">{template.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status indicator */}
      {selectedTemplate && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
          <span className="text-xs text-green-600 flex items-center justify-center gap-1">
            <Check size={12} />
            Template applied
          </span>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplateSelector;
