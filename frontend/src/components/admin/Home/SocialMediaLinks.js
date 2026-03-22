import React from "react";

const SocialMediaLinks = ({ formData, handleChange }) => {
  const platforms = [
    { name: "youtube_link", label: "YouTube Link" },
    { name: "linkedin_link", label: "LinkedIn Link" },
    { name: "facebook_link", label: "Facebook Link" },
    { name: "twitter_link", label: "Twitter Link" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Social Media Links, <span className="font-normal">please update your links</span>
      </h1>
      <div className="grid gap-3 mt-6">
        {platforms.map((platform) => (
          <div key={platform.name}>
            <label
              htmlFor={platform.name}
              className="block text-xs font-semibold text-gray-600 uppercase"
            >
              {platform.label}
            </label>
            <input
              id={platform.name}
              type="url"
              name={platform.name}
              value={formData[platform.name] || ""}
              onChange={handleChange}
              placeholder={`Enter your ${platform.label}`}
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
