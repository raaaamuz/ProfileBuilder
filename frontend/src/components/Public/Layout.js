import React from "react";
import Navbar from "./NavBar";
import SideNav from "./SideNav";

const Layout = ({ children }) => {
  
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Sidebar & Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar positioned below navbar */}
        <SideNav />

        {/* Main Content Area */}
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
