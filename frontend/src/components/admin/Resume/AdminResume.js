import { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import {
  Sparkles, Download, Check, FileText,
  Edit3, Briefcase, GraduationCap, Wrench, User, Loader2, GripVertical, Trophy, Star, Pencil, Settings,
  Eye, EyeOff, Plus, X, ChevronDown, ChevronUp
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { DndContext, useDroppable, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../../../services/api";
import { PreviewContext } from "../PreviewContext";
import { resumeTemplates } from "./ResumeTemplates";
import FullPagePreviewModal from "./FullPagePreviewModal";

// Sample data for dynamic preview
const sampleData = {
  name: "John Anderson",
  title: "Senior Software Engineer",
  email: "john.anderson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary: "Results-driven software engineer with 8+ years of experience building scalable web applications. Passionate about clean code and mentoring junior developers.",
  skills: ["React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL", "TypeScript"],
  education: [
    { degree: "M.S. Computer Science", school: "Stanford University", year: "2018" },
    { degree: "B.S. Computer Science", school: "UC Berkeley", year: "2016" }
  ],
  experience: [
    { title: "Senior Software Engineer", company: "Tech Corp Inc.", period: "2021 - Present", description: "Led development of microservices architecture, reducing deployment time by 60%." },
    { title: "Software Engineer", company: "StartupXYZ", period: "2018 - 2021", description: "Built real-time data pipeline processing 10M+ events daily." }
  ],
  awards: [
    { title: "Innovation Award", org: "Tech Corp", year: "2023" },
    { title: "Best Team Lead", org: "StartupXYZ", year: "2020" }
  ],
  achievements: ["Reduced system latency by 40%", "Grew user base from 500K to 2M"]
};

// Dynamic Section Renderer based on style
const DynamicSectionRenderer = ({ sectionKey, style, data, colors = {}, isDark = false }) => {
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const subTextColor = isDark ? '#9ca3af' : '#6b7280';
  const primary = colors.primary || '#5b21b6';
  const secondary = colors.secondary || '#7c3aed';
  const accent = colors.accent || '#c4b5fd';
  const bg = colors.bg || '#faf5ff';

  // Skills rendering
  if (sectionKey === 'skills') {
    if (style === 'chips') {
      return (
        <div className="flex flex-wrap gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="px-2 py-0.5 text-[9px] rounded-full font-medium" style={{ backgroundColor: isDark ? `${secondary}30` : `${accent}`, color: isDark ? accent : primary }}>{skill}</span>
          ))}
        </div>
      );
    }
    if (style === 'bars') {
      return (
        <div className="space-y-1.5">
          {data.skills.slice(0, 5).map((skill, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[8px] w-14 truncate" style={{ color: textColor }}>{skill}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? `${secondary}30` : '#e5e7eb' }}>
                <div className="h-full rounded-full" style={{ width: `${85 - i * 10}%`, backgroundColor: secondary }}></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (style === 'grid') {
      return (
        <div className="grid grid-cols-2 gap-1">
          {data.skills.map((skill, i) => (
            <span key={i} className="text-[8px] px-1.5 py-0.5 rounded text-center" style={{ backgroundColor: isDark ? `${secondary}20` : bg, color: textColor }}>{skill}</span>
          ))}
        </div>
      );
    }
    // list (default)
    return (
      <div className="text-[9px] space-y-0.5" style={{ color: textColor }}>
        {data.skills.map((skill, i) => (
          <div key={i}>• {skill}</div>
        ))}
      </div>
    );
  }

  // Education rendering
  if (sectionKey === 'education') {
    if (style === 'cards') {
      return (
        <div className="space-y-2">
          {data.education.map((edu, i) => (
            <div key={i} className="rounded p-1.5 border" style={{ backgroundColor: isDark ? `${secondary}15` : bg, borderColor: isDark ? secondary : accent }}>
              <div className="text-[9px] font-bold" style={{ color: textColor }}>{edu.degree}</div>
              <div className="text-[8px]" style={{ color: subTextColor }}>{edu.school} • {edu.year}</div>
            </div>
          ))}
        </div>
      );
    }
    if (style === 'timeline') {
      return (
        <div className="space-y-2">
          {data.education.map((edu, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary }}></div>
                {i < data.education.length - 1 && <div className="w-0.5 flex-1" style={{ backgroundColor: accent }}></div>}
              </div>
              <div className="flex-1 pb-2">
                <div className="text-[9px] font-bold" style={{ color: textColor }}>{edu.degree}</div>
                <div className="text-[8px]" style={{ color: subTextColor }}>{edu.school} • {edu.year}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    // compact (default)
    return (
      <div className="space-y-1" style={{ color: textColor }}>
        {data.education.map((edu, i) => (
          <div key={i} className="text-[9px]">
            <span className="font-bold">{edu.degree}</span> - {edu.school} ({edu.year})
          </div>
        ))}
      </div>
    );
  }

  // Summary rendering
  if (sectionKey === 'summary') {
    if (style === 'highlights') {
      return (
        <div className="text-[9px] space-y-1" style={{ color: textColor }}>
          <div className="flex items-start gap-1"><span style={{ color: secondary }}>✓</span> 8+ years software engineering experience</div>
          <div className="flex items-start gap-1"><span style={{ color: secondary }}>✓</span> Led teams delivering products for 2M+ users</div>
          <div className="flex items-start gap-1"><span style={{ color: secondary }}>✓</span> Expert in React, Node.js, AWS</div>
        </div>
      );
    }
    if (style === 'quote') {
      return (
        <div className="text-[9px] italic pl-2" style={{ borderLeft: `2px solid ${secondary}`, color: subTextColor }}>
          "{data.summary}"
        </div>
      );
    }
    // paragraph (default)
    return <p className="text-[9px] leading-relaxed" style={{ color: textColor }}>{data.summary}</p>;
  }

  // Experience rendering
  if (sectionKey === 'experience') {
    if (style === 'timeline') {
      return (
        <div className="space-y-2">
          {data.experience.map((exp, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary }}></div>
                {i < data.experience.length - 1 && <div className="w-0.5 flex-1" style={{ backgroundColor: accent }}></div>}
              </div>
              <div className="flex-1 pb-2">
                <div className="text-[9px] font-bold" style={{ color: textColor }}>{exp.title}</div>
                <div className="text-[8px]" style={{ color: secondary }}>{exp.company} • {exp.period}</div>
                <div className="text-[8px] mt-0.5" style={{ color: subTextColor }}>{exp.description}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (style === 'achievements') {
      return (
        <div className="space-y-2">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold" style={{ color: textColor }}>{exp.title}</span>
                <span className="text-[7px]" style={{ color: subTextColor }}>{exp.period}</span>
              </div>
              <div className="text-[8px]" style={{ color: secondary }}>{exp.company}</div>
              <div className="text-[8px] mt-0.5" style={{ color: textColor }}>• {exp.description}</div>
            </div>
          ))}
        </div>
      );
    }
    if (style === 'compact') {
      return (
        <div className="space-y-1" style={{ color: textColor }}>
          {data.experience.map((exp, i) => (
            <div key={i} className="text-[9px]">
              <span className="font-bold">{exp.title}</span> @ {exp.company} ({exp.period})
            </div>
          ))}
        </div>
      );
    }
    // detailed (default)
    return (
      <div className="space-y-2">
        {data.experience.map((exp, i) => (
          <div key={i}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] font-bold" style={{ color: textColor }}>{exp.title}</div>
                <div className="text-[8px]" style={{ color: secondary }}>{exp.company}</div>
              </div>
              <span className="text-[7px] px-1 py-0.5 rounded" style={{ backgroundColor: isDark ? `${secondary}20` : bg, color: subTextColor }}>{exp.period}</span>
            </div>
            <div className="text-[8px] mt-0.5" style={{ color: subTextColor }}>{exp.description}</div>
          </div>
        ))}
      </div>
    );
  }

  // Awards rendering
  if (sectionKey === 'awards') {
    if (style === 'cards') {
      return (
        <div className="space-y-1.5">
          {data.awards.map((award, i) => (
            <div key={i} className="rounded p-1.5 border" style={{ backgroundColor: isDark ? `${accent}15` : `${accent}30`, borderColor: accent }}>
              <div className="text-[9px]" style={{ color: textColor }}>🏆 <span className="font-bold">{award.title}</span></div>
              <div className="text-[7px]" style={{ color: subTextColor }}>{award.org} • {award.year}</div>
            </div>
          ))}
        </div>
      );
    }
    if (style === 'badges') {
      return (
        <div className="flex flex-wrap gap-1">
          {data.awards.map((award, i) => (
            <span key={i} className="px-1.5 py-0.5 text-[8px] rounded font-medium" style={{ backgroundColor: accent, color: primary }}>🏆 {award.title}</span>
          ))}
        </div>
      );
    }
    // list (default)
    return (
      <div className="text-[9px] space-y-0.5" style={{ color: textColor }}>
        {data.awards.map((award, i) => (
          <div key={i}>• {award.title} - {award.org} ({award.year})</div>
        ))}
      </div>
    );
  }

  // Achievements rendering
  if (sectionKey === 'achievements') {
    if (style === 'numbered') {
      return (
        <div className="text-[9px] space-y-0.5" style={{ color: textColor }}>
          {data.achievements.map((ach, i) => (
            <div key={i}><span style={{ color: secondary }}>{i + 1}.</span> {ach}</div>
          ))}
        </div>
      );
    }
    if (style === 'icons') {
      return (
        <div className="text-[9px] space-y-0.5" style={{ color: textColor }}>
          {data.achievements.map((ach, i) => (
            <div key={i}>{i === 0 ? '⚡' : '📈'} {ach}</div>
          ))}
        </div>
      );
    }
    // bullets (default)
    return (
      <div className="text-[9px] space-y-0.5" style={{ color: textColor }}>
        {data.achievements.map((ach, i) => (
          <div key={i}>• {ach}</div>
        ))}
      </div>
    );
  }

  return null;
};

// Dynamic Layout Preview Component
const DynamicLayoutPreview = ({ sidebarSections, mainSections, templateId }) => {
  const enabledSidebar = sidebarSections.filter(s => s.enabled);
  const enabledMain = mainSections.filter(s => s.enabled);
  const allSections = [...enabledSidebar, ...enabledMain];

  // Debug: log what sections are in each column
  console.log('[DynamicLayoutPreview] Sidebar sections:', sidebarSections.map(s => `${s.key}(${s.enabled})`).join(', '));
  console.log('[DynamicLayoutPreview] Main sections:', mainSections.map(s => `${s.key}(${s.enabled})`).join(', '));

  // Get template colors and layout
  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  const colors = template.colors;
  const layout = template.layout || 'two-column';

  // Determine if it's a dark theme
  const isDarkTheme = ['executive', 'midnight', 'tech'].includes(templateId);

  // Dynamic styles based on template
  const headerStyle = {
    background: layout === 'single-column' || layout === 'academic'
      ? 'transparent'
      : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color: layout === 'single-column' || layout === 'academic' ? colors.primary : '#ffffff',
    borderBottom: layout === 'single-column' || layout === 'academic' ? `2px solid ${colors.primary}` : 'none'
  };

  const sectionTitleStyle = {
    color: isDarkTheme ? colors.accent : colors.primary,
    borderColor: colors.secondary
  };

  // Single Column Layout
  if (layout === 'single-column' || layout === 'academic') {
    return (
      <div className="overflow-hidden" style={{ maxHeight: '450px', overflowY: 'auto', fontSize: '10px', backgroundColor: isDarkTheme ? colors.bg : '#ffffff' }}>
        {/* Header - Centered for single column */}
        <div className="px-4 py-3 text-center" style={headerStyle}>
          <h1 className="text-lg font-bold">{sampleData.name}</h1>
          <p className="text-[10px]" style={{ color: isDarkTheme ? colors.accent : colors.secondary }}>{sampleData.title}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-1 text-[8px]" style={{ color: isDarkTheme ? '#9ca3af' : '#6b7280' }}>
            <span>{sampleData.email}</span>
            <span>•</span>
            <span>{sampleData.phone}</span>
            <span>•</span>
            <span>{sampleData.location}</span>
          </div>
        </div>

        {/* Single Column Content */}
        <div className="p-3" style={{ backgroundColor: isDarkTheme ? colors.bg : '#ffffff' }}>
          {allSections.map((section, idx) => (
            <div key={section.key} className={idx > 0 ? 'mt-3' : ''}>
              <h3 className="text-[10px] font-bold uppercase mb-1.5 pb-0.5 border-b" style={sectionTitleStyle}>
                {section.label}
              </h3>
              <DynamicSectionRenderer sectionKey={section.key} style={section.style} data={sampleData} colors={colors} isDark={isDarkTheme} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 text-center" style={{ backgroundColor: colors.bg, borderTop: `1px solid ${colors.accent}` }}>
          <p className="text-[8px]" style={{ color: colors.secondary }}>Single Column • {template.name}</p>
        </div>
      </div>
    );
  }

  // Header-Focused Layout
  if (layout === 'header-focused') {
    return (
      <div className="overflow-hidden" style={{ maxHeight: '450px', overflowY: 'auto', fontSize: '10px', backgroundColor: isDarkTheme ? colors.bg : '#ffffff' }}>
        {/* Large Header */}
        <div className="px-4 py-5 text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#ffffff' }}>
          <h1 className="text-xl font-bold mb-1">{sampleData.name}</h1>
          <p className="text-[11px] opacity-90 mb-2">{sampleData.title}</p>
          <div className="flex flex-wrap justify-center gap-2 text-[8px] opacity-80">
            <span className="px-2 py-0.5 bg-white/20 rounded-full">{sampleData.email}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full">{sampleData.phone}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full">{sampleData.location}</span>
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3" style={{ backgroundColor: isDarkTheme ? colors.bg : '#ffffff' }}>
          {allSections.map((section, idx) => (
            <div key={section.key} className={idx > 0 ? 'mt-2' : ''}>
              <h3 className="text-[9px] font-bold uppercase mb-1 pb-0.5" style={{ color: colors.secondary, borderBottom: `1px solid ${colors.accent}` }}>
                {section.label}
              </h3>
              <DynamicSectionRenderer sectionKey={section.key} style={section.style} data={sampleData} colors={colors} isDark={isDarkTheme} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 text-center" style={{ backgroundColor: colors.bg, borderTop: `1px solid ${colors.accent}` }}>
          <p className="text-[8px]" style={{ color: colors.secondary }}>Header Focused • {template.name}</p>
        </div>
      </div>
    );
  }

  // Two Column Layout (default)
  const sidebarStyle = {
    backgroundColor: isDarkTheme ? colors.primary : colors.bg,
    borderColor: isDarkTheme ? colors.secondary : colors.accent
  };

  const mainStyle = {
    backgroundColor: isDarkTheme ? colors.bg : '#ffffff'
  };

  return (
    <div className="overflow-hidden" style={{ maxHeight: '450px', overflowY: 'auto', fontSize: '10px', backgroundColor: isDarkTheme ? colors.bg : '#ffffff' }}>
      {/* Header */}
      <div className="px-4 py-3" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#ffffff' }}>
        <h1 className="text-lg font-bold">{sampleData.name}</h1>
        <p className="text-[10px] opacity-90">{sampleData.title}</p>
        <div className="flex flex-wrap gap-3 mt-1 text-[8px] opacity-80">
          <span>✉ {sampleData.email}</span>
          <span>📞 {sampleData.phone}</span>
          <span>📍 {sampleData.location}</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 p-3 border-r" style={sidebarStyle}>
          {enabledSidebar.map((section, idx) => (
            <div key={section.key} className={idx > 0 ? 'mt-3' : ''}>
              <h3 className="text-[10px] font-bold uppercase mb-1.5 pb-0.5 border-b" style={sectionTitleStyle}>
                {section.label}
              </h3>
              <DynamicSectionRenderer sectionKey={section.key} style={section.style} data={sampleData} colors={colors} isDark={isDarkTheme} />
            </div>
          ))}
          {enabledSidebar.length === 0 && (
            <p className="text-[9px] italic" style={{ color: '#9ca3af' }}>No sidebar sections</p>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-3" style={mainStyle}>
          {enabledMain.map((section, idx) => (
            <div key={section.key} className={idx > 0 ? 'mt-3' : ''}>
              <h3 className="text-[10px] font-bold uppercase mb-1.5 pb-0.5 border-b" style={sectionTitleStyle}>
                {section.label}
              </h3>
              <DynamicSectionRenderer sectionKey={section.key} style={section.style} data={sampleData} colors={colors} isDark={isDarkTheme} />
            </div>
          ))}
          {enabledMain.length === 0 && (
            <p className="text-[9px] italic" style={{ color: '#9ca3af' }}>No main sections</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 text-center" style={{ backgroundColor: colors.bg, borderTop: `1px solid ${colors.accent}` }}>
        <p className="text-[8px]" style={{ color: colors.secondary }}>Two Column • {template.name}</p>
      </div>
    </div>
  );
};

// Style Preview Mini Component
const StylePreviewMini = ({ sectionKey, styleId }) => {
  // Skills previews
  if (sectionKey === 'skills') {
    if (styleId === 'chips') {
      return (
        <div className="flex flex-wrap gap-1">
          <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[8px] rounded-full">React</span>
          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] rounded-full">Node</span>
          <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full">AWS</span>
        </div>
      );
    }
    if (styleId === 'bars') {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[7px] w-8">React</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[7px] w-8">Node</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      );
    }
    if (styleId === 'grid') {
      return (
        <div className="grid grid-cols-3 gap-0.5">
          {['React', 'Node', 'AWS', 'Docker', 'Python', 'SQL'].map(s => (
            <span key={s} className="text-[6px] bg-gray-100 px-1 py-0.5 text-center rounded">{s}</span>
          ))}
        </div>
      );
    }
    if (styleId === 'list') {
      return (
        <div className="text-[7px] space-y-0.5">
          <div>• React, Node.js</div>
          <div>• AWS, Docker</div>
        </div>
      );
    }
  }

  // Education previews
  if (sectionKey === 'education') {
    if (styleId === 'cards') {
      return (
        <div className="space-y-1">
          <div className="bg-gray-100 rounded p-1">
            <div className="text-[7px] font-bold">M.S. Computer Science</div>
            <div className="text-[6px] text-gray-500">Stanford • 2020</div>
          </div>
        </div>
      );
    }
    if (styleId === 'timeline') {
      return (
        <div className="flex gap-1">
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <div className="w-0.5 h-4 bg-purple-300"></div>
          </div>
          <div>
            <div className="text-[7px] font-bold">M.S. CS</div>
            <div className="text-[6px] text-gray-500">2020</div>
          </div>
        </div>
      );
    }
    if (styleId === 'compact') {
      return (
        <div className="text-[7px]">
          <span className="font-bold">M.S. CS</span> - Stanford (2020)
        </div>
      );
    }
  }

  // Summary previews
  if (sectionKey === 'summary') {
    if (styleId === 'paragraph') {
      return (
        <div className="text-[7px] text-gray-600 leading-tight">
          Results-driven engineer with 8+ years building scalable apps...
        </div>
      );
    }
    if (styleId === 'highlights') {
      return (
        <div className="text-[7px] space-y-0.5">
          <div className="flex items-center gap-1">✓ 8+ years experience</div>
          <div className="flex items-center gap-1">✓ Led 5-person team</div>
        </div>
      );
    }
    if (styleId === 'quote') {
      return (
        <div className="text-[7px] italic border-l-2 border-purple-400 pl-1">
          "Results-driven engineer..."
        </div>
      );
    }
  }

  // Experience previews
  if (sectionKey === 'experience') {
    if (styleId === 'detailed') {
      return (
        <div>
          <div className="text-[7px] font-bold">Senior Engineer</div>
          <div className="text-[6px] text-purple-600">Tech Corp • 2021-Present</div>
          <div className="text-[6px] text-gray-500">Led development of...</div>
        </div>
      );
    }
    if (styleId === 'timeline') {
      return (
        <div className="flex gap-1">
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <div className="w-0.5 h-3 bg-blue-300"></div>
          </div>
          <div className="text-[7px]">
            <div className="font-bold">Sr. Engineer</div>
            <div className="text-gray-500">2021</div>
          </div>
        </div>
      );
    }
    if (styleId === 'achievements') {
      return (
        <div className="text-[7px]">
          <div className="font-bold">Sr. Engineer</div>
          <div>• Reduced latency 40%</div>
        </div>
      );
    }
    if (styleId === 'compact') {
      return (
        <div className="text-[7px]">
          <span className="font-bold">Sr. Engineer</span> @ Tech Corp (2021-Now)
        </div>
      );
    }
  }

  // Awards previews
  if (sectionKey === 'awards') {
    if (styleId === 'cards') {
      return (
        <div className="bg-yellow-50 rounded p-1 border border-yellow-200">
          <div className="text-[7px]">🏆 <span className="font-bold">Innovation Award</span></div>
          <div className="text-[6px] text-gray-500">Tech Corp • 2023</div>
        </div>
      );
    }
    if (styleId === 'list') {
      return (
        <div className="text-[7px]">
          <div>• Innovation Award (2023)</div>
          <div>• Best Team Lead (2022)</div>
        </div>
      );
    }
    if (styleId === 'badges') {
      return (
        <div className="flex gap-1">
          <span className="px-1 py-0.5 bg-yellow-400 text-[6px] rounded font-bold">🏆 Innovation</span>
          <span className="px-1 py-0.5 bg-blue-400 text-white text-[6px] rounded font-bold">⭐ Leader</span>
        </div>
      );
    }
  }

  // Achievements previews
  if (sectionKey === 'achievements') {
    if (styleId === 'bullets') {
      return (
        <div className="text-[7px]">
          <div>• Reduced latency by 40%</div>
          <div>• Grew users to 2M</div>
        </div>
      );
    }
    if (styleId === 'numbered') {
      return (
        <div className="text-[7px]">
          <div>1. Reduced latency 40%</div>
          <div>2. Grew users to 2M</div>
        </div>
      );
    }
    if (styleId === 'icons') {
      return (
        <div className="text-[7px]">
          <div>⚡ Reduced latency 40%</div>
          <div>📈 Grew users to 2M</div>
        </div>
      );
    }
  }

  return null;
};

// Sortable Section Item with style dropdown
const SortableSectionItem = ({ section, isEnabled, onToggle, onStyleChange, styleOptions, compact = false, sortableId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sortableId || section.key });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const Icon = section.icon;
  const [showStyles, setShowStyles] = useState(false);
  const [hoveredStyle, setHoveredStyle] = useState(null);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg transition-all border ${
        isEnabled
          ? 'bg-white border-indigo-300 shadow-sm'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      <div className={`flex items-center gap-2 ${compact ? 'p-2' : 'p-3'}`}>
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={14} />
        </div>
        <div
          onClick={onToggle}
          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer ${
            isEnabled ? 'bg-indigo-500 text-white' : 'bg-gray-300'
          }`}
        >
          {isEnabled && <Check size={10} />}
        </div>
        <Icon size={14} className={isEnabled ? 'text-indigo-600' : 'text-gray-400'} />
        <span
          className={`text-xs font-medium flex-1 cursor-pointer ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}
          onClick={onToggle}
        >
          {section.label}
        </span>
        {isEnabled && styleOptions && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowStyles(!showStyles); }}
            className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
          >
            {styleOptions.find(s => s.id === section.style)?.label || 'Style'}
          </button>
        )}
      </div>

      {/* Style options dropdown with previews */}
      {showStyles && isEnabled && styleOptions && (
        <div className="px-2 pb-2 border-t border-gray-100 mt-1 pt-2">
          <div className="flex gap-2">
            {/* Style list */}
            <div className="flex-1 space-y-1">
              {styleOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { onStyleChange(opt.id); setShowStyles(false); }}
                  onMouseEnter={() => setHoveredStyle(opt.id)}
                  onMouseLeave={() => setHoveredStyle(null)}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                    section.style === opt.id
                      ? 'bg-purple-500 text-white'
                      : hoveredStyle === opt.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-50 hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
            {/* Live preview */}
            <div className="w-28 bg-white border border-gray-200 rounded-lg p-2 flex flex-col">
              <div className="text-[8px] text-gray-400 uppercase mb-1 font-medium">Preview</div>
              <div className="flex-1 flex items-center justify-center">
                <StylePreviewMini
                  sectionKey={section.key}
                  styleId={hoveredStyle || section.style}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Droppable column container for cross-container drag
const DroppableColumn = ({ id, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'ring-2 ring-purple-400 ring-offset-2' : ''} transition-all`}
    >
      {children}
    </div>
  );
};

// Resume Editor Component with formatting toolbar
// Structured Resume Editor - Section by section editing
const StructuredResumeEditor = ({ resumeData, onChange, onSave }) => {
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedItem, setExpandedItem] = useState(null); // Track which item is expanded (accordion)
  const [newSkill, setNewSkill] = useState('');

  // Parse resume data on mount
  useEffect(() => {
    if (resumeData) {
      // Default sections structure
      const defaultSections = [
        { key: 'skills', label: 'Skills', visible: true, type: 'skills', items: [] },
        { key: 'summary', label: 'Summary', visible: true, type: 'text', content: '' },
        { key: 'experience', label: 'Work Experience', visible: true, type: 'list', items: [] },
        { key: 'education', label: 'Education', visible: true, type: 'list', items: [] },
        { key: 'awards', label: 'Awards', visible: true, type: 'list', items: [] },
        { key: 'achievements', label: 'Achievements', visible: true, type: 'list', items: [] },
      ];

      // Parse skills, experience, etc. from resumeData if it's an object
      if (typeof resumeData === 'object' && resumeData !== null) {
        const parsed = defaultSections.map(section => {
          if (section.key === 'skills' && resumeData.skills) {
            return { ...section, items: resumeData.skills.map(s => typeof s === 'string' ? s : s.name || s.skill || s) };
          }
          if (section.key === 'summary' && resumeData.summary) {
            return { ...section, content: resumeData.summary };
          }
          if (section.key === 'experience' && resumeData.experience) {
            return { ...section, items: resumeData.experience };
          }
          if (section.key === 'education' && resumeData.education) {
            return { ...section, items: resumeData.education };
          }
          if (section.key === 'awards' && resumeData.awards) {
            return { ...section, items: resumeData.awards };
          }
          if (section.key === 'achievements' && resumeData.achievements) {
            return { ...section, items: resumeData.achievements };
          }
          return section;
        });
        setSections(parsed);
      } else {
        setSections(defaultSections);
      }

      // Expand all sections by default
      const expanded = {};
      defaultSections.forEach(s => expanded[s.key] = true);
      setExpandedSections(expanded);
    }
  }, [resumeData]);

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVisibility = (key) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, visible: !s.visible } : s));
  };

  const updateLabel = (key, newLabel) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, label: newLabel } : s));
  };

  const updateContent = (key, content) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, content } : s));
  };

  const addSkill = (sectionKey) => {
    if (!newSkill.trim()) return;
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        return { ...s, items: [...s.items, newSkill.trim()] };
      }
      return s;
    }));
    setNewSkill('');
  };

  const removeSkill = (sectionKey, index) => {
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        return { ...s, items: s.items.filter((_, i) => i !== index) };
      }
      return s;
    }));
  };

  const updateSkill = (sectionKey, index, value) => {
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        const newItems = [...s.items];
        newItems[index] = value;
        return { ...s, items: newItems };
      }
      return s;
    }));
  };

  const updateExperienceItem = (sectionKey, index, field, value) => {
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        const newItems = [...s.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...s, items: newItems };
      }
      return s;
    }));
  };

  const getSectionData = () => {
    const data = {};
    sections.forEach(s => {
      data[s.key] = {
        label: s.label,
        visible: s.visible,
        items: s.items,
        content: s.content
      };
    });
    return data;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(getSectionData());
    }
  };

  const renderSkillsSection = (section) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {section.items.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-slate-700 px-3 py-1.5 rounded-full group">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(section.key, idx, e.target.value)}
              className="bg-transparent text-white text-sm w-auto min-w-[60px] focus:outline-none"
              style={{ width: `${Math.max(60, skill.length * 8)}px` }}
            />
            <button
              onClick={() => removeSkill(section.key, idx)}
              className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill(section.key)}
          placeholder="Add new skill..."
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <button
          onClick={() => addSkill(section.key)}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  );

  const renderTextSection = (section) => (
    <textarea
      value={section.content || ''}
      onChange={(e) => updateContent(section.key, e.target.value)}
      rows={4}
      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
      placeholder={`Enter ${section.label.toLowerCase()}...`}
    />
  );

  const addNewItem = (sectionKey) => {
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        const newItem = sectionKey === 'education'
          ? { degree: '', school: '', year: '' }
          : sectionKey === 'awards'
          ? { title: '', org: '', year: '' }
          : { title: '', company: '', period: '', description: '' };
        return { ...s, items: [...s.items, newItem] };
      }
      return s;
    }));
  };

  const removeItem = (sectionKey, index) => {
    setSections(prev => prev.map(s => {
      if (s.key === sectionKey) {
        return { ...s, items: s.items.filter((_, i) => i !== index) };
      }
      return s;
    }));
  };

  const renderExperienceSection = (section) => {
    const itemKey = (sectionKey, idx) => `${sectionKey}-${idx}`;
    const isExpanded = (idx) => expandedItem === itemKey(section.key, idx);
    const toggleItem = (idx) => {
      const key = itemKey(section.key, idx);
      setExpandedItem(expandedItem === key ? null : key);
    };

    // Strip HTML tags from description for display
    const stripHtml = (html) => {
      if (!html) return '';
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };

    return (
      <div className="space-y-2">
        {section.items.length === 0 ? (
          <p className="text-slate-400 text-sm italic">No items yet. Click "Add New" to create one.</p>
        ) : (
          section.items.map((item, idx) => (
            <div key={idx} className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
              {/* Collapsed Header - Click to expand */}
              <div
                onClick={() => toggleItem(idx)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-700/70 transition-colors"
              >
                <div className="flex-1">
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>
                    {item.title || item.degree || 'Untitled'}
                  </span>
                  <span style={{ color: '#ffffff', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                    @ {item.company || item.school || item.org || 'Unknown'}
                  </span>
                  {item.period || item.year ? (
                    <span style={{ color: '#ffffff', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({item.period || item.year})</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(section.key, idx); }}
                    className="text-slate-400 hover:text-red-400 p-1"
                  >
                    <X size={16} />
                  </button>
                  {isExpanded(idx) ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded(idx) && (
                <div className="p-4 border-t border-slate-600 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">{section.key === 'education' ? 'Degree' : 'Job Title'}</label>
                      <input
                        type="text"
                        value={item.title || item.degree || ''}
                        onChange={(e) => updateExperienceItem(section.key, idx, section.key === 'education' ? 'degree' : 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">{section.key === 'education' ? 'School/University' : section.key === 'awards' ? 'Organization' : 'Company'}</label>
                      <input
                        type="text"
                        value={item.company || item.school || item.org || ''}
                        onChange={(e) => updateExperienceItem(section.key, idx, section.key === 'education' ? 'school' : (section.key === 'awards' ? 'org' : 'company'), e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Period / Year</label>
                    <input
                      type="text"
                      value={item.period || item.year || ''}
                      onChange={(e) => updateExperienceItem(section.key, idx, item.period !== undefined ? 'period' : 'year', e.target.value)}
                      placeholder="e.g., 2020 - Present"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {section.key !== 'education' && (
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Description</label>
                      <textarea
                        value={stripHtml(item.description) || ''}
                        onChange={(e) => updateExperienceItem(section.key, idx, 'description', e.target.value)}
                        rows={6}
                        placeholder="Describe your responsibilities, achievements..."
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 resize-y"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <button
          onClick={() => {
            addNewItem(section.key);
            // Auto-expand the new item
            setTimeout(() => setExpandedItem(itemKey(section.key, section.items.length)), 50);
          }}
          className="w-full py-2 border border-dashed border-slate-500 rounded-lg text-slate-400 hover:text-white hover:border-emerald-500 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add New {section.key === 'education' ? 'Education' : section.key === 'awards' ? 'Award' : 'Experience'}
        </button>
      </div>
    );
  };

  const renderAchievementsSection = (section) => (
    <div className="space-y-2">
      {section.items.length === 0 ? (
        <p className="text-slate-400 text-sm italic">No achievements yet.</p>
      ) : (
        section.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={typeof item === 'string' ? item : item.title || ''}
              onChange={(e) => {
                const newItems = [...section.items];
                newItems[idx] = e.target.value;
                setSections(prev => prev.map(s => s.key === section.key ? { ...s, items: newItems } : s));
              }}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => removeItem(section.key, idx)}
              className="text-slate-400 hover:text-red-400 p-2"
            >
              <X size={16} />
            </button>
          </div>
        ))
      )}
      <button
        onClick={() => {
          setSections(prev => prev.map(s => {
            if (s.key === section.key) {
              return { ...s, items: [...s.items, ''] };
            }
            return s;
          }));
        }}
        className="w-full py-2 border border-dashed border-slate-500 rounded-lg text-slate-400 hover:text-white hover:border-emerald-500 flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={16} /> Add Achievement
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.key} className={`border rounded-lg overflow-hidden ${section.visible ? 'border-slate-600' : 'border-slate-700 opacity-60'}`}>
          {/* Section Header */}
          <div className="bg-slate-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => toggleSection(section.key)} className="text-slate-400 hover:text-white">
                {expandedSections[section.key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <input
                type="text"
                value={section.label}
                onChange={(e) => updateLabel(section.key, e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1"
              />
            </div>
            <button
              onClick={() => toggleVisibility(section.key)}
              className={`p-2 rounded transition-colors ${section.visible ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'}`}
              title={section.visible ? 'Hide section' : 'Show section'}
            >
              {section.visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Section Content */}
          {expandedSections[section.key] && (
            <div className="p-4 bg-slate-800">
              {section.type === 'skills' && renderSkillsSection(section)}
              {section.type === 'text' && renderTextSection(section)}
              {section.type === 'list' && section.key === 'achievements' && renderAchievementsSection(section)}
              {section.type === 'list' && section.key !== 'achievements' && renderExperienceSection(section)}
            </div>
          )}
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
        >
          <Check size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const ResumeEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const ToolButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-all ${
        isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        {/* Headings */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' : '0'
          }
          className="px-2 py-1 rounded border border-gray-300 text-sm bg-white"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text formatting */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <span className="font-bold text-sm">B</span>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <span className="italic text-sm">I</span>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <span className="underline text-sm">U</span>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <span className="line-through text-sm">S</span>
        </ToolButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h9.5a.75.75 0 010 1.5h-9.5A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm2.5 5a.75.75 0 01.75-.75h9.5a.75.75 0 010 1.5h-9.5a.75.75 0 01-.75-.75zm-2.5 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm5 5a.75.75 0 01.75-.75h9.5a.75.75 0 010 1.5h-9.5a.75.75 0 01-.75-.75zm-5 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </ToolButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 100 2 1 1 0 000-2zm4 0a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zm0 5a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zm0 5a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zM3 9a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm4-.25a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zm0 5a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zm0 5a.75.75 0 000 1.5h10a.75.75 0 000-1.5H7zM3 9.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm0 5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clipRule="evenodd" />
          </svg>
        </ToolButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Color picker */}
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
          title="Text Color"
        />

        <div className="flex-1" />

        {/* Undo/Redo */}
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
          </svg>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z" clipRule="evenodd" />
          </svg>
        </ToolButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />

      <style>{`
        .ProseMirror {
          min-height: 400px;
          padding: 1rem;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; margin: 0.875rem 0 0.5rem; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .ProseMirror h4 { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0 0.25rem; }
        .ProseMirror p { margin: 0.5rem 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li { margin: 0.25rem 0; }
        .ProseMirror hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
      `}</style>
    </div>
  );
};

const AdminResume = () => {
  // Get context for layout modal
  const {
    showResumeLayoutModal,
    setShowResumeLayoutModal,
    setResumeGenerateCallback,
    updateResumeData,
    setResumeGenerating,
  } = useContext(PreviewContext);


  // Generate state
  const [generating, setGenerating] = useState(false);
  const [resumeHtml, setResumeHtml] = useState(null);
  const [approved, setApproved] = useState(false);
  const [savedResume, setSavedResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');

  // Tab state for Builder vs Edit
  const [activeTab, setActiveTab] = useState('builder');
  const [editableHtml, setEditableHtml] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const editorContainerRef = useRef(null);
  const [showFullPreview, setShowFullPreview] = useState(false);


  // Section style options
  const sectionStyleOptions = {
    skills: [
      { id: 'chips', label: 'Chips/Tags', desc: 'Colorful badge-style tags' },
      { id: 'bars', label: 'Progress Bars', desc: 'With proficiency levels' },
      { id: 'grid', label: 'Grid Layout', desc: 'Organized in columns' },
      { id: 'list', label: 'Simple List', desc: 'Clean bullet points' },
    ],
    education: [
      { id: 'cards', label: 'Cards', desc: 'Boxed with details' },
      { id: 'timeline', label: 'Timeline', desc: 'Vertical timeline style' },
      { id: 'compact', label: 'Compact', desc: 'Minimal space usage' },
    ],
    summary: [
      { id: 'paragraph', label: 'Paragraph', desc: 'Full text block' },
      { id: 'highlights', label: 'Highlights', desc: 'Key points with icons' },
      { id: 'quote', label: 'Quote Style', desc: 'Elegant quote format' },
    ],
    experience: [
      { id: 'detailed', label: 'Detailed', desc: 'Full descriptions' },
      { id: 'timeline', label: 'Timeline', desc: 'Visual timeline' },
      { id: 'achievements', label: 'Achievement-focused', desc: 'Bullet achievements' },
      { id: 'compact', label: 'Compact', desc: 'Space-efficient' },
    ],
    awards: [
      { id: 'cards', label: 'Award Cards', desc: 'Trophy style cards' },
      { id: 'list', label: 'Simple List', desc: 'Clean listing' },
      { id: 'badges', label: 'Badges', desc: 'Badge/ribbon style' },
    ],
    achievements: [
      { id: 'bullets', label: 'Bullet Points', desc: 'Clear bullet list' },
      { id: 'numbered', label: 'Numbered', desc: 'Ranked achievements' },
      { id: 'icons', label: 'With Icons', desc: 'Icon-enhanced' },
    ],
  };

  // Section icon mapping (icons can't be stored in localStorage)
  const sectionIcons = {
    skills: Wrench,
    education: GraduationCap,
    summary: User,
    experience: Briefcase,
    awards: Trophy,
    achievements: Star,
  };

  // Section label mapping
  const sectionLabels = {
    skills: 'Skills',
    education: 'Education',
    summary: 'Summary',
    experience: 'Work Experience',
    awards: 'Awards',
    achievements: 'Achievements',
  };

  // Default sections
  const defaultSidebarSections = [
    { key: 'skills', enabled: true, style: 'chips' },
    { key: 'education', enabled: true, style: 'cards' },
  ];
  const defaultMainSections = [
    { key: 'summary', enabled: true, style: 'paragraph' },
    { key: 'experience', enabled: true, style: 'detailed' },
    { key: 'awards', enabled: true, style: 'cards' },
    { key: 'achievements', enabled: true, style: 'bullets' },
  ];

  // Helper to validate and deduplicate sections between columns
  const loadLayoutFromStorage = () => {
    try {
      const saved = localStorage.getItem('resumeLayout');
      if (saved) {
        let { sidebar, main } = JSON.parse(saved);
        if (sidebar && main && sidebar.length > 0) {
          // Check for duplicates between columns and remove them from main
          const sidebarKeys = sidebar.map(s => s.key);
          const mainKeys = main.map(s => s.key);
          const duplicates = sidebarKeys.filter(key => mainKeys.includes(key));

          if (duplicates.length > 0) {
            console.warn('[Resume Layout] Found duplicates, removing from main:', duplicates);
            main = main.filter(s => !duplicates.includes(s.key));
            // Save the fixed version
            localStorage.setItem('resumeLayout', JSON.stringify({ sidebar, main }));
          }

          return { sidebar, main };
        }
      }
    } catch (e) {
      console.error('Error loading layout:', e);
      localStorage.removeItem('resumeLayout');
    }
    return null;
  };

  // Load layout once
  const savedLayout = loadLayoutFromStorage();

  // Initialize sections with lazy initializer (runs only once)
  const [sidebarSections, setSidebarSections] = useState(() => {
    try {
      if (savedLayout?.sidebar && Array.isArray(savedLayout.sidebar)) {
        console.log('[Resume Layout] Loaded sidebar from localStorage:', savedLayout.sidebar);
        return savedLayout.sidebar
          .filter(s => s && s.key && sectionIcons[s.key])
          .map(s => ({
            ...s,
            icon: sectionIcons[s.key],
            label: sectionLabels[s.key] || s.key,
          }));
      }
    } catch (e) {
      console.error('Error initializing sidebar:', e);
    }
    return defaultSidebarSections.map(s => ({ ...s, icon: sectionIcons[s.key], label: sectionLabels[s.key] }));
  });

  const [mainSections, setMainSections] = useState(() => {
    try {
      if (savedLayout?.main && Array.isArray(savedLayout.main)) {
        console.log('[Resume Layout] Loaded main from localStorage:', savedLayout.main);
        return savedLayout.main
          .filter(s => s && s.key && sectionIcons[s.key])
          .map(s => ({
            ...s,
            icon: sectionIcons[s.key],
            label: sectionLabels[s.key] || s.key,
          }));
      }
    } catch (e) {
      console.error('Error initializing main sections:', e);
    }
    return defaultMainSections.map(s => ({ ...s, icon: sectionIcons[s.key], label: sectionLabels[s.key] }));
  });

  // Remove duplicates between columns (one-time fix on mount)
  useEffect(() => {
    const sidebarKeys = sidebarSections.map(s => s.key);
    const mainKeys = mainSections.map(s => s.key);
    const duplicates = sidebarKeys.filter(key => mainKeys.includes(key));

    if (duplicates.length > 0) {
      console.warn('[Resume Layout] Removing duplicates from main:', duplicates);
      // Keep in sidebar, remove from main
      setMainSections(prev => prev.filter(s => !duplicates.includes(s.key)));
    }
  }, []); // Only on mount

  // Auto-save layout whenever sections change
  useEffect(() => {
    // Validate no duplicates before saving
    const sidebarKeys = sidebarSections.map(s => s.key);
    const mainKeys = mainSections.map(s => s.key);
    const hasDuplicates = sidebarKeys.some(key => mainKeys.includes(key));

    if (hasDuplicates) {
      console.warn('[Resume Layout] Skipping save due to duplicates');
      return;
    }

    const layoutToSave = {
      sidebar: sidebarSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
      main: mainSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
    };
    console.log('[Resume Layout] Saving:', layoutToSave);
    localStorage.setItem('resumeLayout', JSON.stringify(layoutToSave));
  }, [sidebarSections, mainSections]);

  // Combined section order for API (sidebar first, then main) - memoized to prevent infinite loops
  const sectionOrder = useMemo(() => [...sidebarSections, ...mainSections], [sidebarSections, mainSections]);

  // Convert to sections object for API - memoized to prevent infinite loops
  const sections = useMemo(() => sectionOrder.reduce((acc, section) => {
    acc[section.key] = section.enabled;
    return acc;
  }, {}), [sectionOrder]);


  // Track last generated config to detect changes
  const [lastGeneratedConfig, setLastGeneratedConfig] = useState(null);

  // Get current config for comparison
  const getCurrentConfig = () => ({
    template: selectedTemplate,
    sidebarSections: sidebarSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
    mainSections: mainSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
  });

  // Check if current config differs from last generated - memoized to prevent infinite loops
  const canGenerate = useMemo(() => {
    // If no last config saved, we don't know - allow regeneration
    if (!lastGeneratedConfig) return true;
    if (!resumeHtml) return !lastGeneratedConfig;

    const currentConfig = {
      template: selectedTemplate,
      sidebarSections: sidebarSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
      mainSections: mainSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
    };
    return JSON.stringify(currentConfig) !== JSON.stringify(lastGeneratedConfig);
  }, [lastGeneratedConfig, resumeHtml, selectedTemplate, sidebarSections, mainSections]);

  useEffect(() => {
    fetchSavedResume();
  }, []);

  // NOTE: All context sync useEffects removed to fix infinite loop bug.
  // The bi-directional sync between AdminResume and PreviewContext was causing
  // infinite re-render loops. Resume preview in PreviewPanel will use its own state.

  // Note: We no longer sync from context to local state to prevent overwriting
  // the template loaded from the API when navigating between tabs

  // Sync editableHtml when resumeHtml is generated or loaded
  useEffect(() => {
    if (resumeHtml) {
      setEditableHtml(resumeHtml);
    }
  }, [resumeHtml]);

  // Update resumeHtml when editableHtml changes (for preview sync)
  const handleEditableHtmlChange = useCallback((newHtml) => {
    setEditableHtml(newHtml);
  }, []);

  const fetchSavedResume = async () => {
    try {
      const response = await api.get("/profile/resume/status/");
      if (response.data.has_resume) {
        setSavedResume(response.data);
        setApproved(true);
        const htmlResponse = await api.get("/profile/resume/html/");
        if (htmlResponse.data.resume_html) {
          setResumeHtml(htmlResponse.data.resume_html);
          // Also restore the saved template
          if (htmlResponse.data.template) {
            setSelectedTemplate(htmlResponse.data.template);
          }
        }
      }
    } catch (error) {
      console.log("No saved resume found");
    }
  };

  // Fetch resume data for structured editor
  const fetchResumeData = async () => {
    try {
      // Fetch profile data for editing using correct API endpoints
      const [skillsRes, careerRes, educationRes, awardsRes, achievementsRes, homeRes] = await Promise.all([
        api.get("/career/skill/").catch(() => ({ data: [] })),
        api.get("/career/entries/").catch(() => ({ data: [] })),
        api.get("/education/entries/").catch(() => ({ data: [] })),
        api.get("/achievements/awards/").catch(() => ({ data: [] })),
        api.get("/achievements/achievements/").catch(() => ({ data: [] })),
        api.get("/home/").catch(() => ({ data: {} })),
      ]);

      const skills = Array.isArray(skillsRes.data) ? skillsRes.data : (skillsRes.data.results || skillsRes.data.skills || []);
      const career = Array.isArray(careerRes.data) ? careerRes.data : (careerRes.data.careerEntries || careerRes.data.results || []);
      const education = Array.isArray(educationRes.data) ? educationRes.data : (educationRes.data.educationEntries || educationRes.data.results || []);
      const awards = Array.isArray(awardsRes.data) ? awardsRes.data : (awardsRes.data.awards || awardsRes.data.results || []);
      const achievements = Array.isArray(achievementsRes.data) ? achievementsRes.data : (achievementsRes.data.achievements || achievementsRes.data.results || []);

      console.log("Resume data fetched:", { skills, career, education, awards, achievements, home: homeRes.data });

      setResumeData({
        skills: skills.map(s => s.name || s.skill || (typeof s === 'string' ? s : '')).filter(Boolean),
        summary: homeRes.data?.description || homeRes.data?.bio || homeRes.data?.summary || '',
        experience: career.map(c => ({
          title: c.title || c.job_title || c.position || '',
          company: c.company || c.organization || '',
          period: c.year || c.period || c.start_date || '',
          description: c.description || ''
        })),
        education: education.map(e => ({
          degree: e.degree || e.title || e.qualification || '',
          school: e.school || e.institution || e.university || e.college || '',
          year: e.year || e.graduation_year || e.end_year || ''
        })),
        awards: awards.map(a => ({
          title: a.title || a.name || a.award_name || '',
          org: a.organization || a.org || a.issuer || '',
          year: a.year || a.date || ''
        })),
        achievements: achievements.map(a => a.title || a.description || a.achievement || (typeof a === 'string' ? a : ''))
      });
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  // Fetch resume data when switching to edit tab
  useEffect(() => {
    if (activeTab === 'edit' && !resumeData) {
      fetchResumeData();
    }
  }, [activeTab, resumeData]);


  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    if (setResumeGenerating) setResumeGenerating(true);
    setResumeHtml(null);
    setApproved(false);
    try {
      // Get ordered list of enabled sections with their styles
      const orderedSections = sectionOrder
        .filter(s => s.enabled)
        .map(s => s.key);

      // Build section styles object
      const sectionStyles = sectionOrder.reduce((acc, s) => {
        acc[s.key] = s.style || 'default';
        return acc;
      }, {});

      console.log("Generating resume with template:", selectedTemplate);

      // Separate sidebar and main sections for proper column placement
      const sidebarKeys = sidebarSections.filter(s => s.enabled).map(s => s.key);
      const mainKeys = mainSections.filter(s => s.enabled).map(s => s.key);

      const response = await api.post("/profile/resume/generate/", {
        job_description: jobDescription,
        template: selectedTemplate,
        sections: sections,
        section_order: orderedSections,
        section_styles: sectionStyles,
        sidebar_sections: sidebarKeys,
        main_sections: mainKeys
      }, { timeout: 90000 }); // 90 second timeout for AI generation
      console.log("Resume generated successfully");
      if (response.data.resume_html) {
        setResumeHtml(response.data.resume_html);
        setEditableHtml(response.data.resume_html);
        // Update PreviewContext so PreviewPanel shows the new resume
        if (updateResumeData) {
          updateResumeData(response.data.resume_html);
        }

        // Save the config that was used for generation
        setLastGeneratedConfig({
          template: selectedTemplate,
          sidebarSections: sidebarSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
          mainSections: mainSections.map(s => ({ key: s.key, enabled: s.enabled, style: s.style })),
        });

        // Auto-save the generated resume
        try {
          const saveResponse = await api.post("/profile/resume/approve/", {
            resume_html: response.data.resume_html,
            template: selectedTemplate
          });
          if (saveResponse.data.success) {
            setApproved(true);
            setSavedResume(saveResponse.data);
          }
        } catch (saveError) {
          console.error("Auto-save failed:", saveError);
        }
      } else {
        alert("Failed to generate resume.");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error generating resume.");
    } finally {
      setGenerating(false);
      if (setResumeGenerating) setResumeGenerating(false);
    }
  }, [selectedTemplate, jobDescription, sections, sectionOrder, sidebarSections, mainSections, updateResumeData, setResumeGenerating]);

  // Register the generate callback with PreviewContext so PreviewPanel can trigger it
  useEffect(() => {
    if (setResumeGenerateCallback) {
      setResumeGenerateCallback(() => handleGenerate);
    }
    return () => {
      if (setResumeGenerateCallback) {
        setResumeGenerateCallback(null);
      }
    };
  }, [handleGenerate, setResumeGenerateCallback]);

  const handleApprove = async () => {
    try {
      const response = await api.post("/profile/resume/approve/", {
        resume_html: resumeHtml,
        template: selectedTemplate
      });
      if (response.data.success) {
        setApproved(true);
        setSavedResume(response.data);
        alert("Resume saved! Visitors can now download it.");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Error saving resume: " + (error.response?.data?.error || error.message));
    }
  };

  // Helper to process resume HTML - reorder, hide, and move sections between columns
  const processResumeForDownload = (html) => {
    if (!html) return html;

    const sectionMatchers = {
      skills: ['SKILLS', 'Skills', 'Technical Skills', 'Core Skills', 'TECHNICAL SKILLS'],
      education: ['EDUCATION', 'Education', 'Academic Background', 'ACADEMIC'],
      summary: ['PROFESSIONAL SUMMARY', 'Summary', 'Profile', 'About', 'SUMMARY', 'PROFILE'],
      experience: ['PROFESSIONAL EXPERIENCE', 'Experience', 'Work Experience', 'Employment', 'EXPERIENCE', 'WORK EXPERIENCE'],
      awards: ['AWARDS', 'Awards', 'Honors', 'HONORS'],
      achievements: ['ACHIEVEMENTS', 'Achievements', 'Accomplishments', 'ACCOMPLISHMENTS'],
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the two-column containers
    let sidebarContainer = doc.querySelector('.sidebar, .left-column, [class*="sidebar"]');
    let mainContainer = doc.querySelector('.main, .right-column, .main-content, [class*="main"]:not([class*="domain"])');

    // If not found by class, try to find by structure
    if (!sidebarContainer || !mainContainer) {
      const contentSelectors = ['.content', '.columns', '.two-column', '.resume-content', '.body'];
      let contentDiv = null;
      for (const selector of contentSelectors) {
        contentDiv = doc.querySelector(selector);
        if (contentDiv) break;
      }
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
          sidebarContainer = children[0];
          mainContainer = children[1];
        }
      }
    }

    // Find section elements
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="section-title"], [class*="section-header"]');
    const sectionElements = {};

    headings.forEach(heading => {
      const text = heading.textContent.trim().toUpperCase();
      for (const [sectionKey, matchers] of Object.entries(sectionMatchers)) {
        if (matchers.some(m => text.includes(m.toUpperCase()))) {
          let container = heading.parentElement;
          while (container && container !== doc.body) {
            if (container.classList?.contains('section') ||
                (container.tagName === 'DIV' && container.querySelector('.section-title, h2, h3'))) {
              break;
            }
            container = container.parentElement;
          }
          if (!container || container === doc.body) {
            container = heading.parentElement;
          }
          if (container && container !== doc.body) {
            sectionElements[sectionKey] = container;
          }
          break;
        }
      }
    });

    // Hide disabled sections, show enabled ones
    [...sidebarSections, ...mainSections].forEach(section => {
      if (sectionElements[section.key]) {
        sectionElements[section.key].style.display = section.enabled ? '' : 'none';
      }
    });

    // Move sections between containers
    const sidebarKeys = sidebarSections.map(s => s.key);
    const mainKeys = mainSections.map(s => s.key);

    if (sidebarContainer && mainContainer) {
      // Move sections that should be in sidebar
      sidebarKeys.forEach(key => {
        const el = sectionElements[key];
        if (el && !sidebarContainer.contains(el)) {
          try {
            if (!el.contains(sidebarContainer)) {
              sidebarContainer.appendChild(el);
            }
          } catch (e) {
            console.warn('Could not move to sidebar:', e);
          }
        }
      });

      // Move sections that should be in main
      mainKeys.forEach(key => {
        const el = sectionElements[key];
        if (el && !mainContainer.contains(el)) {
          try {
            if (!el.contains(mainContainer)) {
              mainContainer.appendChild(el);
            }
          } catch (e) {
            console.warn('Could not move to main:', e);
          }
        }
      });

      // Reorder within sidebar
      sidebarSections.filter(s => s.enabled).forEach(section => {
        const el = sectionElements[section.key];
        if (el && sidebarContainer.contains(el)) {
          try {
            if (!el.contains(sidebarContainer)) {
              sidebarContainer.appendChild(el);
            }
          } catch (e) {
            console.warn('Could not reorder sidebar section:', e);
          }
        }
      });

      // Reorder within main
      mainSections.filter(s => s.enabled).forEach(section => {
        const el = sectionElements[section.key];
        if (el && mainContainer.contains(el)) {
          try {
            if (!el.contains(mainContainer)) {
              mainContainer.appendChild(el);
            }
          } catch (e) {
            console.warn('Could not reorder main section:', e);
          }
        }
      });
    }

    return doc.documentElement.outerHTML;
  };

  // Apply layout changes to HTML and save without regeneration
  const handleSaveLayoutChanges = async () => {
    if (!resumeHtml) return;

    try {
      // Apply section reordering and visibility to current HTML
      const modifiedHtml = processResumeForDownload(resumeHtml);

      // Save to backend
      await api.put('/profile/resume/update/', {
        resume_html: modifiedHtml
      });

      // Update local state
      setResumeHtml(modifiedHtml);
      if (updateResumeData) updateResumeData(modifiedHtml);

      console.log('[Resume] Layout changes saved successfully');
    } catch (error) {
      console.error('Error saving layout changes:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Use current preview HTML if available, otherwise fetch from server
      let html = resumeHtml;

      if (!html) {
        const response = await api.get("/profile/resume/html/");
        html = response.data.resume_html;
      }

      if (!html) {
        alert("No resume to download. Please generate one first.");
        return;
      }

      // Apply section reordering and visibility
      html = processResumeForDownload(html);

      // Inject print CSS to ensure proper multi-page printing and preserve colors
      const printCSS = `
        <style id="print-override">
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page { size: A4; margin: 8mm; }
            html, body {
              width: 210mm !important;
              height: auto !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .resume, .resume-container, main, article {
              height: auto !important;
              min-height: 0 !important;
              padding-bottom: 0 !important;
              margin-bottom: 0 !important;
            }
            /* Circular profile photo */
            .photo, .profile-photo, .profile-image, img[class*="photo"], img[class*="profile"] {
              border-radius: 50% !important;
              object-fit: cover !important;
            }
            /* Remove empty page spacing */
            .sidebar, .left-column, aside {
              height: auto !important;
              min-height: 0 !important;
            }
            .section { page-break-inside: avoid; }
            /* Prevent blank pages */
            body::after { content: none !important; }
            .resume::after, .container::after { content: none !important; height: 0 !important; }
          }
          /* Also apply circular photo for screen */
          .photo, .profile-photo, .profile-image, img[class*="photo"], img[class*="profile"] {
            border-radius: 50% !important;
            object-fit: cover !important;
          }
        </style>
      `;

      // Inject CSS before </head> or at the end
      if (html.includes('</head>')) {
        html = html.replace('</head>', printCSS + '</head>');
      } else {
        html = html + printCSS;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Please allow popups for this site to download your resume as PDF.");
        return;
      }
      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 300);
      };
      // Fallback for browsers that don't fire onload
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error generating PDF. Please make sure popups are allowed.");
    }
  };

  const handleDownloadDocx = async () => {
    try {
      // Use current preview HTML if available, otherwise fetch from server
      let html = resumeHtml;

      if (!html) {
        try {
          const response = await api.get("/profile/resume/html/");
          html = response.data.resume_html;
        } catch (fetchError) {
          console.log("Couldn't fetch resume HTML from server");
        }
      }

      if (!html) {
        alert("No resume to download. Please generate one first by clicking the Generate button.");
        return;
      }

      // Apply section reordering and visibility
      html = processResumeForDownload(html);

      // Send HTML to backend for DOCX conversion
      const response = await api.post("/profile/resume/download-docx/",
        { html },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Check if response is actually an error (JSON instead of blob)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        alert(json.error || "Error generating document.");
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      if (error.response?.status === 404) {
        alert("No resume available. Please generate one first.");
      } else {
        alert("Error downloading Word document. Please try again.");
      }
    }
  };

  // Edit handlers

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">AI Resume Builder</h1>
        <p className="mt-1 text-gray-600">Generate professional resumes with AI</p>
      </div>

      {/* Status Card */}
      {savedResume && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Resume Active</h3>
                <p className="text-sm text-green-600">Visitors can download from your profile</p>
              </div>
              <button onClick={handleDownloadPDF} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2 shadow-md text-sm">
                <Download size={14} /> PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Tab Navigation */}
        {resumeHtml && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                activeTab === 'builder'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Settings size={18} />
              Builder
            </button>
          </div>
        )}

        {/* Resume Generator Content */}
        {activeTab === 'builder' && (
          <div className="space-y-6">
            {/* Quick Steps Guide */}
            {!resumeHtml && (
              <div className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-600">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#d4a853]">
                  <Sparkles size={20} /> Create Your AI Resume in 3 Steps
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                    <p className="text-sm font-medium text-white">Choose Template</p>
                    <p className="text-xs text-slate-400">Pick your preferred design</p>
                  </div>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                    <p className="text-sm font-medium text-white">Add Job Info</p>
                    <p className="text-xs text-slate-400">Paste job description (optional)</p>
                  </div>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                    <p className="text-sm font-medium text-white">Generate & Save</p>
                    <p className="text-xs text-slate-400">Preview appears on right</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-600 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-600 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Target Job for ATS Optimization</h2>
                  <p className="text-sm text-slate-300">Paste job description to match keywords & beat ATS filters</p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 p-3 bg-amber-900/30 rounded-lg border border-amber-600/50">
                  <p className="text-xs text-amber-200">
                    <strong className="text-amber-400">Pro tip:</strong> Copy the full job posting. Our AI will extract relevant keywords
                    and tailor your resume to match what recruiters and ATS systems are looking for.
                  </p>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here...&#10;&#10;Example: We're looking for a Senior Developer with 5+ years of experience in React, Node.js..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-500 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Resume Layout Modal */}
            {showResumeLayoutModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a]">
                    <div className="flex items-center gap-3">
                      <Edit3 className="w-5 h-5 text-[#d4a853]" />
                      <div>
                        <h2 className="text-lg font-semibold text-[#d4a853]">Resume Layout</h2>
                        <p className="text-sm text-gray-300">Customize sections and styles</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSaveLayoutChanges();
                        setShowResumeLayoutModal(false);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                  {/* Left: Layout Controls */}
                  <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200">
                    {/* Two-column layout with cross-container drag support */}
                    <DndContext
                      collisionDetection={(args) => {
                        const pointerCollisions = pointerWithin(args);
                        if (pointerCollisions.length > 0) return pointerCollisions;
                        return rectIntersection(args);
                      }}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (!over) return;

                        const activeId = String(active.id);
                        const overId = String(over.id);

                        // Extract the actual key from prefixed IDs (e.g., "sidebar-skills" -> "skills")
                        const getKey = (id) => id.replace(/^(sidebar-|main-)/, '');
                        const activeKey = getKey(activeId);
                        const overKey = getKey(overId);

                        const isActiveInSidebar = activeId.startsWith('sidebar-');
                        const isActiveInMain = activeId.startsWith('main-');

                        const isOverSidebarContainer = overId === 'sidebar-container';
                        const isOverMainContainer = overId === 'main-container';
                        const isOverSidebarItem = overId.startsWith('sidebar-') && overId !== 'sidebar-container';
                        const isOverMainItem = overId.startsWith('main-') && overId !== 'main-container';

                        const activeSection = isActiveInSidebar
                          ? sidebarSections.find(s => s.key === activeKey)
                          : mainSections.find(s => s.key === activeKey);

                        if (!activeSection) return;

                        if (isActiveInSidebar && isOverSidebarItem) {
                          setSidebarSections((items) => {
                            const oldIndex = items.findIndex((i) => i.key === activeKey);
                            const newIndex = items.findIndex((i) => i.key === overKey);
                            return arrayMove(items, oldIndex, newIndex);
                          });
                        }
                        else if (isActiveInMain && isOverMainItem) {
                          setMainSections((items) => {
                            const oldIndex = items.findIndex((i) => i.key === activeKey);
                            const newIndex = items.findIndex((i) => i.key === overKey);
                            return arrayMove(items, oldIndex, newIndex);
                          });
                        }
                        else if (isActiveInSidebar && (isOverMainContainer || isOverMainItem)) {
                          setSidebarSections(prev => prev.filter(s => s.key !== activeKey));
                          setMainSections(prev => {
                            if (isOverMainItem) {
                              const overIndex = prev.findIndex(s => s.key === overKey);
                              const newItems = [...prev];
                              newItems.splice(overIndex, 0, activeSection);
                              return newItems;
                            }
                            return [...prev, activeSection];
                          });
                        }
                        else if (isActiveInMain && (isOverSidebarContainer || isOverSidebarItem)) {
                          setMainSections(prev => prev.filter(s => s.key !== activeKey));
                          setSidebarSections(prev => {
                            if (isOverSidebarItem) {
                              const overIndex = prev.findIndex(s => s.key === overKey);
                              const newItems = [...prev];
                              newItems.splice(overIndex, 0, activeSection);
                              return newItems;
                            }
                            return [...prev, activeSection];
                          });
                        }
                      }}
                    >
                    <div className="flex gap-3">
                      {/* Left Sidebar Column */}
                      <div className="w-1/3">
                        <DroppableColumn id="sidebar-container" className="bg-slate-800 rounded-lg p-3 h-full min-h-[200px]">
                          <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Sidebar</h4>
                          <SortableContext items={sidebarSections.map(s => `sidebar-${s.key}`)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                              {sidebarSections.map((section) => (
                                <SortableSectionItem
                                  key={section.key}
                                  sortableId={`sidebar-${section.key}`}
                                  section={section}
                                  isEnabled={section.enabled}
                                  compact={true}
                                  styleOptions={sectionStyleOptions[section.key]}
                                  onToggle={() => {
                                    setSidebarSections((prev) =>
                                      prev.map((s) =>
                                        s.key === section.key ? { ...s, enabled: !s.enabled } : s
                                      )
                                    );
                                  }}
                                  onStyleChange={(styleId) => {
                                    setSidebarSections((prev) =>
                                      prev.map((s) =>
                                        s.key === section.key ? { ...s, style: styleId } : s
                                      )
                                    );
                                  }}
                                />
                              ))}
                              {sidebarSections.length === 0 && (
                                <div className="text-slate-500 text-xs text-center py-4 border-2 border-dashed border-slate-600 rounded-lg">
                                  Drop sections here
                                </div>
                              )}
                            </div>
                          </SortableContext>
                        </DroppableColumn>
                      </div>

                      {/* Right Main Content Column */}
                      <div className="w-2/3">
                        <DroppableColumn id="main-container" className="bg-gray-50 rounded-lg p-3 border border-gray-200 min-h-[200px]">
                          <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Main Content</h4>
                          <SortableContext items={mainSections.map(s => `main-${s.key}`)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                              {mainSections.map((section) => (
                                <SortableSectionItem
                                  key={section.key}
                                  sortableId={`main-${section.key}`}
                                  section={section}
                                  isEnabled={section.enabled}
                                  compact={true}
                                  styleOptions={sectionStyleOptions[section.key]}
                                  onToggle={() => {
                                    setMainSections((prev) =>
                                      prev.map((s) =>
                                        s.key === section.key ? { ...s, enabled: !s.enabled } : s
                                      )
                                    );
                                  }}
                                  onStyleChange={(styleId) => {
                                    setMainSections((prev) =>
                                      prev.map((s) =>
                                        s.key === section.key ? { ...s, style: styleId } : s
                                      )
                                    );
                                  }}
                                />
                              ))}
                              {mainSections.length === 0 && (
                                <div className="text-gray-400 text-xs text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                  Drop sections here
                                </div>
                              )}
                            </div>
                          </SortableContext>
                        </DroppableColumn>
                      </div>
                    </div>
                    </DndContext>

                    {/* Missing Sections - Add back if accidentally removed */}
                    {(() => {
                      const allKeys = ['skills', 'education', 'summary', 'experience', 'awards', 'achievements'];
                      const usedKeys = [...sidebarSections.map(s => s.key), ...mainSections.map(s => s.key)];
                      const missingKeys = allKeys.filter(k => !usedKeys.includes(k));
                      if (missingKeys.length === 0) return null;
                      return (
                        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-700 mb-2">Missing sections (click to add):</p>
                          <div className="flex flex-wrap gap-1">
                            {missingKeys.map(key => (
                              <button
                                key={key}
                                onClick={() => {
                                  const newSection = {
                                    key,
                                    enabled: true,
                                    style: key === 'skills' ? 'chips' : key === 'education' ? 'cards' : 'paragraph',
                                    icon: sectionIcons[key],
                                    label: sectionLabels[key],
                                  };
                                  setMainSections(prev => [...prev, newSection]);
                                }}
                                className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 rounded transition-colors"
                              >
                                + {sectionLabels[key]}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Click to toggle visibility • Drag to reorder
                    </p>

                    {/* Auto-save notice */}
                    {resumeHtml && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-700">
                          Layout changes are applied automatically when you close this panel.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Dynamic Layout Preview */}
                  <div className="w-1/2 p-4 bg-gray-50 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center justify-between">
                      <span>Live Preview</span>
                      <span className="text-xs font-normal text-gray-400">Updates as you customize</span>
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <DynamicLayoutPreview
                        sidebarSections={sidebarSections}
                        mainSections={mainSections}
                        templateId={selectedTemplate}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      This preview uses sample data. Your actual resume will use your profile information.
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status shown after generation */}
            {resumeHtml && !generating && (
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <Check size={18} />
                    <span className="font-medium">Resume Generated</span>
                  </div>
                  <button
                    onClick={() => setShowFullPreview(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Eye size={14} />
                    Full Preview
                  </button>
                </div>
                <p className="text-xs text-slate-300">View your resume preview on the right panel. Use the Generate button there to regenerate.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Full Page Preview Modal */}
      <FullPagePreviewModal
        isOpen={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        resumeHtml={resumeHtml}
        title="Resume Full Preview"
      />
    </div>
  );
};

export default AdminResume;
