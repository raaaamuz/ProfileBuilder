import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../services/api";

const Education2 = () => {
  const [educationData, setEducationData] = useState([]);
  const token = localStorage.getItem("token");
  const { username } = useParams(); // For public view

  useEffect(() => {
    if (token) {
      // Logged-in user: fetch education entries from private endpoint.
      api
        .get("/education/entries/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          console.log("Fetched education data (logged-in):", res.data);
          const entries = Array.isArray(res.data) ? res.data : (res.data?.education_entries || []);
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching education data (logged-in):", err);
          setEducationData([]);
        });
    } else {
      // Public user: fetch education entries from public endpoint using the username.
      if (username) {
        api
          .get(`/public/profile/${username}/`)
          .then((res) => {
            console.log("Fetched education data (public):", res.data);
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
    }
  }, [token, username]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className="max-w-5xl mx-auto py-12 px-8 bg-white"
    >
      <h2 className="text-4xl font-bold text-left text-red-500 mb-12 tracking-wide">
        Education
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {educationData.length === 0 ? (
          <p className="text-center text-gray-600">No education entries found.</p>
        ) : (
          educationData.map((item, index) => (
            <div key={item.id || index} className="flex flex-col md:flex-row items-start">
              <div className="w-full md:w-[30%] pr-6">
                <p className="text-gray-600 text-md">{item.year}</p>
                <p className="text-lg font-semibold text-gray-800">{item.university}</p>
                <h4 className="text-red-500 text-sm font-medium">{item.degree}</h4>
              </div>
              {/* Vertical divider (visible on md and above) */}
              <div className="hidden md:block border-l-2 border-gray-200 h-full mx-6"></div>
              <div className="w-full md:w-[70%] pl-6">
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Education2;
