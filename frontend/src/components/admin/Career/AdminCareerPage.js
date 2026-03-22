// AdminCareerPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import CareerEditor from "./CareerEditor";

const AdminCareerPage = () => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Career Timeline</h1>
        <p className="mt-1 text-gray-600">Manage your professional journey</p>
      </div>

      {/* Full Width Career Entries */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Career Entries</h2>
        <CareerEditor
          designSettings={{ cardWidth: 300, cardHeight: 150, fontSize: 16, fontFamily: 'Arial' }}
        />
      </div>
    </div>
  );
};

export default AdminCareerPage;
