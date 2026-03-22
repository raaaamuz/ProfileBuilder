import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SectionNavigator from './SectionNavigator';
import AdminHome from './AdminHome';
import AdminProfile from './AdminProfile';
import AdminEducationPage from './AdminEducationPage';
import BlogForm from './BlogForm';
import AdminCareerPage from './AdminCareerPage';
import AdminSettings from './AdminSettings';
import AdminProfileSummary from './AdminProfileSummary';

const AdminRoutes = () => (
  <Routes>
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
    </Route>
  </Routes>
);

export default AdminRoutes;
