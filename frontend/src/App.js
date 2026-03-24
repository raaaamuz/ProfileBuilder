import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import Home from './components/Public/Home/Home';
import Profile from './components/Public/Profile/Profile';
import Stories from './components/Public/Stories';
import Navbar from './components/Public/NavBar';
import SectionNavigator from './components/admin/SectionNavigator';
import AdminHome from './components/admin/Home/AdminHome';
import AdminSettings from './components/admin/Settings/Settings';
import AdminAccount from './components/admin/Settings/Account';
import Contact from './components/Public/contact';
import Education from './components/Public/Education/Education';
import CareerTimeline from './components/Public/Career/CareerTimeline';
import Blog from './components/Public/Blogs/Blog';
import BlogDetail from './components/Public/Blogs/BlogDetail';
import Register from './components/Public/Register';
import Login from './components/Public/Login';
import VerifyEmail from './components/Public/VerifyEmail';
import ForgotPassword from './components/Public/ForgotPassword';
import ResetPassword from './components/Public/ResetPassword';
import PrivateRoute from './components/Public/PrivateRoute';
import AdminProfile from './components/admin/Profile/AdminProfile';
import AdminCareerPage from './components/admin/Career/AdminCareerPage';
import AdminEducationPage from './components/admin/Education/AdminEducation';
import AdminProfileSummary from './components/admin/Profile/AdminProfileSummary';
import EducationEdit from './components/Public/Education/EducationEdit';
import BlogForm from './components/admin/Blog/BlogForm';
import { PreviewProvider } from './components/admin/PreviewContext';
import { ThemeProvider } from './context/ThemeContext';
import ResumeHTMLRenderer from './components/Public/Resume/ResumeHTMLRenderer';
import SkillForm from './components/admin/Skill/SkillForm';
import AdminResume from './components/admin/Resume/AdminResume';
import AwardsEditor from './components/admin/Awards/AwardsEditor';
import AdminInbox from './components/admin/Inbox/AdminInbox';
import AdminServices from './components/admin/Services/AdminServices';
import AdminTestimonials from './components/admin/Testimonials/AdminTestimonials';
import ServicesSection from './components/Public/Services/ServicesSection';
import TestimonialsSection from './components/Public/Testimonials/TestimonialsSection';
import CVUpload from './components/admin/Onboarding/CVUpload';
import TemplateSelection from './components/admin/Onboarding/TemplateSelection';
import AdminDashboard from './components/admin/AdminDashboard';
import { getSubdomainUsername, isPotentialCustomDomain, fetchCustomDomainUsername } from './utils/subdomain';

// Public Layout Variants
import VerticalProfilePage from './components/Public/VerticalSlider/VerticalProfilePage';
import CardStackLayout from './components/Public/Layouts/CardStackLayout';
import HorizontalScrollLayout from './components/Public/Layouts/HorizontalScrollLayout';
import PortfolioRouter from './components/Public/Portfolio/PortfolioRouter';
import MinimalLayout from './components/Public/Layouts/MinimalLayout';

// Layout Component for Navbar control
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard');
  const isAuthRoute = location.pathname.startsWith('/verify-email') ||
                      location.pathname.startsWith('/forgot-password') ||
                      location.pathname.startsWith('/reset-password');

  return (
    <>
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      {children}
    </>
  );
};

// Public Resume Renderer Wrapper (to extract username from URL)
const ResumePage = () => {
  const { username } = useParams();
  return <ResumeHTMLRenderer username={username} />;
};

// Home Page Wrapper - Redirects logged-in users to dashboard
const HomePageWrapper = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Logged-in users go to dashboard
    return <Navigate to="/dashboard/home" replace />;
  }
  // Guests see the public landing page
  return <Layout><Home /></Layout>;
};

// Profile Page Wrapper - Redirects to user's public profile with new layout
const ProfilePageWrapper = () => {
  const [username, setUsername] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchUsername = async () => {
      if (token) {
        try {
          const api = (await import('./services/api')).default;
          const res = await api.get('users/username/');
          setUsername(res.data.username);
        } catch (err) {
          console.error('Error fetching username:', err);
        }
      }
      setLoading(false);
    };
    fetchUsername();
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '3rem', height: '3rem', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (username) {
    // Redirect to the user's public profile with new layout
    return <Navigate to={`/public/profile/${username}`} replace />;
  }

  // For guests, redirect to login
  return <Navigate to="/login" replace />;
};

// ============================================================================
// CUSTOM DOMAIN DETECTION
// ============================================================================
// This app supports three access patterns:
// 1. Main domain (profile2connect.com) - Shows landing/login/admin
// 2. Subdomain (username.profile2connect.com) - Shows user's public profile
// 3. Custom domain (user's own domain) - Shows user's public profile
// ============================================================================

// Main Application
function App() {
  const subdomainUser = getSubdomainUsername();

  // State for custom domain detection (async)
  const [customDomainState, setCustomDomainState] = useState({
    username: null,
    loading: isPotentialCustomDomain(), // Only loading if we need to check
    checked: false,
  });

  // Check for custom domain on mount (only if not on subdomain)
  useEffect(() => {
    if (subdomainUser || !isPotentialCustomDomain()) {
      // No need to check custom domain if we're on a subdomain or known domain
      setCustomDomainState({ username: null, loading: false, checked: true });
      return;
    }

    // Fetch custom domain username
    const checkCustomDomain = async () => {
      try {
        const username = await fetchCustomDomainUsername(window.location.hostname);
        setCustomDomainState({ username, loading: false, checked: true });
      } catch (error) {
        console.error('Custom domain check failed:', error);
        setCustomDomainState({ username: null, loading: false, checked: true });
      }
    };

    checkCustomDomain();
  }, [subdomainUser]);

  // Show loading spinner while checking custom domain
  if (customDomainState.loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid rgba(255,255,255,0.1)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Determine which user to show (subdomain takes priority, then custom domain)
  const profileUser = subdomainUser || customDomainState.username;

  // If on a subdomain or custom domain, show public profile routes
  if (profileUser) {
    return (
      <ThemeProvider>
        <Router>
          <PreviewProvider>
            <Routes>
              {/* All profile sections use PortfolioRouter for consistent new layout */}
              <Route path="/" element={<PortfolioRouter />} />
              <Route path="/home" element={<PortfolioRouter />} />
              <Route path="/profile" element={<PortfolioRouter />} />
              <Route path="/education" element={<PortfolioRouter />} />
              <Route path="/career" element={<PortfolioRouter />} />
              <Route path="/contact" element={<PortfolioRouter />} />
              <Route path="/services" element={<PortfolioRouter />} />
              <Route path="/testimonials" element={<PortfolioRouter />} />
              <Route path="/skills" element={<PortfolioRouter />} />
              <Route path="/awards" element={<PortfolioRouter />} />
              {/* Separate pages with minimal layout (no old navbar) */}
              <Route path="/blog" element={<MinimalLayout><Blog /></MinimalLayout>} />
              <Route path="/stories" element={<MinimalLayout><Stories /></MinimalLayout>} />
              <Route path="/resume" element={<MinimalLayout><ResumeHTMLRenderer username={profileUser} /></MinimalLayout>} />
              {/* Full Portfolio Layout Variants */}
              <Route path="/portfolio" element={<PortfolioRouter />} />
              <Route path="/vertical" element={<VerticalProfilePage />} />
              <Route path="/cards" element={<CardStackLayout />} />
              <Route path="/horizontal" element={<HorizontalScrollLayout />} />
              {/* Catch all - use portfolio router */}
              <Route path="*" element={<PortfolioRouter />} />
            </Routes>
          </PreviewProvider>
        </Router>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <PreviewProvider>
          <Routes>
          {/* Public Routes - Logged-in users redirect to dashboard */}
          <Route path="/" element={<HomePageWrapper />} />
          <Route path="/home" element={<HomePageWrapper />} />
          <Route path="/profile" element={<ProfilePageWrapper />} />
          <Route path="/education" element={<ProfilePageWrapper />} />
          <Route path="/career" element={<ProfilePageWrapper />} />
          <Route path="/contact" element={<ProfilePageWrapper />} />
          {/* Standalone pages with minimal layout */}
          <Route path="/stories" element={<MinimalLayout><Stories /></MinimalLayout>} />
          <Route path="/blog" element={<MinimalLayout><Blog /></MinimalLayout>} />
          <Route path="/blog/:id" element={<MinimalLayout><BlogDetail /></MinimalLayout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/verify-email/:token" element={<Layout><VerifyEmail /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
          <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />

          {/* Public (Unauthorized) User Pages - All use PortfolioRouter for consistent new layout */}
          <Route path="/public/home/:username" element={<PortfolioRouter />} />
          <Route path="/public/profile/:username" element={<PortfolioRouter />} />
          <Route path="/public/education/:username" element={<PortfolioRouter />} />
          <Route path="/public/career/:username" element={<PortfolioRouter />} />
          <Route path="/public/contact/:username" element={<PortfolioRouter />} />
          <Route path="/public/services/:username" element={<PortfolioRouter />} />
          <Route path="/public/testimonials/:username" element={<PortfolioRouter />} />
          <Route path="/public/skills/:username" element={<PortfolioRouter />} />
          <Route path="/public/awards/:username" element={<PortfolioRouter />} />
          {/* Separate standalone pages with minimal layout (no old navbar) */}
          <Route path="/public/blog/:username" element={<MinimalLayout><Blog /></MinimalLayout>} />
          <Route path="/public/stories/:username" element={<MinimalLayout><Stories /></MinimalLayout>} />
          <Route path="/public/resume/:username" element={<MinimalLayout><ResumePage /></MinimalLayout>} />
          {/* Full Portfolio Layout Variants */}
          <Route path="/public/portfolio/:username" element={<PortfolioRouter />} />
          <Route path="/public/vertical/:username" element={<VerticalProfilePage />} />
          <Route path="/public/cards/:username" element={<CardStackLayout />} />
          <Route path="/public/horizontal/:username" element={<HorizontalScrollLayout />} />

          {/* Admin Dashboard (Staff Only) */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Onboarding Routes */}
          <Route
            path="/dashboard/onboarding"
            element={
              <PrivateRoute>
                <CVUpload />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/onboarding/select-template"
            element={
              <PrivateRoute>
                <TemplateSelection />
              </PrivateRoute>
            }
          />

          {/* Admin Routes with Section Navigator */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <SectionNavigator />
              </PrivateRoute>
            }
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="education" element={<AdminEducationPage />} />
            <Route path="blogs" element={<BlogForm />} />
            <Route path="career" element={<AdminCareerPage />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile_summary" element={<AdminProfileSummary />} />
            <Route path="skills" element={<SkillForm />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="awards" element={<AwardsEditor />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="resume" element={<AdminResume />} />
            <Route path="inbox" element={<AdminInbox />} />
          </Route>

          {/* Private Education Edit Route */}
          <Route
            path="/education/edit"
            element={
              <PrivateRoute>
                <EducationEdit />
              </PrivateRoute>
            }
          />
          </Routes>
        </PreviewProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
