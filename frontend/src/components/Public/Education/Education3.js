import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../services/api";
import { FaUniversity, FaGraduationCap } from "react-icons/fa";

const Education3 = () => {
  const [educationData, setEducationData] = useState([]);
  const token = localStorage.getItem("token");
  const { username } = useParams(); // For public view

  // Fetch Education Data from API
  useEffect(() => {
    if (token) {
      // Logged-in user: fetch data from private endpoint.
      api
        .get("/education/entries/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          console.log("Fetched Data (logged-in):", res.data);
          const entries = Array.isArray(res.data) ? res.data : (res.data?.education_entries || []);
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching education data (logged-in):", err);
          setEducationData([]);
        });
    } else if (username) {
      // Public user: fetch data from public profile endpoint.
      api
        .get(`/public/profile/${username}/`)
        .then((res) => {
          console.log("Fetched Data (public):", res.data);
          const entries = res.data?.educationEntries || res.data?.education_entries || [];
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching education data (public):", err);
          setEducationData([]);
        });
    } else {
      console.warn("No token or username provided; education data will be empty.");
      setEducationData([]);
    }
  }, [token, username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="max-w-6xl mx-auto py-12 px-6 lg:px-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-2xl"
    >
      <h2 className="text-4xl font-extrabold text-center text-white mb-12 tracking-wider">
        🎓 Education
      </h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
        {educationData.length === 0 ? (
          <p className="text-center text-white">No education entries found.</p>
        ) : (
          educationData.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative bg-white/90 backdrop-blur-sm border border-white/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 flex flex-col"
            >
              <div className="flex items-center space-x-4 mb-5">
                <div className="bg-purple-600 text-white p-4 rounded-full shadow-md">
                  <FaGraduationCap className="text-2xl" />
                </div>
                <div>
                  <p className="text-gray-100 text-sm font-medium">{item.year}</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaUniversity className="mr-2 text-indigo-300" /> {item.university}
                  </p>
                  <h4 className="text-indigo-800 text-xl font-semibold">{item.degree}</h4>
                </div>
              </div>

              {/* Description area */}
              <div className="mt-4 border-t border-gray-200 pt-4 w-full">
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap break-words">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Education3;
