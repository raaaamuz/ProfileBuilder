import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import "./Career.css";

const CareerTimeline = () => {
  const [careerData, setCareerData] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const token = localStorage.getItem("token");
  const { username } = useParams(); // Get username from URL if available

  useEffect(() => {
    if (token) {
      // Logged-in user: fetch data from private career entries endpoint.
      api
        .get("/career/entries/", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          // Assuming the private response is an array with the first element containing career_entries.
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
      // Public user: fetch data from public profile endpoint using the username from URL.
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

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden antialiased">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
          <div className="w-full max-w-3xl mx-auto">
            {/* Vertical Timeline */}
            <div className="timeline space-y-8 relative md:before:ml-[8.75rem]">
              {careerData.length === 0 ? (
                <p className="text-center text-gray-600">No career entries found.</p>
              ) : (
                careerData.map((item, index) => (
                  <div key={item.id || index} className="relative">
                    <div className="md:flex items-center md:space-x-4 mb-3">
                      <div className="flex items-center space-x-4 md:space-x-2 md:space-x-reverse">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow md:order-1">
                          {index % 2 === 0 ? (
                            <svg className="fill-emerald-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                              <path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                              <path className="fill-slate-300" d="M14.853 6.861C14.124 10.348 10.66 13 6.5 13c-.102 0-.201-.016-.302-.019C7.233 13.618 8.557 14 10 14c.51 0 1.003-.053 1.476-.143L14.2 15.9a.499.499 0 0 0 .8-.4v-3.515c.631-.712 1-1.566 1-2.485 0-.987-.429-1.897-1.147-2.639Z" />
                              <path className="fill-slate-500" d="M6.5 0C2.91 0 0 2.462 0 5.5c0 1.075.37 2.074 1 2.922V11.5a.5.5 0 0 0 .8.4l1.915-1.436c.845.34 1.787.536 2.785.536 3.59 0 6.5-2.462 6.5-5.5S10.09 0 6.5 0Z" />
                            </svg>
                          )}
                        </div>
                        {/* Date */}
                        <time style={{ fontFamily, fontSize: `${fontSize}px` }} className="text-sm font-medium text-indigo-500 md:w-28">
                          {item.year}
                        </time>
                      </div>
                      {/* Title and Company */}
                      <div style={{ fontFamily, fontSize: `${fontSize}px` }} className="text-slate-500 ml-14">
                        <span className="text-slate-900 font-bold">{item.title}</span> at {item.company}
                      </div>
                    </div>
                    {/* Description Card */}
                    {item.description && (
                      <div className="bg-white p-4 rounded border border-slate-200 text-slate-500 shadow ml-14 md:ml-44">
                        <p style={{ fontFamily, fontSize: `${fontSize}px` }} className="leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {/* End: Vertical Timeline */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTimeline;
