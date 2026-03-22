import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";
import CareerEntryForm from "./CareerEntryForm"; // Adjust the path as needed
import CareerPreview from "./CareerPreview"; // Import the new component

const AdminCareerPage = () => {
  const [careerData, setCareerData] = useState([]);
  const [form, setForm] = useState({
    year: "",
    title: "",
    company: "",
    color: "#ff0000",
    borderColor: "#ff0000",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [preview, setPreview] = useState(false);
  const token = localStorage.getItem("token");

  // Card Size & Font State
  const [cardWidth, setCardWidth] = useState(300);
  const [cardHeight, setCardHeight] = useState(150);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  // Create a ref for the top of the page (or the container you want to scroll)
  const topRef = useRef(null);

  // Fetch Career Data & Design Settings from API
  useEffect(() => {
    api
      .get("/career/entries/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("Career Data API response:", res.data);
        const entries = Array.isArray(res.data)
          ? res.data
          : res.data.career_entries || [];
        setCareerData(entries);
      })
      .catch((err) => console.error("Error fetching career data:", err));

    api
      .get("/career/settings/get_user_settings/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setCardWidth(res.data.card_width);
          setCardHeight(res.data.card_height);
          setFontSize(res.data.font_size);
          setFontFamily(res.data.font_family);
        }
      })
      .catch((err) => console.error("Error fetching design settings:", err));
  }, [token]);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Career Entry Locally
  const handleSubmit = () => {
    if (!form.year || !form.title || !form.company) {
      alert("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      const updatedData = [...careerData];
      updatedData[editIndex] = { ...form, id: careerData[editIndex].id }; // Preserve the id
      setCareerData(updatedData);
      setEditIndex(null);
    } else {
      const newEntry = { ...form, id: null }; // Generate a temporary id for new entries
      setCareerData([...careerData, newEntry]);
    }

    // Reset the form
    setForm({
      year: "",
      title: "",
      company: "",
      color: "#ff0000",
      borderColor: "#ff0000",
    });
  };

  // Save Career Entries & Design Settings to Backend
  const handleSave = async () => {
    try {
      const newEntries = careerData.filter((entry) => entry.id === null);
      const updatedEntries = careerData.filter((entry) => entry.id !== null);

      if (newEntries.length === 0 && updatedEntries.length === 0) {
        alert("No changes detected. Nothing to save.");
        return;
      }

      // Send new entries for creation
      if (newEntries.length > 0) {
        const response = await api.post(
          "/career/entries/bulk_create/",
          { career_entries: newEntries },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const createdEntries = response.data.data;
        setCareerData((prevData) =>
          prevData.map((entry) =>
            entry.id === null ? createdEntries.shift() : entry
          )
        );
      }

      // Send existing entries for update
      for (const entry of updatedEntries) {
        await api.put(`/career/entries/${entry.id}/update_entry/`, entry, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Save design settings
      await api.post(
        "/career/settings/",
        {
          card_width: cardWidth,
          card_height: cardHeight,
          font_size: fontSize,
          font_family: fontFamily,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Career data & design settings saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  // Clear All Entries
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all career entries?"))
      return;

    try {
      await api.delete("/career/entries/clear_entries/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCareerData([]);
      alert("All career entries deleted.");
    } catch (error) {
      console.error("Error deleting entries:", error);
      alert("Failed to delete entries.");
    }
  };

  

  // Modified handleEdit function with scrollIntoView
  const handleEdit = (index) => {
    handleCloseModal()
    setForm(careerData[index]);
    setEditIndex(index);
    // Scroll the top container into view
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleCloseModal = () => {
    console.log("Closing modal"); // for debugging
    setPreview(false);
  };
  // Delete Entry
  const handleDelete = async (index) => {
    const entry = careerData[index];
    try {
      await api.delete(`/career/entries/${entry.id}/delete_entry/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCareerData(careerData.filter((_, i) => i !== index));
      alert("Career entry deleted.");
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  return (
    // Attach the ref to the container you want to scroll to
    <div
      ref={topRef}
      className="max-w-5xl mx-auto py-12 px-6 bg-white rounded-xl shadow-xl"
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">
        Admin Career Page
      </h2>

      {/* Card Size Controls */}
      <div className="mb-6 bg-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">Adjust Card Size & Font</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold">Card Width</label>
            <input
              type="range"
              min="200"
              max="600"
              value={cardWidth}
              onChange={(e) => setCardWidth(e.target.value)}
              className="w-full"
            />
            <p>{cardWidth}px</p>
          </div>
          <div>
            <label className="block font-semibold">Card Height</label>
            <input
              type="range"
              min="100"
              max="300"
              value={cardHeight}
              onChange={(e) => setCardHeight(e.target.value)}
              className="w-full"
            />
            <p>{cardHeight}px</p>
          </div>
          <div>
            <label className="block font-semibold">Font Size</label>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full"
            />
            <p>{fontSize}px</p>
          </div>
          <div>
            <label className="block font-semibold">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Entry Form */}
      <CareerEntryForm
      form={form}
      careerData={careerData}
      preview={preview}
      setPreview={setPreview} // <-- Add this line
      cardWidth={300}
      cardHeight={200}
      fontSize={16}
      fontFamily="Arial"
      onClose={handleCloseModal}
    />

      {/* Save & Clear Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg"
        >
          Save All
        </button>
        <button
          onClick={handleClearAll}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg"
        >
          Clear All
        </button>
      </div>

      {/* Preview Section using the separate CareerPreview component */}
      <CareerPreview
        careerData={careerData}
        preview={preview}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onClose={handleCloseModal} // Pass the close handler here
      />

    </div>
  );
};

export default AdminCareerPage;
