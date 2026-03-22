import React, { useRef } from "react";

const FileDropZone = ({ onFilesAdded }) => {
  const dropzoneRef = useRef(null);
  const fileInputRef = useRef(null);

  

  const handleDragOver = (e) => {
    e.preventDefault();
    dropzoneRef.current.classList.add("border-blue-500");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropzoneRef.current.classList.remove("border-blue-500");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropzoneRef.current.classList.remove("border-blue-500");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // Trigger file input click when dropzone is clicked
  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      ref={dropzoneRef}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="bg-gray-100 p-4 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md cursor-pointer max-w-xs mx-auto"
    >
      <svg
        className="w-8 h-8 text-gray-400 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <span className="text-gray-600 block">Drop files here</span>
      <span className="text-gray-500 text-xs block">(or click to select)</span>
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"  // restricts selection to video files
        onChange={(e) => onFilesAdded(e.target.files)}
        className="hidden"
        />
    </div>
  );
};

FileDropZone.defaultProps = {
  onFilesAdded: () => {},
};

export default FileDropZone;
