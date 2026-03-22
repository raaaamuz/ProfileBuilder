import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import Home from './components/Public/Home/Home';
import Profile from './components/Public/Profile/Profile';
import Stories from './components/Public/Stories';
import Navbar from './components/Public/NavBar';
import SectionNavigator from './components/admin/SectionNavigator';
import AdminHome from './components/admin/Home/AdminHome';
import AdminSettings from './components/admin/Settings/Settings';
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
import CVUpload from './components/admin/Onboarding/CVUpload';
import AdminDashboard from './components/admin/AdminDashboard';
import { getSubdomainUsername } from './utils/subdomain';

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

// Main Application
function App() {
  const subdomainUser = getSubdomainUsername();

  // If on a subdomain, show public profile routes
  if (subdomainUser) {
    return (
      <ThemeProvider>
        <Router>
          <PreviewProvider>
            <Routes>
              <Route path="/" element={<Layout><Profile /></Layout>} />
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/education" element={<Layout><Education /></Layout>} />
              <Route path="/career" element={<Layout><CareerTimeline /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/stories" element={<Layout><Stories /></Layout>} />
              <Route path="/resume" element={<Layout><ResumeHTMLRenderer username={subdomainUser} /></Layout>} />
              {/* Catch all - redirect to profile */}
              <Route path="*" element={<Layout><Profile /></Layout>} />
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
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/education" element={<Layout><Education /></Layout>} />
          <Route path="/career" element={<Layout><CareerTimeline /></Layout>} />
          <Route path="/stories" element={<Layout><Stories /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/verify-email/:token" element={<Layout><VerifyEmail /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
          <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />

          {/* Public (Unauthorized) User Pages */}
          <Route path="/public/home/:username" element={<Layout><Home /></Layout>} />
          <Route path="/public/profile/:username" element={<Layout><Profile /></Layout>} />
          <Route path="/public/education/:username" element={<Layout><Education /></Layout>} />
          <Route path="/public/career/:username" element={<Layout><CareerTimeline /></Layout>} />
          <Route path="/public/blog/:username" element={<Layout><Blog /></Layout>} />
          <Route path="/public/stories/:username" element={<Layout><Stories /></Layout>} />
          <Route path="/public/contact/:username" element={<Layout><Contact /></Layout>} />
          <Route path="/public/resume/:username" element={<Layout><ResumePage /></Layout>} />

          {/* Admin Dashboard (Staff Only) */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Onboarding Route (CV Upload) */}
          <Route
            path="/dashboard/onboarding"
            element={
              <PrivateRoute>
                <CVUpload />
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
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile_summary" element={<AdminProfileSummary />} />
            <Route path="skills" element={<SkillForm />} />
            <Route path="awards" element={<AwardsEditor />} />
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
