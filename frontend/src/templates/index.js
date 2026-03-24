/**
 * Template Registry
 * Central loader for all portfolio templates
 */

import MinimalTemplate from './minimal';
import CyberTemplate from './cyber';
import GlassTemplate from './glass';
import GradientTemplate from './gradient';
import ClassicTemplate from './classic';
import DeveloperTemplate from './developer';

// All available templates
export const templates = {
  minimal: MinimalTemplate,
  cyber: CyberTemplate,
  glass: GlassTemplate,
  gradient: GradientTemplate,
  classic: ClassicTemplate,
  developer: DeveloperTemplate,
};

// Template metadata for gallery display
export const templateList = [
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean design with lots of whitespace',
    category: 'minimalist',
    preview: {
      bg: '#f9fafb',
      accent: '#6b7280',
      text: '#111827',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber Dark',
    description: 'Bold dark theme with neon accents',
    category: 'dark',
    preview: {
      bg: '#030712',
      accent: '#00ff88',
      text: '#ffffff',
    },
  },
  {
    id: 'glass',
    name: 'Glass Futuristic',
    description: 'Modern glassmorphism with blur effects',
    category: 'glassmorphism',
    preview: {
      bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
      accent: '#00ff88',
      text: '#ffffff',
    },
  },
  {
    id: 'gradient',
    name: 'Gradient Bold',
    description: 'Bold gradients with split layouts',
    category: 'gradient',
    preview: {
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      accent: '#ffffff',
      text: '#ffffff',
    },
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional professional design',
    category: 'professional',
    preview: {
      bg: '#f3f4f6',
      accent: '#c9a227',
      text: '#1e3a5f',
    },
  },
  {
    id: 'developer',
    name: 'Developer Portfolio',
    description: 'Split-screen layout with fixed sidebar, terminal aesthetics',
    category: 'developer',
    layout: 'split-fixed',
    preview: {
      bg: '#0a192f',
      accent: '#64ffda',
      text: '#ccd6f6',
    },
  },
];

// Get template by ID
export const getTemplate = (templateId) => {
  return templates[templateId] || templates.minimal;
};

// Get component for a specific section
export const getTemplateComponent = (templateId, section) => {
  const template = getTemplate(templateId);
  const componentMap = {
    profile: template.Profile,
    education: template.Education,
    career: template.Career,
    skills: template.Skills,
    awards: template.Awards,
    services: template.Services,
    testimonials: template.Testimonials,
    layout: template.Layout,
  };
  return componentMap[section];
};

// Get all templates by category
export const getTemplatesByCategory = (category) => {
  if (!category || category === 'all') return templateList;
  return templateList.filter(t => t.category === category);
};

// Available categories
export const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'dark', name: 'Dark' },
  { id: 'glassmorphism', name: 'Glass' },
  { id: 'gradient', name: 'Gradient' },
  { id: 'professional', name: 'Professional' },
  { id: 'developer', name: 'Developer' },
];

// Get template layout type (standard, split-fixed, etc.)
export const getTemplateLayout = (templateId) => {
  const template = getTemplate(templateId);
  return template?.layout || 'standard';
};

// Check if template has a special layout wrapper
export const hasLayoutWrapper = (templateId) => {
  const template = getTemplate(templateId);
  return !!template?.Layout;
};

export default templates;
