import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FileText, Loader2, ArrowRight, Upload } from "lucide-react";
import EducationRow from "./EducationRow";
import api from "../../../services/api";
import { PreviewContext } from "../PreviewContext";

const EducationEditor = () => {
  const navigate = useNavigate();
  const [educationData, setEducationData] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");

  // Get context to sync education data for preview
  const { updateEducationData, liveHomeData } = useContext(PreviewContext);

  // Get global font from home settings
  const globalFont = liveHomeData?.customSettings?.fontFamily || "Inter, sans-serif";

  useEffect(() => {
    fetchEducationData();
  }, []);

  // Sync education data to context whenever it changes
  useEffect(() => {
    if (updateEducationData) {
      updateEducationData(educationData);
    }
  }, [educationData, updateEducationData]);

  // Fetch all education entries from the backend
  const fetchEducationData = async () => {
    try {
      const response = await api.get("/education/entries/");
      setEducationData(response.data);
    } catch (error) {
      console.error("Error fetching education data:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = educationData.findIndex((item) => item.id === active.id);
    const newIndex = educationData.findIndex((item) => item.id === over.id);

    const updatedData = arrayMove(educationData, oldIndex, newIndex);
    setEducationData(updatedData);

    // Save reordering to backend
    try {
      await api.put("/education/reorder/", { reorderedData: updatedData });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Properly adds an empty entry and updates backend correctly
  const handleAddEmptyEntry = () => {
    const tempId = Date.now(); // Generate a unique temp ID (not used in backend)
    const newEntry = {
      id: tempId, // Temporary identifier (not sent to backend)
      year: "",
      degree: "",
      university: "",
      description: "",
      isNew: true, // Mark this as a new item that hasn't been saved yet
    };

    // Immediately add the new empty entry to state
    setEducationData((prevData) => [...prevData, newEntry]);
    toggleExpand(tempId); // Expand the new row immediately
  };

  const handleCreateEntry = async (entry) => {
    try {
      const response = await api.post("/education/entries/", {
        year: entry.year,
        degree: entry.degree,
        university: entry.university,
        description: entry.description,
      });
      const savedEntry = response.data; // Get actual backend entry with a real ID

      // Replace temporary entry with backend entry
      setEducationData((prevData) =>
        prevData.map((e) => (e.id === entry.id ? savedEntry : e))
      );
    } catch (error) {
      console.error("Error creating new entry:", error);
    }
  };

  // Handle field updates and auto-save to backend (debounced)
  const handleUpdateEntry = useCallback(
    async (updatedEntry) => {
      setEducationData((prevData) =>
        prevData.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
      );

      try {
        await api.put(`/education/entries/${updatedEntry.id}/`, updatedEntry);
      } catch (error) {
        console.error("Error updating entry:", error);
      }
    },
    []
  );

  // Delete an entry
  const handleDelete = async (id) => {
    try {
      await api.delete(`/education/entries/${id}/`);
      setEducationData((prevData) => prevData.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Import education from CV using AI
  const handleImportFromCV = async () => {
    setIsImporting(true);
    setImportMessage("");
    try {
      const response = await api.post("/ai/import-from-cv/", { section: "education" });
      if (response.data.success) {
        setImportMessage(`Imported ${response.data.imported.education} education entries from your CV!`);
        // Refresh education data
        fetchEducationData();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to import from CV";
      setImportMessage(errorMsg);
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportMessage(""), 5000);
    }
  };

  return (
    <div className="w-full p-4 pb-20 relative" style={{ fontFamily: globalFont }}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={educationData.map((entry) => entry.id)} strategy={verticalListSortingStrategy}>
          {educationData.map((entry, index) => (
            <EducationRow
              key={entry.id}
              entry={entry}
              index={index}
              isExpanded={expandedIds.includes(entry.id)}
              onToggleExpand={() => toggleExpand(entry.id)}
              onUpdateEntry={handleUpdateEntry}
              onDelete={handleDelete}
              onCreateEntry={handleCreateEntry}
              globalFont={globalFont}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Import Message */}
      {importMessage && (
        <div className={`mb-3 p-2 rounded text-sm font-medium ${
          importMessage.includes("Imported")
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 text-slate-700 border border-slate-200"
        }`}>
          {importMessage.includes("No CV") ? (
            <div className="flex items-center justify-between">
              <span>{importMessage}</span>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-1 px-2 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 transition text-xs font-medium"
              >
                <Upload size={14} />
                Upload CV
              </Link>
            </div>
          ) : (
            importMessage
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        <button
          className="flex-1 px-3 py-2 text-sm border border-slate-300 text-slate-700 font-medium text-center rounded cursor-pointer hover:bg-slate-100 transition bg-white"
          onClick={handleAddEmptyEntry}
        >
          + Add Education Entry
        </button>
        <button
          onClick={handleImportFromCV}
          disabled={isImporting}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700 text-white font-medium rounded hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Importing...
            </>
          ) : (
            <>
              <FileText size={14} />
              Import from CV
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default EducationEditor;