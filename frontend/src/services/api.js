import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

// ✅ Attach Token in Requests (skip for registration endpoint)
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    // Check if the URL includes the registration endpoint
    if (token && !config.url.includes("/users/register/")) {
      config.headers.Authorization = `Token ${token}`; // Use Django Token Auth format
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle Expired Token (or 401 Unauthorized responses)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Check if we're on a subdomain (public profile) - don't redirect to login
      const hostname = window.location.hostname;
      const isSubdomain = hostname.match(/^([^.]+)\.profile2connect\.com$/) &&
                          !hostname.startsWith('www.');

      // Also check if this is a public API endpoint - don't redirect for public routes
      const isPublicEndpoint = error.config?.url?.includes('/public/') ||
                               error.config?.url?.includes('/home/public/');

      if (!isSubdomain && !isPublicEndpoint) {
        console.error("🚨 Token expired or unauthorized. Redirecting to login...");
        localStorage.removeItem("token"); // Remove the invalid token
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default api;
