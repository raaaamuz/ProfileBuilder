import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Public/Home/Home";
import Profile from "./components/Public/Profile/Profile";
import Stories from "./components/Public/Stories";
import Navbar from "./components/Public/NavBar";
import AdminTabs from "./components/admin/Settings/AdminTabs";
import AdminHome from "./components/admin/Home/AdminHome";
import AdminSettings from "./components/admin/Settings/Settings";
import Contact from "./components/Public/contact";
import Blog from "./components/Public/Blogs/Blog";
import BlogDetail from "./components/Public/Blogs/BlogDetail"; // Ensure this file exports default BlogDetail
import Register from "./components/Public/Register";
import Login from "./components/Public/Login";
import PrivateRoute from "./components/Public/PrivateRoute";
import Preview from "./components/admin/Settings/Preview";
import AdminProfile from "./components/admin/Profile/AdminProfile";
import AdminCareerPage from "./components/admin/Career/AdminCareerPage";
import AdminEducationPage from "./components/admin/Education/AdminEducation";
import AdminProfileSummary from "./components/admin/Profile/AdminProfileSummary";
import EducationEdit from "./components/Public/Education/EducationEdit";
import BlogForm from "./components/admin/Blog/BlogForm";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Routes for Logged-In Users */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Public (Unauthorized) Routes */}
          <Route path="/public/home/:username" element={<Home />} />
          <Route path="/public/profile/:username" element={<Profile />} />
          <Route path="/public/blog/:username" element={<Blog />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<PrivateRoute><AdminTabs /></PrivateRoute>}>
            <Route path="home" element={<AdminHome />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="education" element={<AdminEducationPage />} />
            <Route path="blogs" element={<BlogForm />} />
            <Route path="career" element={<AdminCareerPage />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile_summary" element={<AdminProfileSummary />} />
            {/* <Route path="preview" element={<Preview />} /> */}
          </Route>

          {/* Education Edit (Not an Admin Page) */}
          <Route path="/education/edit" element={<PrivateRoute><EducationEdit /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
