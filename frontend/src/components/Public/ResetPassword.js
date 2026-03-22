import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(`/users/reset-password/${token}/`, { password });
      setIsSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Failed to reset password. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/p2clogo.png"
            alt="Profile2Connect"
            className="h-16 mx-auto mb-4"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <p className="text-cyan-400 mt-2">Create a new password</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h2>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${isSuccess ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-400 mb-4">Your password has been reset successfully!</p>
              <button
                onClick={() => navigate('/login')}
                style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
                className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-400 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
