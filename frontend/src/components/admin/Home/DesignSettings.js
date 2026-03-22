import React, { useRef } from "react";
import { FiVideo, FiUpload, FiTrash2, FiCheckCircle, FiDroplet, FiType } from "react-icons/fi";

const DesignSettings = ({
  formData,
  handleChange,
  handleFileChange,
  fonts,
}) => {
  const fileInputRef = useRef(null);

  const handleRemoveVideo = () => {
    handleFileChange([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files);
  };

  return (
    <div className="space-y-8">
      {/* Background Video Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiVideo className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Background Media</h3>
        </div>

        {/* Compact Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
          className="relative border-2 border-dashed border-purple-300 rounded-xl p-3 cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FiUpload className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-medium text-sm">Drop video or click to browse</p>
              <p className="text-xs text-gray-400">MP4, WebM • Max 50MB</p>
            </div>
          </div>
        </div>

        {/* File Preview */}
        {formData.background_video && (
          <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {formData.background_video instanceof File
                    ? formData.background_video.name
                    : "Video uploaded"}
                </p>
                <p className="text-xs text-gray-500">Ready to save</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        )}

        {/* Video Preview */}
        {formData.background_video_url && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <video
              src={formData.background_video_url}
              className="w-full max-h-48 rounded-lg object-cover"
              controls
              muted
            />
          </div>
        )}
      </div>

      {/* Color Settings */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiDroplet className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Color Scheme</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Color */}
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Text Color
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  name="textColor"
                  value={formData.custom_settings.textColor}
                  onChange={handleChange}
                  className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-colors"
                  style={{ padding: 0 }}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.custom_settings.textColor}
                  onChange={(e) => handleChange({ target: { name: 'textColor', value: e.target.value } })}
                  className="w-full px-3 py-2 text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Background Color
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  name="backgroundColor"
                  value={formData.custom_settings.backgroundColor}
                  onChange={handleChange}
                  className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-colors"
                  style={{ padding: 0 }}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.custom_settings.backgroundColor}
                  onChange={(e) => handleChange({ target: { name: 'backgroundColor', value: e.target.value } })}
                  className="w-full px-3 py-2 text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Settings */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-lg">
            <FiType className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Typography</h3>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Font Family
          </label>
          <select
            name="fontFamily"
            value={formData.custom_settings.fontFamily}
            onChange={handleChange}
            className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent cursor-pointer"
            style={{ fontFamily: formData.custom_settings.fontFamily }}
          >
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};

export default DesignSettings;
