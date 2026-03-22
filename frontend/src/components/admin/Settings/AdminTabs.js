import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiBook, FiBriefcase, FiSettings, FiLogOut, FiPenTool } from "react-icons/fi";

const adminTabs = [
  { label: "Home", path: "/dashboard/home", icon: <FiHome size={20} /> },
  { label: "Profile", path: "/dashboard/profile", icon: <FiUser size={20} /> },
  { label: "Education", path: "/dashboard/education", icon: <FiBook size={20} /> },
  { label: "Career", path: "/dashboard/career", icon: <FiBriefcase size={20} /> },
  { label: "Blogs", path: "/dashboard/blogs", icon: <FiPenTool size={20} /> },
  { label: "Settings", path: "/dashboard/settings", icon: <FiSettings size={20} /> },
];

const AdminTabs = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-16 bg-gray-900 text-white flex flex-col fixed h-full shadow-md">
        {/* Hidden panel title (could be omitted or styled as desired) */}
        <div className="p-4 text-xl font-bold text-center border-b border-gray-700">
          <span className="opacity-0">Admin Panel</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 mt-4 space-y-2">
          {adminTabs.map((tab) => (
            <NavLink
            key={tab.path}
            to={tab.path}
            style={{ zIndex: 10000 }}
            className={({ isActive }) =>
              `group relative flex items-center justify-center p-4 transition ${
                isActive ? "bg-blue-500" : "hover:bg-gray-800"
              }`
            }
          >
              {tab.icon}
              {/* Tooltip */}
              <span className="absolute left-full ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-sm p-1 rounded">
                {tab.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="group relative flex items-center justify-center p-4 mt-auto bg-red-500 hover:bg-red-600 transition"
          >
            <FiLogOut size={20} />
            <span className="absolute left-full ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-sm p-1 rounded">
              Logout
            </span>
          </button>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto ml-16 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminTabs;
