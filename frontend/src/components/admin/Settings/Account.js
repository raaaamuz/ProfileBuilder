import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  FileCheck,
  UserCircle,
  LogOut,
} from "lucide-react";
import api from "../../../services/api";

const Account = () => {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/users/account/")
      .then(res => {
        setAccountInfo(res.data);
      })
      .catch(err => {
        console.error("Error fetching account info:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const theme = {
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    accent: '#6366f1',
    border: '#334155',
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: theme.accent, borderRadius: '1rem' }}>
            <UserCircle style={{ width: '2rem', height: '2rem', color: '#ffffff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>Account</h1>
            <p style={{ color: theme.textSecondary, margin: 0, fontSize: '0.875rem' }}>Your account information and status</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ width: '3rem', height: '3rem', border: `4px solid ${theme.bgTertiary}`, borderTopColor: theme.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : accountInfo ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* User Info Card */}
          <div style={{ backgroundColor: theme.bgSecondary, borderRadius: '1rem', padding: '1.5rem', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '4rem', height: '4rem', backgroundColor: theme.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: theme.textPrimary, margin: 0 }}>
                  {accountInfo.full_name || accountInfo.username}
                </h2>
                <p style={{ color: theme.textSecondary, margin: 0 }}>@{accountInfo.username}</p>
              </div>
              {accountInfo.is_verified ? (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e', fontSize: '0.875rem' }}>
                  <CheckCircle size={16} /> Verified
                </span>
              ) : (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem' }}>
                  <XCircle size={16} /> Not Verified
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: theme.bgTertiary, borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Mail size={16} style={{ color: theme.textSecondary }} />
                  <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Email</span>
                </div>
                <p style={{ color: theme.textPrimary, margin: 0, fontWeight: '500' }}>{accountInfo.email}</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: theme.bgTertiary, borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Calendar size={16} style={{ color: theme.textSecondary }} />
                  <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Registered</span>
                </div>
                <p style={{ color: theme.textPrimary, margin: 0, fontWeight: '500' }}>{formatDate(accountInfo.date_joined)}</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: theme.bgTertiary, borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Calendar size={16} style={{ color: theme.textSecondary }} />
                  <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Last Login</span>
                </div>
                <p style={{ color: theme.textPrimary, margin: 0, fontWeight: '500' }}>{formatDate(accountInfo.last_login)}</p>
              </div>

              {accountInfo.profile?.phone && (
                <div style={{ padding: '1rem', backgroundColor: theme.bgTertiary, borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Phone size={16} style={{ color: theme.textSecondary }} />
                    <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Phone</span>
                  </div>
                  <p style={{ color: theme.textPrimary, margin: 0, fontWeight: '500' }}>{accountInfo.profile.phone}</p>
                </div>
              )}

              {accountInfo.profile?.location && (
                <div style={{ padding: '1rem', backgroundColor: theme.bgTertiary, borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <MapPin size={16} style={{ color: theme.textSecondary }} />
                    <span style={{ fontSize: '0.75rem', color: theme.textSecondary }}>Location</span>
                  </div>
                  <p style={{ color: theme.textPrimary, margin: 0, fontWeight: '500' }}>{accountInfo.profile.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Status */}
          <div style={{ backgroundColor: theme.bgSecondary, borderRadius: '1rem', padding: '1.5rem', border: `1px solid ${theme.border}` }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: theme.textPrimary, marginBottom: '1rem' }}>Profile Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: theme.bgTertiary, borderRadius: '0.5rem' }}>
                <span style={{ color: theme.textSecondary }}>CV Uploaded</span>
                {accountInfo.profile?.cv_uploaded ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e' }}>
                    <FileCheck size={16} /> Yes
                  </span>
                ) : (
                  <span style={{ color: '#f59e0b' }}>No</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: theme.bgTertiary, borderRadius: '0.5rem' }}>
                <span style={{ color: theme.textSecondary }}>Onboarding Completed</span>
                {accountInfo.profile?.onboarding_completed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#22c55e' }}>
                    <CheckCircle size={16} /> Yes
                  </span>
                ) : (
                  <span style={{ color: '#f59e0b' }}>No</span>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.75rem',
              color: '#ef4444',
              fontWeight: '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', margin: 0 }}>Failed to load account information</p>
        </div>
      )}
    </div>
  );
};

export default Account;
