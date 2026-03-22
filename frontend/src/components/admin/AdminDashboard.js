import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/users/admin-dashboard/');
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}>
        <div className="text-cyan-400 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}>
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Home
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Users"
            value={data.summary.total_users}
            icon="users"
            color="cyan"
          />
          <SummaryCard
            title="Verified Users"
            value={data.summary.verified_users}
            icon="check"
            color="green"
          />
          <SummaryCard
            title="Active Users"
            value={data.summary.active_users}
            icon="activity"
            color="blue"
          />
          <SummaryCard
            title="Staff Users"
            value={data.summary.staff_users}
            icon="shield"
            color="purple"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Registrations */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Registrations</h2>
            <div className="space-y-3">
              <StatRow label="Today" value={data.registrations.today} />
              <StatRow label="Last 7 Days" value={data.registrations.last_7_days} />
              <StatRow label="Last 30 Days" value={data.registrations.last_30_days} />
            </div>
          </div>

          {/* Logins */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">User Logins</h2>
            <div className="space-y-3">
              <StatRow label="Today" value={data.logins.today} />
              <StatRow label="Last 7 Days" value={data.logins.last_7_days} />
              <StatRow label="Last 30 Days" value={data.logins.last_30_days} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Registration Trend */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Registration Trend (30 Days)</h2>
            <SimpleBarChart data={data.registration_trend} color="#00b4d8" />
          </div>

          {/* Login Trend */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Login Trend (30 Days)</h2>
            <SimpleBarChart data={data.login_trend} color="#10b981" />
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Registrations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-2">Username</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Verified</th>
                    <th className="text-left py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 text-gray-300">
                      <td className="py-2">{user.username}</td>
                      <td className="py-2 text-gray-400 text-xs">{user.email}</td>
                      <td className="py-2">
                        {user.is_email_verified ? (
                          <span className="text-green-400">Yes</span>
                        ) : (
                          <span className="text-red-400">No</span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-gray-400">{formatDate(user.date_joined)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frequent Users */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Active Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-2">Username</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {data.frequent_users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 text-gray-300">
                      <td className="py-2">{user.username}</td>
                      <td className="py-2 text-gray-400 text-xs">{user.email}</td>
                      <td className="py-2 text-xs text-gray-400">{formatDate(user.last_login)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-700',
    green: 'from-green-500 to-green-700',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="text-white/50 text-3xl">
          {icon === 'users' && <UsersIcon />}
          {icon === 'check' && <CheckIcon />}
          {icon === 'activity' && <ActivityIcon />}
          {icon === 'shield' && <ShieldIcon />}
        </div>
      </div>
    </div>
  );
};

// Stat Row Component
const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="text-white font-semibold text-lg">{value}</span>
  </div>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, color }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-8">No data available</div>;
  }

  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end justify-between h-40 gap-1">
      {data.map((item, index) => {
        const height = (item.count / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${Math.max(height, 5)}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
              title={`${item.date}: ${item.count}`}
            />
            {data.length <= 10 && (
              <span className="text-xs text-gray-500 mt-1">
                {new Date(item.date).getDate()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Icons
const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default AdminDashboard;
