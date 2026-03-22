// src/pages/EducationDesignSettings.js
import React, { useState, useEffect } from "react";
import api from "../services/api";
import EducationPreview from "./EducationPreview";

const EducationDesignSettings = ({ educationData }) => {
  const [selectedDesign, setSelectedDesign] = useState("design1");
  const token = localStorage.getItem("token");

  // Fetch the saved design when the component mounts.
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchSelectedDesign = async () => {
      try {
        const response = await api.get("/education/selected-design/", {
          headers: { Authorization: `Token ${token}` },
        });
        console.log("API Design Response:", response.data);
        if (response.status === 200 && response.data.selected_design) {
          setSelectedDesign(response.data.selected_design);
        } else {
          setSelectedDesign("design1");
        }
      } catch (error) {
        console.error("Error fetching selected design:", error.response?.data || error);
      }
    };

    fetchSelectedDesign();
  }, [token]);

  // Handle design change and persist the selection in the backend.
  const handleDesignChange = async (event) => {
    const newDesign = event.target.value;
    setSelectedDesign(newDesign);
    try {
      const response = await api.put(
        "/education/update-selected-design/",
        { selected_design: newDesign },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.status === 200) {
        console.log("Education design updated successfully!");
      } else {
        console.error("Failed to update education design:", response.data);
      }
    } catch (error) {
      console.error("Error updating education design:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white rounded-xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-wide">
        Education Design Settings
      </h2>

      {/* Design selection */}
      <div className="mb-8">
        <label htmlFor="designSelector" className="mr-4 font-semibold">
          Choose a design:
        </label>
        <select
          id="designSelector"
          value={selectedDesign}
          onChange={handleDesignChange}
          className="p-2 border rounded"
        >
          <option value="design1">Design 1</option>
          <option value="design2">Design 2</option>
          <option value="design3">Design 3</option>
        </select>
      </div>

      {/* Preview the selected design */}
      <EducationPreview educationData={educationData} selectedDesign={selectedDesign} />
    </div>
  );
};

export default EducationDesignSettings;
