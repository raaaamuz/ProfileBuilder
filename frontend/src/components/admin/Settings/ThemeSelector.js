import React from 'react';
import { useTheme, themes } from '../../../context/ThemeContext';
import { FiCheck, FiSun, FiMoon, FiDroplet, FiRefreshCw } from 'react-icons/fi';

const ThemeSelector = () => {
  const { currentTheme, setTheme, theme, updateCustomColor, resetCustomColors, customColors } = useTheme();

  const themeIcons = {
    light: <FiSun className="w-5 h-5" />,
    dark: <FiMoon className="w-5 h-5" />,
    ocean: '🌊',
    forest: '🌲',
    sunset: '🌅',
    purple: '👑',
    rose: '🌸',
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
            <FiDroplet className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Choose Theme</h3>
            <p className="text-sm text-gray-500">Select a pre-built theme for your website</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(themes).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                currentTheme === t.id
                  ? 'border-blue-500 shadow-lg shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: t.colors.background }}
            >
              {/* Theme Preview */}
              <div className="space-y-2">
                {/* Header preview */}
                <div
                  className="h-8 rounded-lg flex items-center px-2 gap-1"
                  style={{ backgroundColor: t.colors.sidebarBg }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: t.colors.primary }}
                  />
                  <div
                    className="flex-1 h-1.5 rounded"
                    style={{ backgroundColor: t.colors.sidebarText, opacity: 0.3 }}
                  />
                </div>

                {/* Content preview */}
                <div className="flex gap-2">
                  <div
                    className="w-1/3 h-12 rounded-lg"
                    style={{ backgroundColor: t.colors.primary }}
                  />
                  <div className="flex-1 space-y-1.5">
                    <div
                      className="h-2 rounded w-full"
                      style={{ backgroundColor: t.colors.text, opacity: 0.2 }}
                    />
                    <div
                      className="h-2 rounded w-3/4"
                      style={{ backgroundColor: t.colors.text, opacity: 0.1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Name */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{themeIcons[t.id]}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: t.colors.text }}
                  >
                    {t.name}
                  </span>
                </div>
                {currentTheme === t.id && (
                  <div className="p-1 bg-blue-500 rounded-full">
                    <FiCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Adjustments */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
              <span className="text-lg">🎨</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Customize Colors</h3>
              <p className="text-sm text-gray-500">Fine-tune the selected theme</p>
            </div>
          </div>
          {Object.keys(customColors).length > 0 && (
            <button
              onClick={resetCustomColors}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Color */}
          <ColorPicker
            label="Primary Color"
            description="Buttons, links, accents"
            value={theme.colors.primary}
            onChange={(value) => updateCustomColor('primary', value)}
          />

          {/* Background Color */}
          <ColorPicker
            label="Background"
            description="Page background"
            value={theme.colors.background}
            onChange={(value) => updateCustomColor('background', value)}
          />

          {/* Text Color */}
          <ColorPicker
            label="Text Color"
            description="Main text color"
            value={theme.colors.text}
            onChange={(value) => updateCustomColor('text', value)}
          />

          {/* Sidebar Color */}
          <ColorPicker
            label="Sidebar"
            description="Navigation sidebar"
            value={theme.colors.sidebarBg}
            onChange={(value) => updateCustomColor('sidebarBg', value)}
          />

          {/* Card Background */}
          <ColorPicker
            label="Card Background"
            description="Cards and panels"
            value={theme.colors.cardBg}
            onChange={(value) => updateCustomColor('cardBg', value)}
          />

          {/* Accent Color */}
          <ColorPicker
            label="Accent Color"
            description="Highlights and badges"
            value={theme.colors.accent}
            onChange={(value) => updateCustomColor('accent', value)}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <span className="text-lg">👁️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-500">See how your theme looks</p>
          </div>
        </div>

        {/* Preview Card */}
        <div
          className="rounded-xl overflow-hidden border"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          }}
        >
          {/* Preview Header */}
          <div
            className="p-4 flex items-center gap-3"
            style={{ backgroundColor: theme.colors.sidebarBg }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div className="flex-1">
              <div
                className="h-3 w-24 rounded"
                style={{ backgroundColor: theme.colors.sidebarText }}
              />
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6" style={{ backgroundColor: theme.colors.background }}>
            <div
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}
            >
              <h4
                className="text-lg font-semibold mb-2"
                style={{ color: theme.colors.text }}
              >
                Sample Card Title
              </h4>
              <p
                className="text-sm mb-4"
                style={{ color: theme.colors.textMuted }}
              >
                This is how your content will appear with the current theme settings.
              </p>
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Primary Button
              </button>
            </div>

            <div className="flex gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: theme.colors.accent + '20',
                  color: theme.colors.accent,
                }}
              >
                Badge
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: theme.colors.success + '20',
                  color: theme.colors.success,
                }}
              >
                Success
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
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
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors"
            style={{ padding: 0 }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm font-mono bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ThemeSelector;
