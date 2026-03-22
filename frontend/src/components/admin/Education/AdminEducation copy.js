import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import api from "../../../services/api";

const AdminEducationPage = () => {
  const [educationData, setEducationData] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState("design1"); // Default Design
  const [form, setForm] = useState({ year: "", degree: "", university: "", description: "", color: "#ffddc1" });
  const [editIndex, setEditIndex] = useState(null);
  const [preview, setPreview] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch Education Data from API
  useEffect(() => {
    api.get("/education/entries/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("Fetched Data:", res.data); // Debugging
        setEducationData(res.data);
      })
      .catch((err) => console.error("Error fetching education data:", err));
  }, [token]);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Design Change
  const handleDesignChange = (e) => {
    setSelectedDesign(e.target.value);
  };

  // Add or Update Education Entry Locally
  const handleSubmit = () => {
    if (!form.year || !form.degree || !form.university) {
      alert("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      let updatedData = [...educationData];
      updatedData[editIndex] = { ...form, id: educationData[editIndex].id }; // Preserve the id
      setEducationData(updatedData);
      setEditIndex(null);
    } else {
      // Generate a temporary id for new entries
      const newEntry = { ...form, id: null };
      setEducationData([...educationData, newEntry]);
    }

    setForm({ year: "", degree: "", university: "", description: "", color: "#ffddc1" });
  };

  // Save Education Entries to Backend
  const handleSave = async () => {
    try {
      const newEntries = educationData.filter((entry) => entry.id === null);
      const updatedEntries = educationData.filter((entry) => entry.id !== null);

      if (newEntries.length > 0) {
        const response = await api.post(
          "/education/entries/bulk_create/",
          { education_entries: newEntries },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        const createdEntries = response.data.data;
        setEducationData((prevData) =>
          prevData.map((entry) =>
            entry.id === null ? createdEntries.shift() : entry
          )
        );
      }

      for (const entry of updatedEntries) {
        await api.put(
          `/education/entries/${entry.id}/update_entry/`,
          entry,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
      }

      alert("Education data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  // Clear All Entries
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all education entries?")) return;

    try {
      await api.delete("/education/entries/clear_entries/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEducationData([]);
      alert("All education entries deleted.");
    } catch (error) {
      console.error("Error deleting entries:", error);
      alert("Failed to delete entries.");
    }
  };

  // Edit Entry
  const handleEdit = (index) => {
    setForm(educationData[index]);
    setEditIndex(index);
  };

  // Delete Entry
  const handleDelete = async (index) => {
    const entry = educationData[index];
    try {
      await api.delete(`/education/entries/${entry.id}/delete_entry/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEducationData(educationData.filter((_, i) => i !== index));
      alert("Education entry deleted.");
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white rounded-xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-wide">Admin Education Page</h2>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Add/Edit Education Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="year" placeholder="Year" value={form.year} onChange={handleChange} className="p-2 border rounded" />
          <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} className="p-2 border rounded" />
          <input name="university" placeholder="University" value={form.university} onChange={handleChange} className="p-2 border rounded" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="p-2 border rounded" />
          <input type="color" name="color" value={form.color} onChange={handleChange} className="cursor-pointer" />
          
          <select value={selectedDesign} onChange={handleDesignChange} className="p-2 border rounded">
            <option value="design1">Design 1</option>
            <option value="design2">Design 2</option>
            <option value="design3">Design 3</option>
          </select>
        </div>

        <div className="mt-4 flex gap-4">
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded">
            {editIndex !== null ? "Update" : "Add"} Entry
          </button>
          <button onClick={() => setPreview(!preview)} className="px-6 py-2 bg-green-500 text-white rounded">
            {preview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg">Save All</button>
        <button onClick={handleClearAll} className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg">Delete All</button>
      </div>

      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="max-w-4xl mx-auto py-12 px-8 bg-white"
        >
          <h2 className="text-4xl font-bold text-left text-red-500 mb-12 tracking-wide">Education</h2>
          <div className="grid grid-cols-1 gap-8">
            {educationData.map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row md:space-x-6 items-start ${selectedDesign}`}>
                <div className="flex-1 pr-6">
                  <p className="text-gray-600 text-md">{item.year}</p>
                  
                  <h4 className="text-lg font-semibold text-gray-800">{item.university}</h4>
                  <p className="text-red-500 text-sm">{item.degree}</p>
                </div>
                <div className="border-l-2 border-gray-300 h-full"></div>
                <div className="flex-1 text-left pl-6">
                  <p className="text-gray-700 text-sm whitespace-pre-line">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminEducationPage;
