import React, { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import ResumeTemplate from "./ResumeTemplate"; // Ensure this is the updated file
import DownloadPDFButton from "./DownloadPDFButton"; // Adjust the path as needed

export default function ResumeHTMLRenderer({ username }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/public/profile/${username}/`);
        console.log("Profile API response:", response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="loader mb-4"></div>
          <p>Loading resume...</p>
        </div>
      ) : (
        <>
          {/* Download button positioned at the top-right corner */}
          <div className="fixed top-4 right-4 z-50 print:hidden">
            <DownloadPDFButton contentRef={resumeRef} />
          </div>
          <div ref={resumeRef} className="flex justify-center p-4">
            <ResumeTemplate data={profileData} />
          </div>
        </>
      )}
    </div>
  );
}
