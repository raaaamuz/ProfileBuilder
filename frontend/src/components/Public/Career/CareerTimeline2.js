import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../services/api";
import "./Career.css";

const CareerTimeline = () => {
  const [careerData, setCareerData] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const token = localStorage.getItem("token");
  const { username } = useParams(); // Get username from URL if available

  // Fetch Career Data from API
  useEffect(() => {
    if (token) {
      // Logged-in user: fetch data from private career entries endpoint
      api
        .get("/career/entries/", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          let entries = [];
          // Assume the private response is an array where the first element contains career_entries
          if (Array.isArray(res.data) && res.data.length > 0) {
            entries = res.data[0].career_entries || [];
          } else if (res.data && res.data.career_entries) {
            entries = res.data.career_entries;
          }
          setCareerData(entries);
        })
        .catch((err) => {
          console.error("Error fetching career data:", err);
          setCareerData([]);
        });
    } else {
      // Public user: fetch data from public profile endpoint using username from URL
      if (username) {
        api
          .get(`/public/profile/${username}/`)
          .then((res) => {
            // In the public API response, career_entries is directly available.
            const entries = res.data?.career_entries || [];
            setCareerData(entries);
          })
          .catch((err) => {
            console.error("Error fetching public profile career data:", err);
            setCareerData([]);
          });
      } else {
        console.warn("No username provided for public view.");
        setCareerData([]);
      }
    }
  }, [token, username]);

  // Fetch Design Settings (only font settings) from API for logged-in user
  useEffect(() => {
    if (token) {
      api
        .get("/career/settings/get_user_settings/", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (res.data) {
            const { font_size, font_family } = res.data;
            setFontSize(font_size || 16);
            setFontFamily(font_family || "Arial");
          }
        })
        .catch((err) => console.error("Error fetching design settings:", err));
    }
  }, [token]);

  return (
    <div className="relative max-w-6xl mx-auto p-12 bg-gray-50 rounded-lg shadow-lg">
      <h2
        style={{ fontFamily, fontSize: `${fontSize * 2}px` }}
        className="text-3xl font-bold text-center text-gray-800 mb-8"
      >
        Career Timeline
      </h2>

      {/* Horizontal line with top margin */}
      <hr className="mt-30 border-black-300" />

      {/* Vertical line running down the center */}
      <div className="absolute left-1/2 top-0 w-1 bg-black-300 h-full transform -translate-x-1/2"></div>

      <div className="space-y-12">
        {careerData.length === 0 ? (
          <p className="text-center text-gray-600">No career entries found.</p>
        ) : (
          careerData.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative w-full md:w-1/2 ${
                index % 2 === 0 ? "ml-auto text-right" : "mr-auto text-left"
              }`}
            >
              <div className="relative">
                {/* Year marker */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-lg w-20 h-12 flex items-center justify-center text-white font-bold text-sm"
                >
                  {item.year}
                </div>
                {/* Content card */}
                <div
                  className={`mt-6 p-6 bg-white rounded-lg shadow-md border-l-4 ${
                    index % 2 === 0 ? "border-blue-500" : "border-green-500"
                  }`}
                >
                  <h3
                    style={{ fontFamily, fontSize: `${fontSize}px` }}
                    className="text-xl font-semibold text-gray-800 w-full break-words text-center"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily, fontSize: `${fontSize}px` }}
                    className="mt-2 text-gray-600 text-sm w-full break-words text-center"
                  >
                    {item.company}
                  </p>
                  {item.description && (
                    <div className="w-full mt-4">
                      <p
                        style={{
                          fontFamily,
                          fontSize: `${fontSize * 0.75}px`,
                          textAlign: "justify",
                        }}
                        className="text-gray-700 leading-relaxed break-words"
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
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
