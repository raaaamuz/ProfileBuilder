import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../services/api';

const ProfileSummary = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch the user profile data from the backend
    api.get('/profile/user-profile/')
      .then(response => {
        // If the API returns an array, use the first element; otherwise, use the object directly
        if (Array.isArray(response.data) && response.data.length > 0) {
          setProfile(response.data[0]);
        } else if (response.data && response.data.id) {
          setProfile(response.data);
        }
      })
      .catch(error => console.log(error));
  }, []);

  if (!profile) {
    return <p>Loading...</p>;
  }

  // Fallback for social: if profile.social is undefined, assign default social links.
  const social = profile.social || {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/"
  };

  return (
    <div className="user-profile">
      <img src={profile.profile_picture} alt="Profile" className="profile-picture" />
      <h1>{profile.email}</h1>
      <p>{profile.phone}</p>
      <div>{profile.bio}</div>
      {profile.cv && <a href={profile.cv} download>Download CV</a>}
      <div className="social-links">
        <a href={social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
};

export default ProfileSummary;
