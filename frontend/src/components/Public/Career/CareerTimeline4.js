import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

const CareerTimeline = () => {
  const [careerData, setCareerData] = useState([]);
  const token = localStorage.getItem("token");
  const { username } = useParams(); // Get username from URL if available

  useEffect(() => {
    if (token) {
      // Logged-in user: fetch data from private career entries endpoint.
      api
        .get("/career/entries/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // For logged-in user, assuming the API response is an array
          // and the first element contains career_entries.
          let entries = [];
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
      // Public user: username must be provided to fetch public profile data.
      if (username) {
        api
          .get(`/public/profile/${username}/`)
          .then((res) => {
            // For public user, the API response is an object with a career_entries property.
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

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-6 md:px-60">
      <div className="space-y-6 border-l-2 border-dashed">
        {careerData.length === 0 ? (
          <p className="text-center text-gray-600">No career entries found.</p>
        ) : (
          careerData.map((item, index) => (
            <div key={item.id || index} className="relative w-full">
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute -top-0.5 z-10 -ml-3.5 h-7 w-7 rounded-full text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-6">
                <span className="mt-1 block text-sm font-semibold text-blue-500">
                  {item.year}
                </span>
                <h4 className="font-bold text-blue-500">
                  {item.title} at {item.company}
                </h4>
                <p className="mt-2 max-w-screen-sm text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CareerTimeline;
