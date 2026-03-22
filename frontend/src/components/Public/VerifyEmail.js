import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error, already_verified
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/users/verify-email/${token}/`);
        if (response.data.already_verified) {
          setStatus("already_verified");
          setMessage(response.data.message);
        } else {
          setStatus("success");
          setMessage(response.data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Verification failed. The link may be invalid or expired.");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <>
            <div className="text-6xl mb-6 animate-spin">
              <svg className="w-16 h-16 mx-auto text-cyan-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verifying your email...</h2>
            <p className="text-gray-400">Please wait while we verify your email address.</p>
          </>
        );
      case "success":
        return (
          <>
            <div className="text-6xl mb-6">
              <svg className="w-20 h-20 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
              className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Sign In Now
            </button>
          </>
        );
      case "already_verified":
        return (
          <>
            <div className="text-6xl mb-6">
              <svg className="w-20 h-20 mx-auto text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Already Verified</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
              className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Sign In
            </button>
          </>
        );
      case "error":
        return (
          <>
            <div className="text-6xl mb-6">
              <svg className="w-20 h-20 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/register')}
                style={{ background: 'linear-gradient(to right, #00b4d8, #4facfe)' }}
                className="w-full px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Register Again
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-600"
              >
                Go to Login
              </button>
            </div>
          </>
        );
      default:
        return null;
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
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 text-center">
          {renderContent()}
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

export default VerifyEmail;
