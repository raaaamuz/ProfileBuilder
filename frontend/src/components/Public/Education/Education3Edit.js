// src/components/education/Education3Edit.js
import React from "react";

const Education3Edit = ({ data, setData }) => {
  // For demonstration, we use two fields: title and description.
  // You can replace these with actual fields you want to be editable.
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Education3 Template</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="title">
          Title:
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={data.title || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="description">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={data.description || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Enter description"
          rows="4"
        />
      </div>
      {/* You can add more editable fields here */}
    </div>
  );
};

export default Education3Edit;
