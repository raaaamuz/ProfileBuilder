import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AdminCareerPage = () => {
  const [careerData, setCareerData] = useState([]);
  const [form, setForm] = useState({ year: "", title: "", company: "", color: "#ff0000", borderColor: "#ff0000" });
  const [editIndex, setEditIndex] = useState(null);
  const [preview, setPreview] = useState(false);
  const token = localStorage.getItem("token");

  // 🔥 Card Size & Font State
  const [cardWidth, setCardWidth] = useState(300);
  const [cardHeight, setCardHeight] = useState(150);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  // 🔹 Fetch Career Data & Design Settings from API
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/career/entries/", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCareerData(res.data))
      .catch((err) => console.error("Error fetching career data:", err));

    axios.get("http://127.0.0.1:8000/career/settings/get_user_settings/", { headers: { Authorization: `Bearer ${token}` } })
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

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Career Entry Locally
  const handleSubmit = () => {
    if (!form.year || !form.title || !form.company) {
      alert("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      let updatedData = [...careerData];
      updatedData[editIndex] = form;
      setCareerData(updatedData);
      setEditIndex(null);
    } else {
      setCareerData([...careerData, form]);
    }
    
    setForm({ year: "", title: "", company: "", color: "#ff0000", borderColor: "#ff0000" });
  };

  // ✅ Save Career Entries & Design Settings to Backend
  const handleSave = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/career/entries/bulk_create/", { career_entries: careerData }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      await axios.post("http://127.0.0.1:8000/career/settings/", {
        card_width: cardWidth,
        card_height: cardHeight,
        font_size: fontSize,
        font_family: fontFamily,
      }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      alert("Career data & design settings saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  // ✅ Clear All Entries
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all career entries?")) return;

    try {
      await axios.delete("http://127.0.0.1:8000/career/entries/clear_entries/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCareerData([]);
      alert("All career entries deleted.");
    } catch (error) {
      console.error("Error deleting entries:", error);
      alert("Failed to delete entries.");
    }
  };

  // ✅ Edit Entry
  const handleEdit = (index) => {
    setForm(careerData[index]);
    setEditIndex(index);
  };

  // ✅ Delete Entry
  const handleDelete = (index) => {
    setCareerData(careerData.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">Admin Career Page</h2>

      {/* 🔥 Card Size Controls */}
      <div className="mb-6 bg-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">Adjust Card Size & Font</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold">Card Width</label>
            <input type="range" min="200" max="600" value={cardWidth} onChange={(e) => setCardWidth(e.target.value)} className="w-full" />
            <p>{cardWidth}px</p>
          </div>
          <div>
            <label className="block font-semibold">Card Height</label>
            <input type="range" min="100" max="300" value={cardHeight} onChange={(e) => setCardHeight(e.target.value)} className="w-full" />
            <p>{cardHeight}px</p>
          </div>
          <div>
            <label className="block font-semibold">Font Size</label>
            <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full" />
            <p>{fontSize}px</p>
          </div>
          <div>
            <label className="block font-semibold">Font Family</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🔥 Add/Edit Career Entry Section */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">Add/Edit Career Entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="year" placeholder="Year" value={form.year} onChange={handleChange} className="p-2 border rounded" />
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="p-2 border rounded" />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="p-2 border rounded" />
          <input type="color" name="color" value={form.color} onChange={handleChange} className="cursor-pointer" />
          <input type="color" name="borderColor" value={form.borderColor} onChange={handleChange} className="cursor-pointer" />
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

      {/* 🔥 Save & Clear Buttons */}
      <div className="mt-6 flex gap-4">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg">Save All</button>
        <button onClick={handleClearAll} className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg">Clear All</button>
      </div>

      {/* 🔥 Preview Section */}
      {preview && (
        <div className="relative mt-12">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-400 rounded-full"></div>

          {careerData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex items-center justify-${index % 2 === 0 ? "start" : "end"} w-full mb-12 relative`}
            >
              {/* Year Node */}
              <div className="relative w-1/4 flex justify-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full border-4"
                     style={{ backgroundColor: "#fff", borderColor: item.borderColor, color: "#000", fontWeight: "bold" }}>
                  {item.year}
                </div>
              </div>

              {/* 🔥 Content Box with Dynamic Resizing */}
              <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                <div className="p-6 shadow-xl rounded-lg text-white transform hover:scale-105 transition-transform duration-300"
                     style={{ 
                       backgroundColor: item.color, 
                       fontSize: `${fontSize}px`, 
                       fontFamily,
                       width: `${cardWidth}px`,
                       height: `${cardHeight}px`,
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",
                       alignItems: "center"
                     }}>
                  <h3 className="text-lg font-bold tracking-wide">{item.title}</h3>
                  <p className="text-sm italic">{item.company}</p>
                  <div className="flex mt-2">
                    <button onClick={() => handleEdit(index)} className="mr-2 px-3 py-1 bg-yellow-400 text-black rounded">Edit</button>
                    <button onClick={() => handleDelete(index)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCareerPage;