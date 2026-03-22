// CareerEditor.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileText, Loader2, ArrowRight, Upload } from "lucide-react";
import CareerRow from "./CareerRow";
import api from "../../../services/api";
import { PreviewContext } from "../PreviewContext";

const CareerEditor = ({ designSettings, onColorClick }) => {
  const navigate = useNavigate();
  const [careerData, setCareerData] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const token = localStorage.getItem("token");

  // Get context to sync career data for preview
  const { updateCareerData, liveHomeData } = useContext(PreviewContext);

  // Get global font from home settings
  const globalFont = liveHomeData?.customSettings?.fontFamily || "Inter, sans-serif";

  useEffect(() => {
    fetchCareerData();
  }, [token]);

  // Sync career data to context whenever it changes
  useEffect(() => {
    if (updateCareerData) {
      updateCareerData(careerData);
    }
  }, [careerData, updateCareerData]);

  // Fetch career entries from the backend
  const fetchCareerData = async () => {
    try {
      // Let the api interceptor handle authentication
      const response = await api.get("/career/entries/");
      // Use "careerEntries" from the backend response (camelCase)
      const entries = Array.isArray(response.data)
        ? response.data
        : response.data.careerEntries || [];
      setCareerData(entries);
    } catch (error) {
      console.error("Error fetching career data:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Handle drag & drop reordering
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = careerData.findIndex((item) => item.id === active.id);
    const newIndex = careerData.findIndex((item) => item.id === over.id);

    const updatedData = arrayMove(careerData, oldIndex, newIndex);
    setCareerData(updatedData);

    // Save new order to backend
    try {
      await api.put(
        "/career/reorder/",
        { reorderedData: updatedData },
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // Add a new empty career entry (with a temporary id)
  const handleAddEmptyEntry = () => {
    const tempId = Date.now();
    const newEntry = {
      id: tempId,
      year: "",
      title: "",
      company: "",
      color: "#ff0000",
      borderColor: "#ff0000",
      isNew: true,
    };

    setCareerData((prev) => [...prev, newEntry]);
    toggleExpand(tempId);
  };

  // Create a new entry on the backend when the first update occurs
  const handleCreateEntry = async (entry) => {
    try {
      const response = await api.post(
        "/career/entries/",
        {
          year: entry.year,
          title: entry.title,
          company: entry.company,
          color: entry.color,
          borderColor: entry.borderColor,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      const savedEntry = response.data;
      setCareerData((prev) =>
        prev.map((e) => (e.id === entry.id ? savedEntry : e))
      );
    } catch (error) {
      console.error("Error creating career entry:", error);
    }
  };

  // Update an existing entry
  const handleUpdateEntry = useCallback(
    async (updatedEntry) => {
      setCareerData((prev) =>
        prev.map((entry) =>
          entry.id === updatedEntry.id ? updatedEntry : entry
        )
      );
      try {
        await api.put(
          `/career/entries/${updatedEntry.id}/`,
          updatedEntry,
          { headers: { Authorization: `Token ${token}` } }
        );
      } catch (error) {
        console.error("Error updating career entry:", error);
      }
    },
    [token]
  );

  // Delete a career entry
  const handleDelete = async (id) => {
    try {
      await api.delete(`/career/entries/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCareerData((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting career entry:", error);
    }
  };

  // Import career from CV using AI
  const handleImportFromCV = async () => {
    setIsImporting(true);
    setImportMessage("");
    try {
      const response = await api.post("/ai/import-from-cv/", { section: "career" });
      if (response.data.success) {
        setImportMessage(`Imported ${response.data.imported.career} career entries from your CV!`);
        fetchCareerData();
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
        <SortableContext
          items={careerData.map((entry) => entry.id)}
          strategy={verticalListSortingStrategy}
        >
          {careerData.map((entry, index) => (
            <CareerRow
              key={entry.id}
              entry={entry}
              index={index}
              isExpanded={expandedIds.includes(entry.id)}
              onToggleExpand={() => toggleExpand(entry.id)}
              onCreateEntry={handleCreateEntry}
              onUpdateEntry={handleUpdateEntry}
              onDelete={handleDelete}
              designSettings={designSettings}
              onColorClick={onColorClick}
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
          + Add Career Entry
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

export default CareerEditor;
