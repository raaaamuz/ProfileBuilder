import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog, DialogBackdrop, DialogContent, DialogTitle } from "@headlessui/react";
// Import Draft.js and react-draft-wysiwyg components for description formatting
import { EditorState, ContentState, convertToRaw, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

// Import the editor's CSS
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Import your API service
import api from "../../../services/api";

// A safe conversion function for HTML to Draft.js ContentState
const safeConvertFromHTML = (html) => {
  try {
    const blocksFromHTML = convertFromHTML(html);
    // Ensure we have an array of blocks
    if (
      !blocksFromHTML ||
      !Array.isArray(blocksFromHTML.contentBlocks) ||
      blocksFromHTML.contentBlocks.length === 0
    ) {
      return ContentState.createFromText(html);
    }
    // Filter out any invalid blocks (ensure each block is an object)
    const validBlocks = blocksFromHTML.contentBlocks.filter(
      (block) => typeof block === "object" && block !== null
    );
    if (validBlocks.length === 0) {
      return ContentState.createFromText(html);
    }
    return ContentState.createFromBlockArray(validBlocks, blocksFromHTML.entityMap);
  } catch (error) {
    console.error("Error converting HTML to content state:", error);
    return ContentState.createFromText(html);
  }
};

const CareerRow = ({
  entry,
  isExpanded,
  onToggleExpand,
  onUpdateEntry,
  onDelete,
  onCreateEntry,
  designSettings, // expecting { fontSize, fontFamily, ... }
  onColorClick,   // callback to open preview when a color field is clicked
}) => {
  // Initialize state for the standard fields
  const [formData, setFormData] = useState({
    ...entry,
    description: entry.description || "",
  });

  // For the description rich text editor state (for formatted text)
  const [descriptionEditorState, setDescriptionEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [improvedDescriptions, setImprovedDescriptions] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  const [initialized, setInitialized] = useState(false);
  // On mount (or when entry changes), initialize description editor state from entry.description
  useEffect(() => {
    // Only initialize once or when the entry.id changes
    if (!initialized || entry.id !== formData.id) {
      setFormData({
        ...entry,
        description: entry.description || "",
      });
      if (entry.description) {
        const contentState = safeConvertFromHTML(entry.description);
        setDescriptionEditorState(EditorState.createWithContent(contentState));
      } else {
        setDescriptionEditorState(EditorState.createEmpty());
      }
      setInitialized(true);
    }
  }, [entry, initialized, formData.id]);
  // Debounce updates to prevent excessive API calls
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

  // Generic input handler for simple text fields (company remains a plain textarea)
  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    debouncedUpdate(updatedData);
  };

  // Handler for the description rich text editor
  const onDescriptionEditorStateChange = (newState) => {
    setDescriptionEditorState(newState);
    // Convert Draft.js editor state to HTML
    const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
    const updatedData = { ...formData, description: html };
    setFormData(updatedData);
    debouncedUpdate(updatedData);
  };

  // Handler for "Improve Description" button
  const handleImproveDescription = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "ai/improve-description/",
        { description: formData.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.variations) {
        setImprovedDescriptions(response.data.variations);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error improving description:", error);
    }
    setIsLoading(false);
  };

  const handleSelectDescription = (desc) => {
    setSelectedDescriptions((prev) => {
      if (prev.includes(desc)) {
        return prev.filter((item) => item !== desc);
      } else {
        return [...prev, desc];
      }
    });
  };

  const applySelectedDescriptions = () => {
    if (selectedDescriptions.length > 0) {
      const mergedDescription = selectedDescriptions.join("\n\n");
      setFormData((prev) => ({ ...prev, description: mergedDescription }));
      setDescriptionEditorState(
        EditorState.createWithContent(ContentState.createFromText(mergedDescription))
      );
      debouncedUpdate({ ...formData, description: mergedDescription });
    }
    setIsModalOpen(false);
  };

  // Enable drag handle support with dnd-kit
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Create a text style using designSettings
  const textStyle = {
    fontSize: designSettings?.fontSize ? `${designSettings.fontSize}px` : undefined,
    fontFamily: designSettings?.fontFamily || "inherit",
  };

  // Configuration for the rich text editor for the description field
  const editorToolbarOptions = {
    toolbar: {
      options: ["inline", "blockType", "list", "link", "emoji", "history"],
      inline: { options: ["bold", "italic", "underline", "strikethrough"] },
    },
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-6 overflow-hidden shadow-xl bg-white transition-all duration-300 hover:shadow-2xl"
    >
      <div
        className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-800 to-gray-600 cursor-pointer text-white"
        onClick={onToggleExpand}
        title="Toggle details"
      >
        <div className="flex-1">
          <div className="font-bold text-lg" style={textStyle}>
            {formData.company && (
              <span className="text-indigo-100"> {formData.company}</span>
            )}
          </div>
          <div className="text-sm text-indigo-200" style={textStyle}>
            {formData.year}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(formData.id);
            }}
            title="Delete"
            className="text-white hover:text-red-500 transition-all duration-200"
          >
            <Trash2 size={20} />
          </button>
          <span>{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
          {/* Drag handle indicator */}
          <span {...attributes} {...listeners} className="cursor-move ml-2">
            ≡
          </span>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          // Use scaleY animation with origin at the top for smooth collapse/expand
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 py-6 bg-gray-50 origin-top"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm transition-all duration-300 hover:bg-indigo-100 focus:bg-white"
                placeholder="Year"
                style={textStyle}
              />
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm transition-all duration-300 hover:bg-indigo-100 focus:bg-white"
                placeholder="Designation"
                style={textStyle}
              />
              {/* Company field remains a plain textarea */}
              <textarea
                name="company"
                value={formData.company}
                onChange={handleChange}
                rows={2}
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50 shadow-sm transition-all duration-300 hover:bg-indigo-100 focus:bg-white resize-none"
                placeholder="Company"
                style={textStyle}
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1" style={textStyle}>
                    Card Background Color
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    onClick={onColorClick}
                    className="w-full h-10 p-1 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1" style={textStyle}>
                    Circle Border Color
                  </label>
                  <input
                    type="color"
                    name="borderColor"
                    value={formData.borderColor}
                    onChange={handleChange}
                    onClick={onColorClick}
                    className="w-full h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            {/* Description Field using rich text formatting */}
            <div className="mt-6">
              <label className="block text-sm mb-1" style={textStyle}>
                Description
              </label>
              <Editor
                editorState={descriptionEditorState}
                onEditorStateChange={onDescriptionEditorStateChange}
                toolbar={editorToolbarOptions.toolbar}
                placeholder="Description"
                editorStyle={{
                  ...textStyle,
                  minHeight: "150px",
                  backgroundColor: "#f5f5f5", // Set your desired background color here
                  whiteSpace: "pre-wrap",   // Preserve new lines and spaces
                  direction: "ltr",        // Explicitly set text direction to left-to-right
                }}
              />
              {/* Improve Description Button with Loading Spinner */}
              <div className="mt-2 flex justify-end">
                <button
                  className={`flex items-center justify-center px-6 py-2 rounded-full font-medium text-white shadow-lg transition-all duration-200
                    ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
                  onClick={handleImproveDescription}
                  disabled={isLoading}
                  title="Improve your description using AI"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Improving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2a10 10 0 1010 10A10.0114 10.0114 0 0012 2zm0 18a8 8 0 118-8 8.0092 8.0092 0 01-8 8z" />
                        <path d="M11 6h2v6h-2zM11 14h2v2h-2z" />
                      </svg>
                      Improve with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
              Choose Improved Descriptions
            </DialogTitle>
            <div className="mt-2">
              <ul className="space-y-4">
                {improvedDescriptions.map((desc, index) => (
                  <li
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedDescriptions.includes(desc)
                        ? "bg-indigo-100 border-indigo-200"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectDescription(desc)}
                  >
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={applySelectedDescriptions}
              >
                Apply Selected
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CareerRow;