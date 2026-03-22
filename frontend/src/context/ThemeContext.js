import React, { createContext, useState, useContext, useEffect } from 'react';

// Pre-defined themes
export const themes = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      backgroundAlt: '#f3f4f6',
      surface: '#ffffff',
      surfaceHover: '#f9fafb',
      text: '#1f2937',
      textMuted: '#6b7280',
      textLight: '#9ca3af',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#1f2937',
      sidebarText: '#ffffff',
      sidebarHover: '#374151',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#9ca3af',
      accent: '#fbbf24',
      background: '#111827',
      backgroundAlt: '#1f2937',
      surface: '#1f2937',
      surfaceHover: '#374151',
      text: '#f9fafb',
      textMuted: '#9ca3af',
      textLight: '#6b7280',
      border: '#374151',
      borderLight: '#4b5563',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      cardBg: '#1f2937',
      sidebarBg: '#0f172a',
      sidebarText: '#f1f5f9',
      sidebarHover: '#1e293b',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#f0f9ff',
      backgroundAlt: '#e0f2fe',
      surface: '#ffffff',
      surfaceHover: '#f0f9ff',
      text: '#0c4a6e',
      textMuted: '#475569',
      textLight: '#94a3b8',
      border: '#bae6fd',
      borderLight: '#e0f2fe',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#0c4a6e',
      sidebarText: '#f0f9ff',
      sidebarHover: '#075985',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Poppins, system-ui, sans-serif',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    colors: {
      primary: '#22c55e',
      primaryHover: '#16a34a',
      secondary: '#6b7280',
      accent: '#84cc16',
      background: '#f0fdf4',
      backgroundAlt: '#dcfce7',
      surface: '#ffffff',
      surfaceHover: '#f0fdf4',
      text: '#14532d',
      textMuted: '#4b5563',
      textLight: '#9ca3af',
      border: '#bbf7d0',
      borderLight: '#dcfce7',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#14532d',
      sidebarText: '#f0fdf4',
      sidebarHover: '#166534',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Merriweather, serif',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#78716c',
      accent: '#eab308',
      background: '#fffbeb',
      backgroundAlt: '#fef3c7',
      surface: '#ffffff',
      surfaceHover: '#fffbeb',
      text: '#78350f',
      textMuted: '#57534e',
      textLight: '#a8a29e',
      border: '#fed7aa',
      borderLight: '#fef3c7',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#78350f',
      sidebarText: '#fffbeb',
      sidebarHover: '#92400e',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Playfair Display, serif',
    },
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#6b7280',
      accent: '#a855f7',
      background: '#faf5ff',
      backgroundAlt: '#f3e8ff',
      surface: '#ffffff',
      surfaceHover: '#faf5ff',
      text: '#3b0764',
      textMuted: '#6b7280',
      textLight: '#9ca3af',
      border: '#e9d5ff',
      borderLight: '#f3e8ff',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#3b0764',
      sidebarText: '#faf5ff',
      sidebarHover: '#581c87',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Raleway, sans-serif',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    colors: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      secondary: '#6b7280',
      accent: '#f472b6',
      background: '#fdf2f8',
      backgroundAlt: '#fce7f3',
      surface: '#ffffff',
      surfaceHover: '#fdf2f8',
      text: '#831843',
      textMuted: '#6b7280',
      textLight: '#9ca3af',
      border: '#fbcfe8',
      borderLight: '#fce7f3',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      cardBg: '#ffffff',
      sidebarBg: '#831843',
      sidebarText: '#fdf2f8',
      sidebarHover: '#9d174d',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      heading: 'Quicksand, sans-serif',
    },
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Load theme from localStorage or default to 'light'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved && themes[saved] ? saved : 'light';
  });

  // Custom overrides for the current theme
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('app-custom-colors');
    return saved ? JSON.parse(saved) : {};
  });

  // Get the active theme with any custom overrides
  const theme = {
    ...themes[currentTheme],
    colors: {
      ...themes[currentTheme].colors,
      ...customColors,
    },
  };

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  // Save custom colors to localStorage
  useEffect(() => {
    localStorage.setItem('app-custom-colors', JSON.stringify(customColors));
  }, [customColors]);

  // Apply CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
  }, [theme]);

  const setTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
      setCustomColors({}); // Reset custom colors when switching themes
    }
  };

  const updateCustomColor = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const resetCustomColors = () => {
    setCustomColors({});
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themes,
      currentTheme,
      setTheme,
      customColors,
      updateCustomColor,
      resetCustomColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
