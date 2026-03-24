import React from 'react';

/**
 * Segmented Control / Pill Tabs Component
 * Reusable tab navigation with consistent dark theme styling
 *
 * @param {Array} tabs - Array of tab objects: { id, label, icon: LucideIcon, badge?: number }
 * @param {string} activeTab - Currently active tab id
 * @param {function} onTabChange - Callback when tab is clicked
 * @param {object} badges - Optional object with tab id as key and badge count as value { tabId: count }
 */
const TabNavigation = ({ tabs, activeTab, onTabChange, badges = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.25rem',
        marginBottom: '1.25rem',
        backgroundColor: '#0f172a',
        padding: '0.25rem',
        borderRadius: '0.375rem',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badgeCount = badges[tab.id];
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isActive ? '#6366f1' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            {Icon && <Icon size={16} />}
            <span>{tab.label}</span>
            {badgeCount > 0 && (
              <span
                style={{
                  marginLeft: '0.25rem',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(100, 116, 139, 0.2)',
                }}
              >
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
