// src/components/EducationEditorContainer.js
import React, { useState } from "react";
import EducationEditor from "../pages/EducationEditor"; // Adjust the path as needed

const EducationEditorContainer = ({ form, setForm, educationData, onAddOrUpdate, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleEditor = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggleEditor}
        className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-t-lg focus:outline-none"
      >
        {isOpen ? "Close Editor" : "Add / Edit Education Entry"}
      </button>
      
      {isOpen && (
        <div className="bg-gray-100 p-6 rounded-b-lg border-t border-blue-600 transition-all duration-300">
          <EducationEditor
            form={form}
            setForm={setForm}
            educationData={educationData}
            onAddOrUpdate={onAddOrUpdate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default EducationEditorContainer;
