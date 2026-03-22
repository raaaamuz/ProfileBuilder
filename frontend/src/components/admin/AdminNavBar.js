import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiLink } from 'react-icons/fi';

const navLinks = [
  { path: '/home', label: 'Home', icon: <FiHome /> },
  { path: '/settings', label: 'Settings', icon: <FiSettings /> },
  { path: '/social', label: 'Social', icon: <FiLink /> },
];

const AdminNavbar = () => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderRadius: '0.25rem',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    fontSize: '1.125rem',
    color: '#D1D5DB',
    textDecoration: 'none'
  };

  const activeStyle = {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontWeight: '600',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  return (
    <nav
      style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#1e293b',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        zIndex: 100
      }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Admin Panel</h2>
      </div>

      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end
                style={({ isActive }) => ({
                  ...baseStyle,
                  ...(isActive ? activeStyle : {})
                })}
              >
                <span style={{ marginRight: '0.75rem' }}>{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>© 2025</p>
      </div>
    </nav>
  );
};

export default AdminNavbar;
