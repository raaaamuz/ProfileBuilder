/**
 * Shared Resume Template Configuration
 * Used by both admin builder and public view for consistent styling
 */

// Template color definitions
export const templateColors = {
  professional: { primary: "#1a365d", secondary: "#3182ce", accent: "#90cdf4", bg: "#f7fafc" },
  modern: { primary: "#5b21b6", secondary: "#7c3aed", accent: "#c4b5fd", bg: "#faf5ff" },
  minimal: { primary: "#1f2937", secondary: "#4b5563", accent: "#9ca3af", bg: "#ffffff" },
  "ats-friendly": { primary: "#000000", secondary: "#333333", accent: "#666666", bg: "#ffffff" },
  academic: { primary: "#1e3a5f", secondary: "#2563eb", accent: "#93c5fd", bg: "#ffffff" },
  executive: { primary: "#111827", secondary: "#d97706", accent: "#fbbf24", bg: "#1f2937" },
  creative: { primary: "#0d9488", secondary: "#14b8a6", accent: "#5eead4", bg: "#f0fdfa" },
  tech: { primary: "#0f172a", secondary: "#22c55e", accent: "#86efac", bg: "#020617" },
  elegant: { primary: "#1e1b4b", secondary: "#c084fc", accent: "#e9d5ff", bg: "#faf5ff" },
  corporate: { primary: "#0c4a6e", secondary: "#0284c7", accent: "#7dd3fc", bg: "#f0f9ff" },
  bold: { primary: "#dc2626", secondary: "#f87171", accent: "#fecaca", bg: "#fef2f2" },
  nature: { primary: "#166534", secondary: "#22c55e", accent: "#bbf7d0", bg: "#f0fdf4" },
  midnight: { primary: "#020617", secondary: "#6366f1", accent: "#a5b4fc", bg: "#0f172a" },
  sunset: { primary: "#9a3412", secondary: "#f97316", accent: "#fed7aa", bg: "#fff7ed" },
  swiss: { primary: "#000000", secondary: "#dc2626", accent: "#fca5a5", bg: "#ffffff" },
  nordic: { primary: "#374151", secondary: "#6b7280", accent: "#d1d5db", bg: "#f9fafb" },
  paper: { primary: "#292524", secondary: "#78716c", accent: "#d6d3d1", bg: "#fafaf9" },
  mono: { primary: "#18181b", secondary: "#52525b", accent: "#a1a1aa", bg: "#ffffff" },
  classic: { primary: "#1e3a5f", secondary: "#3b82f6", accent: "#bfdbfe", bg: "#ffffff" },
  "developer-pro": { primary: "#0f172a", secondary: "#1e293b", accent: "#6366f1", bg: "#f8fafc" },
};

// Template layout types
export const templateLayouts = {
  professional: "two-column",
  modern: "two-column",
  minimal: "single-column",
  "ats-friendly": "single-column",
  academic: "academic",
  executive: "two-column",
  creative: "two-column",
  tech: "two-column",
  elegant: "header-focused",
  corporate: "two-column",
  bold: "header-focused",
  nature: "two-column",
  midnight: "two-column",
  sunset: "single-column",
  swiss: "single-column",
  nordic: "single-column",
  paper: "single-column",
  mono: "single-column",
  classic: "two-column",
  "developer-pro": "sidebar-left",
};

// Dark theme templates (need light text)
export const darkThemeTemplates = ["executive", "midnight", "tech", "elegant"];

/**
 * Get colors for a template
 * @param {string} templateId - Template identifier
 * @returns {object} Color configuration { primary, secondary, accent, bg }
 */
export const getTemplateColors = (templateId) => {
  return templateColors[templateId] || templateColors.professional;
};

/**
 * Get layout type for a template
 * @param {string} templateId - Template identifier
 * @returns {string} Layout type
 */
export const getTemplateLayout = (templateId) => {
  return templateLayouts[templateId] || "two-column";
};

/**
 * Check if template uses dark theme
 * @param {string} templateId - Template identifier
 * @returns {boolean}
 */
export const isDarkTheme = (templateId) => {
  return darkThemeTemplates.includes(templateId);
};

/**
 * Get computed styles for a template (used in resume rendering)
 * @param {string} templateId - Template identifier
 * @returns {object} Computed style object
 */
export const getTemplateStyles = (templateId) => {
  const colors = getTemplateColors(templateId);
  const isDark = isDarkTheme(templateId);

  // Base styles for all templates
  const baseStyles = {
    headerBg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    headerText: "#ffffff",
    sidebarBg: colors.bg,
    mainBg: "#ffffff",
    headingColor: colors.primary,
    accentColor: colors.secondary,
    textColor: "#374151",
    subtextColor: "#6b7280",
    borderColor: colors.accent,
  };

  // Dark theme overrides
  if (isDark) {
    return {
      ...baseStyles,
      headerBg: colors.primary,
      headerText: colors.accent,
      sidebarBg: colors.bg,
      mainBg: colors.bg,
      headingColor: colors.accent,
      textColor: "#e5e7eb",
      subtextColor: "#9ca3af",
    };
  }

  // Minimal/clean theme overrides
  if (["minimal", "swiss", "nordic", "paper", "mono", "ats-friendly"].includes(templateId)) {
    return {
      ...baseStyles,
      headerBg: "#ffffff",
      headerText: colors.primary,
      sidebarBg: "#f9fafb",
    };
  }

  // Developer-pro special case
  if (templateId === "developer-pro") {
    return {
      ...baseStyles,
      headerBg: "transparent",
      headerText: "#ffffff",
      sidebarBg: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      sidebarText: "#f8fafc",
      sidebarSubtext: "#94a3b8",
      headingColor: colors.accent,
      accentColor: colors.accent,
    };
  }

  return baseStyles;
};

export default {
  templateColors,
  templateLayouts,
  darkThemeTemplates,
  getTemplateColors,
  getTemplateLayout,
  isDarkTheme,
  getTemplateStyles,
};
