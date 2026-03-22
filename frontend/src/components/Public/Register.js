import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    try {
      await api.post("/users/register/", formData);
      setIsSuccess(true);
      setMessage("Registration successful! Please check your email to verify your account.");
      setFormData({ username: "", email: "", password: "" });
      // Don't redirect - user needs to verify email first
    } catch (error) {
      setIsSuccess(false);
      let backendMessage = "Registration failed.";

      if (error.response && error.response.data) {
        const errorData = error.response.data;

        // If it's HTML response (error page), show generic message
        if (typeof errorData === 'string' && errorData.includes('<!doctype html>')) {
          backendMessage = "Registration failed. Username or email may already exist.";
        } else if (typeof errorData === 'string') {
          backendMessage = errorData;
        } else if (errorData.message) {
          backendMessage = errorData.message;
        } else if (errorData.error) {
          backendMessage = errorData.error;
        } else if (typeof errorData === 'object') {
          const messages = [];
          for (const key in errorData) {
            if (Object.hasOwnProperty.call(errorData, key)) {
              const value = errorData[key];
              if (Array.isArray(value)) {
                messages.push(`${key}: ${value.join(" ")}`);
              } else if (typeof value === 'string') {
                messages.push(`${key}: ${value}`);
              }
            }
          }
          if (messages.length > 0) {
            backendMessage = messages.join(" ");
          }
        }
      }

      setMessage(backendMessage);
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
          <p className="text-cyan-400 mt-2">Connect Profiles. Build Networks.</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Create Account</h2>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${isSuccess ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="Create a strong password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all transform hover:scale-[1.02] hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
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

export default Register;
