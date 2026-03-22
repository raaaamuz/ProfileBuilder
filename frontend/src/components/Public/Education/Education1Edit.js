// src/components/education/Education1Edit.js
import React from "react";

const Education1Edit = ({ data, setData }) => {
 // alert("hi")
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Education1 Template</h2>
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
    </div>
  );
};

export default Education1Edit;
