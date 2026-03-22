import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CareerTimeline = () => {
  const [careerData, setCareerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Career Data from API
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/career/entries/") // No auth needed
      .then((res) => {
        setCareerData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching career data:", err);
        setError("Failed to load career data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-lg font-semibold">Loading career data...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-xl">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">Career Timeline</h2>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-400 rounded-full"></div>

        {careerData.length === 0 ? (
          <p className="text-center text-gray-500">No career entries available.</p>
        ) : (
          careerData.map((item, index) => (
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
                     style={{ borderColor: item.borderColor, backgroundColor: "#fff", color: "gray-900", fontWeight: "bold", textShadow: "lg", transform: "hover:scale-110", transition: "transform duration-300", fontSize: "sm" }}>
                  {item.year}
                </div>
              </div>

              {/* Content Box */}
              <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                <div className="p-6 shadow-xl rounded-lg text-white max-w-sm transform hover:scale-105 transition-transform duration-300"
                     style={{ backgroundColor: item.color }}>
                  <h3 className="text-lg font-bold tracking-wide">{item.title}</h3>
                  <p className="text-sm italic">{item.company}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CareerTimeline;
