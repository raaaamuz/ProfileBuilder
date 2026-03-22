import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogBackdrop, DialogContent, DialogTitle } from "@headlessui/react";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
  Modifier  // <--- Import Modifier for text replacement
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import api from "../../../services/api";

// A safe conversion function for HTML to Draft.js ContentState remains unchanged
const safeConvertFromHTML = (html) => {
  try {
    const blocksFromHTML = convertFromHTML(html);
    if (
      !blocksFromHTML ||
      !Array.isArray(blocksFromHTML.contentBlocks) ||
      blocksFromHTML.contentBlocks.length === 0
    ) {
      return ContentState.createFromText(html);
    }
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

// Helper to get selected text from the Draft.js EditorState remains unchanged
const getSelectedText = (editorState) => {
  const selectionState = editorState.getSelection();
  if (selectionState.isCollapsed()) {
    return "";
  }
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blocks = contentState.getBlockMap();
  let isSelecting = false;
  let selectedText = "";

  blocks.forEach((block) => {
    const key = block.getKey();
    if (key === startKey) {
      isSelecting = true;
      const startOffset = selectionState.getStartOffset();
      // If start and end are in the same block
      if (startKey === endKey) {
        const endOffset = selectionState.getEndOffset();
        selectedText += block.getText().slice(startOffset, endOffset);
        isSelecting = false;
      } else {
        selectedText += block.getText().slice(startOffset) + "\n";
      }
    } else if (isSelecting && key !== endKey) {
      selectedText += block.getText() + "\n";
    } else if (key === endKey && isSelecting) {
      const endOffset = selectionState.getEndOffset();
      selectedText += block.getText().slice(0, endOffset);
      isSelecting = false;
    }
  });
  return selectedText.trim();
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
  const [formData, setFormData] = useState({
    ...entry,
    description: entry.description || "",
  });
  const [descriptionEditorState, setDescriptionEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [improvedDescriptions, setImprovedDescriptions] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState([]);
  // New flag to track if the improvements are for selected text only
  const [isSelectedImprovement, setIsSelectedImprovement] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize editor state on mount or when entry changes
  useEffect(() => {
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

  // Handler for standard text fields remains unchanged
  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    debouncedUpdate(updatedData);
  };

  // Handler for rich text editor state changes remains unchanged
  const onDescriptionEditorStateChange = (newState) => {
    setDescriptionEditorState(newState);
    const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
    const updatedData = { ...formData, description: html };
    setFormData(updatedData);
    debouncedUpdate(updatedData);
  };

  // Handler for "Improve Description" button (improves the whole description)
  const handleImproveDescription = async () => {
    setIsLoading(true);
    // For full description improvement, clear the selected improvement flag.
    setIsSelectedImprovement(false);
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

  // Handler for "Improve Selected" content (uses full context + selected text)
// Handler for "Improve Selected" content (uses full context + selected text)
const handleImproveSelectedDescription = async () => {
  // Extract the full content and the selected text
  const fullText = descriptionEditorState.getCurrentContent().getPlainText();
  const selectedText = getSelectedText(descriptionEditorState);

  if (!selectedText) {
    alert("Please select some text to improve.");
    return;
  }

  // Set flag to indicate that these improvements are for the selected text.
  setIsSelectedImprovement(true);

  // Construct a composite description with specific instructions.
  const compositeDescription = `
This is a career description for a user with a specific designation. Based on the user's input, rephrase the following segment. Generate up to 10 rephrased responses that are nearly identical in content, length, and meaning to the original text. Do not add generic details or explanations—simply rephrase the given input.
Full Description:
${fullText}

Rephrase only the following segment:
${selectedText}
  `.trim();

  setIsLoading(true);
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "ai/improve-description/",
      { description: compositeDescription },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data && response.data.variations) {
      setImprovedDescriptions(response.data.variations);
      setIsModalOpen(true);
    }
  } catch (error) {
    console.error("Error improving selected description:", error);
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

  // Option 1: Append the selected improved descriptions to the existing description remains unchanged
  const applySelectedDescriptionsAppend = () => {
    if (selectedDescriptions.length > 0) {
      const currentText = descriptionEditorState.getCurrentContent().getPlainText();
      const mergedDescription =
        currentText.trim() === ""
          ? selectedDescriptions.join("\n\n")
          : currentText + "\n\n" + selectedDescriptions.join("\n\n");

      setFormData((prev) => ({ ...prev, description: mergedDescription }));
      setDescriptionEditorState(
        EditorState.createWithContent(ContentState.createFromText(mergedDescription))
      );
      debouncedUpdate({ ...formData, description: mergedDescription });
    }
    setIsModalOpen(false);
    setSelectedDescriptions([]);
    setIsSelectedImprovement(false);
  };

  // Option 2: Replace the existing description.
  // If the improvements are for a selected segment (isSelectedImprovement is true),
  // replace only the selected text. Otherwise, replace the entire description.
  const applySelectedDescriptionsReplace = () => {
    if (selectedDescriptions.length > 0) {
      const improvedText = selectedDescriptions.join("\n\n");
      if (isSelectedImprovement) {
        // Replace only the selected text using Draft.js Modifier.
        const contentState = descriptionEditorState.getCurrentContent();
        const selectionState = descriptionEditorState.getSelection();
        const newContentState = Modifier.replaceText(contentState, selectionState, improvedText);
        const newEditorState = EditorState.push(descriptionEditorState, newContentState, 'insert-characters');
        setDescriptionEditorState(newEditorState);
        const newHtml = draftToHtml(convertToRaw(newContentState));
        setFormData((prev) => ({ ...prev, description: newHtml }));
        debouncedUpdate({ ...formData, description: newHtml });
      } else {
        // Replace the entire description.
        const newDescription = improvedText;
        setFormData((prev) => ({ ...prev, description: newDescription }));
        setDescriptionEditorState(
          EditorState.createWithContent(ContentState.createFromText(newDescription))
        );
        debouncedUpdate({ ...formData, description: newDescription });
      }
    }
    setIsModalOpen(false);
    setSelectedDescriptions([]);
    setIsSelectedImprovement(false);
  };

  // Container style for the row (drag-and-drop disabled)
  const containerStyle = {};

  // Text style from designSettings remains unchanged
  const textStyle = {
    fontSize: designSettings?.fontSize ? `${designSettings.fontSize}px` : undefined,
    fontFamily: designSettings?.fontFamily || "inherit",
  };

  // Toolbar configuration for the rich text editor remains unchanged
  const editorToolbarOptions = {
    toolbar: {
      options: ["inline", "blockType", "list", "link", "emoji", "history"],
      inline: { options: ["bold", "italic", "underline", "strikethrough"] },
    },
  };

  return (
    <div style={containerStyle} className="mb-6 overflow-hidden shadow-xl bg-white transition-all duration-300 hover:shadow-2xl">
      <div
        className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-800 to-gray-600 cursor-pointer text-white"
        onClick={onToggleExpand}
        title="Toggle details"
      >
        <div className="flex-1">
          <div className="font-bold text-lg" style={textStyle}>
            {formData.company && <span className="text-indigo-100"> {formData.company}</span>}
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
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
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
                    Circle Border/Text Color
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
                  backgroundColor: "#f5f5f5",
                  whiteSpace: "pre-wrap",
                  direction: "ltr",
                }}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  className={`flex items-center justify-center px-6 py-2 rounded-full font-medium text-white shadow-lg transition-all duration-200 ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  }`}
                  onClick={handleImproveDescription}
                  disabled={isLoading}
                  title="Improve your entire description using AI"
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
                {/* New button for improving only the selected text */}
                <button
                  className={`flex items-center justify-center px-6 py-2 rounded-full font-medium text-white shadow-lg transition-all duration-200 ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  }`}
                  onClick={handleImproveSelectedDescription}
                  disabled={isLoading}
                  title="Improve selected text using AI"
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
                      Improve Selected
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
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                onClick={applySelectedDescriptionsAppend}
              >
                Append to Existing
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                onClick={applySelectedDescriptionsReplace}
              >
                Replace Existing
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CareerRow;
