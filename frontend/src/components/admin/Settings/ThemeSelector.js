import React from 'react';
import { useTheme, themes } from '../../../context/ThemeContext';
import { Sun, Moon, Droplets, Check, RefreshCw, Palette, Eye } from 'lucide-react';

// Dark theme colors matching Settings.js
const darkTheme = {
  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  accent: '#6366f1',
  border: '#334155',
};

const ThemeSelector = () => {
  const { currentTheme, setTheme, theme, updateCustomColor, resetCustomColors, customColors } = useTheme();

  const themeIcons = {
    light: <Sun size={18} />,
    dark: <Moon size={18} />,
    ocean: '🌊',
    forest: '🌲',
    sunset: '🌅',
    purple: '👑',
    rose: '🌸',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Theme Selection */}
      <div style={{
        backgroundColor: darkTheme.bgSecondary,
        borderRadius: '1rem',
        padding: '1.5rem',
        border: `1px solid ${darkTheme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderRadius: '0.75rem'
          }}>
            <Droplets size={20} style={{ color: darkTheme.accent }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: darkTheme.textPrimary, margin: 0 }}>
              Choose Theme
            </h3>
            <p style={{ fontSize: '0.875rem', color: darkTheme.textSecondary, margin: 0 }}>
              Select a pre-built theme for your website
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1rem'
        }}>
          {Object.values(themes).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                position: 'relative',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: currentTheme === t.id
                  ? `2px solid ${darkTheme.accent}`
                  : `2px solid ${darkTheme.border}`,
                backgroundColor: t.colors.background,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: currentTheme === t.id ? `0 0 20px ${darkTheme.accent}30` : 'none',
              }}
            >
              {/* Theme Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Header preview */}
                <div
                  style={{
                    height: '2rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 0.5rem',
                    gap: '0.25rem',
                    backgroundColor: t.colors.sidebarBg,
                  }}
                >
                  <div
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      backgroundColor: t.colors.primary,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: '0.375rem',
                      borderRadius: '0.25rem',
                      backgroundColor: t.colors.sidebarText,
                      opacity: 0.3,
                    }}
                  />
                </div>

                {/* Content preview */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '33%',
                      height: '3rem',
                      borderRadius: '0.5rem',
                      backgroundColor: t.colors.primary,
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div
                      style={{
                        height: '0.5rem',
                        borderRadius: '0.25rem',
                        width: '100%',
                        backgroundColor: t.colors.text,
                        opacity: 0.2,
                      }}
                    />
                    <div
                      style={{
                        height: '0.5rem',
                        borderRadius: '0.25rem',
                        width: '75%',
                        backgroundColor: t.colors.text,
                        opacity: 0.1,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Name */}
              <div style={{
                marginTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{themeIcons[t.id]}</span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: t.colors.text,
                    }}
                  >
                    {t.name}
                  </span>
                </div>
                {currentTheme === t.id && (
                  <div style={{
                    padding: '0.25rem',
                    backgroundColor: darkTheme.accent,
                    borderRadius: '50%'
                  }}>
                    <Check size={12} style={{ color: 'white' }} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Adjustments */}
      <div style={{
        backgroundColor: darkTheme.bgSecondary,
        borderRadius: '1rem',
        padding: '1.5rem',
        border: `1px solid ${darkTheme.border}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '0.75rem'
            }}>
              <Palette size={20} style={{ color: darkTheme.accent }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: darkTheme.textPrimary, margin: 0 }}>
                Customize Colors
              </h3>
              <p style={{ fontSize: '0.875rem', color: darkTheme.textSecondary, margin: 0 }}>
                Fine-tune the selected theme
              </p>
            </div>
          </div>
          {Object.keys(customColors).length > 0 && (
            <button
              onClick={resetCustomColors}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: darkTheme.textSecondary,
                backgroundColor: darkTheme.bgTertiary,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} />
              Reset
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <ColorPicker
            label="Primary Color"
            description="Buttons, links, accents"
            value={theme.colors.primary}
            onChange={(value) => updateCustomColor('primary', value)}
          />
          <ColorPicker
            label="Background"
            description="Page background"
            value={theme.colors.background}
            onChange={(value) => updateCustomColor('background', value)}
          />
          <ColorPicker
            label="Text Color"
            description="Main text color"
            value={theme.colors.text}
            onChange={(value) => updateCustomColor('text', value)}
          />
          <ColorPicker
            label="Sidebar"
            description="Navigation sidebar"
            value={theme.colors.sidebarBg}
            onChange={(value) => updateCustomColor('sidebarBg', value)}
          />
          <ColorPicker
            label="Card Background"
            description="Cards and panels"
            value={theme.colors.cardBg}
            onChange={(value) => updateCustomColor('cardBg', value)}
          />
          <ColorPicker
            label="Accent Color"
            description="Highlights and badges"
            value={theme.colors.accent}
            onChange={(value) => updateCustomColor('accent', value)}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div style={{
        backgroundColor: darkTheme.bgSecondary,
        borderRadius: '1rem',
        padding: '1.5rem',
        border: `1px solid ${darkTheme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '0.75rem'
          }}>
            <Eye size={20} style={{ color: '#10b981' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: darkTheme.textPrimary, margin: 0 }}>
              Live Preview
            </h3>
            <p style={{ fontSize: '0.875rem', color: darkTheme.textSecondary, margin: 0 }}>
              See how your theme looks
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <div
          style={{
            borderRadius: '0.75rem',
            overflow: 'hidden',
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
          }}
        >
          {/* Preview Header */}
          <div
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: theme.colors.sidebarBg,
            }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: '0.75rem',
                  width: '6rem',
                  borderRadius: '0.25rem',
                  backgroundColor: theme.colors.sidebarText,
                }}
              />
            </div>
          </div>

          {/* Preview Content */}
          <div style={{ padding: '1.5rem', backgroundColor: theme.colors.background }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                backgroundColor: theme.colors.cardBg,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: theme.colors.text,
                }}
              >
                Sample Card Title
              </h4>
              <p
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  color: theme.colors.textMuted,
                }}
              >
                This is how your content will appear with the current theme settings.
              </p>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: theme.colors.primary,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Primary Button
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: theme.colors.accent + '20',
                  color: theme.colors.accent,
                }}
              >
                Badge
              </span>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: theme.colors.success + '20',
                  color: theme.colors.success,
                }}
              >
                Success
              </span>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  backgroundColor: theme.colors.error + '20',
                  color: theme.colors.error,
                }}
              >
                Error
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ label, description, value, onChange }) => {
  return (
    <div style={{
      backgroundColor: darkTheme.bgTertiary,
      borderRadius: '0.75rem',
      padding: '1rem',
      border: `1px solid ${darkTheme.border}`
    }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: darkTheme.textPrimary, margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: '0.75rem', color: darkTheme.textSecondary, margin: 0 }}>
          {description}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            border: `2px solid ${darkTheme.border}`,
            padding: 0,
            backgroundColor: 'transparent',
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            backgroundColor: darkTheme.bgSecondary,
            border: `1px solid ${darkTheme.border}`,
            borderRadius: '0.5rem',
            color: darkTheme.textPrimary,
            outline: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ThemeSelector;
