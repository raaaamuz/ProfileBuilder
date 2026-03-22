import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import api from "../../../services/api";

const CVUpload = () => {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [parseResult, setParseResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!cvFile) {
      setMessage("Please select a CV file first");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setParseResult(null);

    try {
      const formData = new FormData();
      formData.append("cv", cvFile);

      const token = localStorage.getItem("token");
      const response = await api.post("/profile/upload-cv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });

      const data = response.data;
      setMessage(data.message || "CV uploaded successfully!");

      if (data.parsed_data) {
        setParseResult(data.parsed_data);
        // Wait longer so user can see what was imported
        setTimeout(() => {
          navigate("/dashboard/profile");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/dashboard/home");
        }, 1500);
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      setMessage("Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/profile/skip-onboarding/", {}, {
        headers: { Authorization: `Token ${token}` },
      });
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    }
    navigate("/dashboard/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-4">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-300">
            Upload your CV to get started. Our AI will help you build your professional profile.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? "border-purple-400 bg-purple-500/20"
                : cvFile
                ? "border-green-400 bg-green-500/10"
                : "border-gray-500 hover:border-purple-400"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {cvFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-400 mb-3" size={48} />
                <p className="text-white font-medium">{cvFile.name}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400 mb-3" size={48} />
                <p className="text-white font-medium">Drag & drop your CV here</p>
                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                <p className="text-gray-500 text-xs mt-3">PDF, DOC, DOCX (Max 10MB)</p>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.includes("Failed") || message.includes("error")
                ? "bg-red-500/20 text-red-300"
                : "bg-green-500/20 text-green-300"
            }`}>
              {message}
            </div>
          )}

          {/* Parse Results */}
          {parseResult && (
            <div className="mt-4 p-4 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                Profile Auto-Filled
              </h3>
              <div className="space-y-2 text-sm">
                {parseResult.name && (
                  <p className="text-gray-300"><span className="text-gray-400">Name:</span> {parseResult.name}</p>
                )}
                {parseResult.email && (
                  <p className="text-gray-300"><span className="text-gray-400">Email:</span> {parseResult.email}</p>
                )}
                {parseResult.experience?.length > 0 && (
                  <p className="text-gray-300"><span className="text-gray-400">Experience:</span> {parseResult.experience.length} positions imported</p>
                )}
                {parseResult.education?.length > 0 && (
                  <p className="text-gray-300"><span className="text-gray-400">Education:</span> {parseResult.education.length} entries imported</p>
                )}
                {parseResult.skills?.length > 0 && (
                  <p className="text-gray-300"><span className="text-gray-400">Skills:</span> {parseResult.skills.length} skills imported</p>
                )}
              </div>
              <p className="text-indigo-300 text-xs mt-3">Redirecting to your profile...</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-6 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-white/5 transition-all font-medium"
            >
              Skip for now
            </button>
            <button
              onClick={handleUpload}
              disabled={!cvFile || isUploading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">AI</div>
            Auto-fill profile
          </div>
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">5x</div>
            Faster setup
          </div>
          <div className="text-gray-400 text-sm">
            <div className="text-2xl mb-1">100%</div>
            Secure
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
