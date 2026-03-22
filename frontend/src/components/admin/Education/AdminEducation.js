import React, { useEffect } from "react";
import EducationEditor from "./EducationEditor";

const AdminEducationPage = () => {
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
        <h1 className="text-3xl font-extrabold text-gray-800">Education Manager</h1>
        <p className="mt-1 text-gray-600">Manage your educational background</p>
      </div>

      {/* Full Width Education Entries */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Education Entries</h2>
        <EducationEditor />
      </div>
    </div>
  );
};

export default AdminEducationPage;
