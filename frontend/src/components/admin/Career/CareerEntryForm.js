// CareerEntryForm.jsx
import React from "react";

const CareerEntryForm = ({
  form,
  handleChange,
  handleSubmit,
  editIndex,
  preview,
  setPreview,
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Add/Edit Career Entry</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="year"
          placeholder="Year Range (e.g., 2010-2015)"
          value={form.year || ""}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="title"
          placeholder="Job Title"
          value={form.title || ""}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="company"
          placeholder="Company Name"
          value={form.company || ""}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="color"
          name="color"
          value={form.color || "#ff0000"}
          onChange={handleChange}
          className="cursor-pointer"
        />
        <input
          type="color"
          name="borderColor"
          value={form.borderColor || "#ff0000"}
          onChange={handleChange}
          className="cursor-pointer"
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          {editIndex !== null ? "Update" : "Add"} Entry
        </button>
        <button
          onClick={() => setPreview((prev) => !prev)}
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          {preview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>
    </div>
  );
};

export default CareerEntryForm;
