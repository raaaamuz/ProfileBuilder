import React from "react";
import Navbar from "./NavBar";
import SideNav from "./SideNav";

const Layout = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Sidebar & Main Content */}
      <div className="flex flex-grow w-full pb-12">
        {/* Sidebar positioned below navbar */}
        <SideNav />

        {/* Main Content Area */}
        <div className="flex-grow p-6 bg-gray-100 overflow-auto">
          {children}
        </div>
      </div>

      {/* Persistent Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 flex items-center justify-center gap-4 z-50 px-8">
        <span className="text-white/50 text-xs">
          &copy; {new Date().getFullYear()} All rights reserved
        </span>
        <span className="text-white/30">|</span>
        <a
          href="https://profile2connect.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 text-xs hover:text-indigo-300 transition"
        >
          Powered by Profile2Connect
        </a>
      </div>
    </div>
  );
};

export default Layout;
