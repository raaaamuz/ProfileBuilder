import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../services/api";
//import "./Career.css";

const Education1 = () => {
  const [educationData, setEducationData] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState("design1");
  const token = localStorage.getItem("token");
  const { username } = useParams(); // For public view

  // Fetch Education Data from API
  useEffect(() => {
    if (token) {
      // Logged-in user: fetch data from private education entries endpoint.
      api
        .get("/education/entries/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          // API returns array directly
          const entries = Array.isArray(res.data) ? res.data : (res.data?.education_entries || []);
          setEducationData(entries);
        })
        .catch((err) => {
          console.error("Error fetching education data:", err);
          setEducationData([]);
        });
    } else {
      // Public user: fetch education data from public profile endpoint using username from URL.
      if (username) {
        api
          .get(`/public/profile/${username}/`)
          .then((res) => {
            // Public API returns educationEntries
            const entries = res.data?.educationEntries || res.data?.education_entries || [];
            setEducationData(entries);
          })
          .catch((err) => {
            console.error("Error fetching public education data:", err);
            setEducationData([]);
          });
      } else {
        console.warn("No username provided for public view.");
        setEducationData([]);
      }
    }
  }, [token, username]);

  // Fetch Selected Design from API (for logged-in users only)
  useEffect(() => {
    if (token) {
      // Logged-in: fetch from private endpoint.
      api
        .get("/education/selected-design/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          if (res.data && res.data.selected_design) {
            setSelectedDesign(res.data.selected_design);
          } else {
            console.warn("No selected design found, using default.");
            setSelectedDesign("design1");
          }
        })
        .catch((err) => {
          console.error("Error fetching selected design:", err.response?.data || err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            alert("Session expired. Please log in again.");
            window.location.href = "/login";
          }
        });
    } else if (username) {
      // Public user: fetch design from the public endpoint.
      api
        .get(`/public/profile/${username}/`)
        .then((res) => {
          if (res.data && res.data.selected_design) {
            setSelectedDesign(res.data.selected_design);
          } else {
            console.warn("No selected design found in public API, using default.");
            setSelectedDesign("design1");
          }
        })
        .catch((err) => {
          console.error("Error fetching selected design from public API:", err.response?.data || err);
          setSelectedDesign("design1");
        });
    } else {
      // Fallback if neither token nor username is available.
      setSelectedDesign("design1");
    }
  }, [token, username]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-5xl mx-auto py-12 px-8 bg-gray-50 rounded-lg shadow-md"
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 tracking-wide">
        🎓 Education
      </h2>
      
      <div className="space-y-6">
        {educationData.length === 0 ? (
          <p className="text-center text-gray-600">No education entries found.</p>
        ) : (
          educationData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{item.year}</p>
                  <p className="text-xl font-semibold text-gray-900">{item.university}</p>
                  <h4 className="text-red-500 text-md font-medium">{item.degree}</h4>
                </div>
                <div className="hidden md:block border-l-2 border-gray-200 h-12 mx-6"></div>
                <div className="mt-4 md:mt-0 md:pl-6 text-gray-700 text-sm">
                  <p className="whitespace-pre-line">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Education1;
