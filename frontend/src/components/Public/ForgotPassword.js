import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/users/forgot-password/", { email });
      setIsSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
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
          <p className="text-cyan-400 mt-2">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${isSuccess ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {message}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p className="text-gray-400 mb-4">Check your email for the password reset link.</p>
              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
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

export default ForgotPassword;
