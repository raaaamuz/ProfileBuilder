import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

const Education = () => {
  const [educationData, setEducationData] = useState([]);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className="max-w-5xl mx-auto py-12 px-8 bg-white"
    >
      <h2 className="text-4xl font-bold text-left text-red-500 mb-12 tracking-wide">Education</h2>
      <div className="grid grid-cols-1 gap-8">
        {educationData.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:space-x-6 items-start">
            <div className="flex-1 pr-6">
              <p className="text-gray-600 text-md">{item.year}</p>
              <p className="text-lg font-semibold text-gray-800">{item.university}</p>
              <h4 className="text-red-500 text-sm">{item.degree}</h4>
            </div>
            <div className="border-l-2 border-gray-300 h-full"></div>
            <div className="flex-1 text-left pl-6">
              <p className="text-gray-700 text-sm whitespace-pre-line">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Education;