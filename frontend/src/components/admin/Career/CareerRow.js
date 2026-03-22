import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Dialog, DialogTitle } from "@headlessui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  designSettings,
  onColorClick,
  globalFont,
  index = 0,
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
        { headers: { Authorization: `Token ${token}` } }
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
      { headers: { Authorization: `Token ${token}` } }
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

  // Text style - use globalFont from home settings
  const textStyle = {
    fontSize: designSettings?.fontSize ? `${designSettings.fontSize}px` : undefined,
    fontFamily: globalFont || designSettings?.fontFamily || "inherit",
  };

  // Toolbar configuration for the rich text editor remains unchanged
  const editorToolbarOptions = {
    toolbar: {
      options: ["inline", "blockType", "list", "link", "emoji", "history"],
      inline: { options: ["bold", "italic", "underline", "strikethrough"] },
    },
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
          <div className="font-medium text-sm leading-tight text-slate-100" style={textStyle}>
            {formData.company && <span>{formData.company}</span>}
          </div>
          <div className="text-xs mt-0.5 text-purple-400">
            {formData.year}
          </div>
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
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-3 py-3 bg-slate-800/50 origin-top"
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
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 transition-all duration-200"
                placeholder="Designation"
              />
              <textarea
                name="company"
                value={formData.company}
                onChange={handleChange}
                rows={2}
                className="p-2 text-sm w-full border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-slate-700 text-slate-100 placeholder-slate-400 transition-all duration-200 resize-none"
                placeholder="Company"
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-slate-300">
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
                  className="flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isLoading ? "#666" : "#4a4a4a",
                    color: "#d4a853",
                    border: "1px solid #d4a853"
                  }}
                  onClick={handleImproveDescription}
                  disabled={isLoading}
                  title="Improve your entire description using AI"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Improving...
                    </>
                  ) : (
                    "Improve with AI"
                  )}
                </button>
                <button
                  className="flex items-center justify-center px-4 py-2 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isLoading ? "#666" : "#d4a853",
                    color: "#2d2d2d"
                  }}
                  onClick={handleImproveSelectedDescription}
                  disabled={isLoading}
                  title="Improve selected text using AI"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Improving...
                    </>
                  ) : (
                    "Improve Selected"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        as="div"
        className="fixed inset-0 z-[9999] overflow-y-auto"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl z-10">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <DialogTitle as="h3" className="text-xl font-semibold text-gray-800 mb-4">
              AI-Generated Variations
            </DialogTitle>
            <p className="text-sm text-gray-500 mb-4">Click to select one or more variations</p>

            <div className="max-h-96 overflow-y-auto pr-2">
              <ul className="space-y-3">
                {improvedDescriptions.map((desc, index) => (
                  <li
                    key={index}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedDescriptions.includes(desc)
                        ? "bg-indigo-50 border-indigo-400 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectDescription(desc)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedDescriptions.includes(desc)
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{ backgroundColor: "#e5e5e5", color: "#4a4a4a" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applySelectedDescriptionsAppend}
                disabled={selectedDescriptions.length === 0}
                className="px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4a4a4a", color: "#d4a853", border: "1px solid #d4a853" }}
              >
                Append
              </button>
              <button
                type="button"
                onClick={applySelectedDescriptionsReplace}
                disabled={selectedDescriptions.length === 0}
                className="px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#d4a853", color: "#2d2d2d" }}
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CareerRow;
