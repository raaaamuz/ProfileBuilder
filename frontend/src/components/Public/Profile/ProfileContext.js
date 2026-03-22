import { createContext, useContext, useState } from "react";

// Create Profile Context
const ProfileContext = createContext();

// Custom Hook for using Profile Context
export const useProfile = () => useContext(ProfileContext);

// ProfileProvider Component
export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: "Nagarajan",
    bio: "I am Nagarajan, a Market Research professional with more than a decade of experience in the industry.",
    image: "",
    phone: "+91 9790094922",
    email: "nagaking@outlook.com",
    linkedin: "https://www.linkedin.com/in/itsnagarajan/",
    youtube: "https://www.youtube.com/channel/UCEvcyYAo4oeI24gRpDYr0Hw",
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    cv: "",
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};
