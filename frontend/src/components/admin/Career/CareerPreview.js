import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";

const CareerPreview = ({
  designSettings, // { cardWidth, cardHeight, fontSize, fontFamily }
  token,
  onClose,        // Callback to close the sidebar
  handleEdit,     // Optional callback for editing an entry
  handleDelete,   // Optional callback for deleting an entry
}) => {
  const [careerData, setCareerData] = useState([]);

  // Function to fetch career entries
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/career/entries/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const entries = Array.isArray(res.data)
        ? res.data
        : res.data.career_entries || [];
      setCareerData(entries);
    } catch (error) {
      console.error("Error fetching career preview data:", error);
    }
  }, [token]);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Poll every 5 seconds (adjust as needed)

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-white shadow-lg overflow-y-auto p-6 z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
      >
        &times;
      </button>
      <div
        style={{
          width: 600,
          height: 500,
          transform: "scale(0.75)",
          transformOrigin: "top left",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Career Preview</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-400 rounded-full"></div>
          {careerData.length > 0 ? (
            careerData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } w-full mb-12 relative`}
              >
                <div className="relative w-1/4 flex justify-center">
                  <div
                    className="w-20 h-20 flex items-center justify-center rounded-full border-4"
                    style={{
                      backgroundColor: "#fff",
                      borderColor: item.borderColor,
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {item.year}
                  </div>
                </div>
                <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div
                    className="p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundColor: item.color,
                      width: `${designSettings.cardWidth}px`,
                      height: `${designSettings.cardHeight}px`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontFamily: designSettings.fontFamily,
                      fontSize: `${designSettings.fontSize}px`,
                      color: "white",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: designSettings.fontFamily,
                        fontSize: `${designSettings.fontSize}px`,
                      }}
                      className="font-bold tracking-wide"
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: designSettings.fontFamily,
                        fontSize: `${designSettings.fontSize}px`,
                      }}
                      className="italic"
                    >
                      {item.company}
                    </p>
                  </div>
                  {handleEdit && handleDelete && (
                    <div className="mt-2 flex justify-between">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No career entries to preview.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CareerPreview;
