import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A simple debounce hook.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Single education row component.
// It works for both new entries and existing entries.
const EducationRow = ({
  entry,
  isExpanded,
  onToggleExpand,
  onAutoSave,
  onDelete,
  isNew = false,
}) => {
  const [formData, setFormData] = useState(entry);

  // Update form data when the parent sends a new entry (for editing).
  useEffect(() => {
    setFormData(entry);
  }, [entry]);

  // Use a debounced version of the form data.
  const debouncedData = useDebounce(formData, 1000);

  // When the debounced value changes, auto-save.
  useEffect(() => {
    onAutoSave(formData, isNew);
  }, [debouncedData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mb-6 rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200">
      <div
        className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-50 cursor-pointer"
        onClick={onToggleExpand}
        title="Toggle details"
      >
        <div className="flex-1">
          {isNew ? (
            <span className="font-bold text-blue-700">+ Add Education Entry</span>
          ) : (
            <>
              <div className="font-bold text-xl text-gray-800">
                {formData.degree || "Education Entry"}
                {formData.university && (
                  <span className="text-gray-600"> – {formData.university}</span>
                )}
              </div>
              <div className="text-sm text-gray-600">{formData.year}</div>
            </>
          )}
        </div>
        {/* Delete icon visible for existing entries */}
        {!isNew && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(formData.id);
            }}
            title="Delete"
            className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
          >
            <span className="text-2xl">&times;</span>
          </button>
        )}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-6 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Year Input */}
  <div className="flex flex-col">
    <label htmlFor="year" className="mb-1 text-sm font-medium text-gray-700">
      Year
    </label>
    <input
      id="year"
      name="year"
      placeholder="Enter Year"
      value={formData.year}
      onChange={handleChange}
      className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
    />
  </div>

  {/* Degree Input */}
  <div className="flex flex-col">
    <label htmlFor="degree" className="mb-1 text-sm font-medium text-gray-700">
      Degree
    </label>
    <input
      id="degree"
      name="degree"
      placeholder="Enter Degree"
      value={formData.degree}
      onChange={handleChange}
      className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
    />
  </div>

  {/* University Input */}
  <div className="flex flex-col">
    <label htmlFor="university" className="mb-1 text-sm font-medium text-gray-700">
      University
    </label>
    <input
      id="university"
      name="university"
      placeholder="Enter University"
      value={formData.university}
      onChange={handleChange}
      className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
    />
  </div>

  {/* Description Input (using textarea for better UX with longer text) */}
  <div className="flex flex-col md:col-span-2">
    <label htmlFor="description" className="mb-1 text-sm font-medium text-gray-700">
      Description
    </label>
    <textarea
      id="description"
      name="description"
      placeholder="Enter Description"
      value={formData.description}
      onChange={handleChange}
      className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out resize-none h-24"
    />
  </div>

  {/* Color Picker */}
  {/* <div className="flex items-center md:col-span-2">
    <label htmlFor="color" className="mr-3 text-sm font-medium text-gray-700">
      Color:
    </label>
    <input
      id="color"
      type="color"
      name="color"
      value={formData.color}
      onChange={handleChange}
      className="w-12 h-12 p-0 border-0 cursor-pointer"
    />
  </div> */}
</div>

            <p className="text-xs text-gray-500 mt-4">
              Changes are auto-saved...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EducationEditor = ({ educationData, onAddOrUpdate, onDelete }) => {
  // Use an array to keep track of which rows are expanded.
  const [expandedIds, setExpandedIds] = useState([]);

  // Create a local copy of the data to include new entries.
  const [entries, setEntries] = useState(educationData || []);

  // Update entries when educationData changes.
  useEffect(() => {
    setEntries(educationData || []);
  }, [educationData]);

  // Toggle expansion for a given id.
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Called from each row when auto-save should occur.
  const handleAutoSave = (updatedData, isNew) => {
    if (isNew) {
      if (
        updatedData.year ||
        updatedData.degree ||
        updatedData.university ||
        updatedData.description
      ) {
        // Create a new id (in a real app, generate a unique id).
        const newId = Date.now();
        const newEntry = { ...updatedData, id: newId };
        onAddOrUpdate(newEntry);
        setEntries([...entries, newEntry]);
        // Collapse the new row.
        setExpandedIds((prev) => prev.filter((id) => id !== "new"));
      }
    } else {
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === updatedData.id ? updatedData : entry
        )
      );
      onAddOrUpdate(updatedData);
    }
  };

  // Handle delete for both new and existing rows.
  const handleDelete = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    onDelete(id);
    // Collapse if the deleted entry was expanded.
    setExpandedIds((prev) => prev.filter((e) => e !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* New entry row */}
      <EducationRow
        entry={{
          id: "new",
          year: "",
          degree: "",
          university: "",
          description: "",
          //color: "#ffddc1",
        }}
        isExpanded={expandedIds.includes("new")}
        onToggleExpand={() => toggleExpand("new")}
        onAutoSave={handleAutoSave}
        onDelete={() => {}}
        isNew={true}
      />

      {/* List all existing entries */}
      {entries.map((entry) => (
        <EducationRow
          key={entry.id}
          entry={entry}
          isExpanded={expandedIds.includes(entry.id)}
          onToggleExpand={() => toggleExpand(entry.id)}
          onAutoSave={handleAutoSave}
          onDelete={handleDelete}
          isNew={false}
        />
      ))}
    </div>
  );
};

export default EducationEditor;
