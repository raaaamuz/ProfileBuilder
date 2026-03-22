import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const EducationRow = ({ entry, isExpanded, onToggleExpand, onUpdateEntry, onDelete, onCreateEntry, globalFont, index = 0 }) => {
  const [formData, setFormData] = useState(entry);

  // Sortable hook for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const containerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  useEffect(() => {
    setFormData(entry);
  }, [entry]);

  const debouncedUpdate = useCallback(
    debounce((updatedData) => {
      if (entry.isNew) {
        onCreateEntry(updatedData);
      } else {
        onUpdateEntry(updatedData);
      }
    }, 800),
    [entry.isNew, onCreateEntry, onUpdateEntry]
  );

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    debouncedUpdate(updatedData);
  };

  return (
    <div ref={setNodeRef} style={containerStyle} className="mb-2 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md rounded-lg w-full border border-slate-600/50">
      <div
        className="flex items-center px-3 py-2.5 cursor-pointer text-white bg-slate-700/80 hover:bg-slate-700 transition-colors"
        onClick={onToggleExpand}
        title="Toggle details"
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 mr-2 hover:bg-slate-600 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <GripVertical size={14} className="text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight text-slate-100">
            {formData.degree || "New Education Entry"}
            {formData.university && <span className="text-slate-400"> – {formData.university}</span>}
          </div>
          <div className="text-xs mt-0.5 text-purple-400">{formData.year}</div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(formData.id);
            }}
            title="Delete"
            className="text-slate-400 hover:text-red-400 transition-all duration-200 p-1"
          >
            <Trash2 size={14} />
          </button>
          <span className="text-slate-400">{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 py-3 bg-slate-800/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 transition-all duration-200"
                placeholder="Year"
              />
              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 transition-all duration-200"
                placeholder="Degree"
              />

              {/* University field */}
              <div className="md:col-span-2">
                <input
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 transition-all duration-200"
                  placeholder="University"
                />
              </div>

              {/* Description field */}
              <div className="md:col-span-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 h-28 resize-none transition-all duration-200"
                  placeholder="Description"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EducationRow;
