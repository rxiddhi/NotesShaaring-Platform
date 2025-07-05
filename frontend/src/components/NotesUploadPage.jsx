import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.MODE === "production"
  ? "https://notenest-lzm0.onrender.com/api"
  : "http://localhost:3000/api";

export default function NotesUploadPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("bg-green-500");
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setToastColor("bg-red-500");
      setToastMessage("❌ Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setToastColor("bg-red-500");
        setToastMessage("⚠️ You must be logged in to upload.");
        return;
      }

      await axios.post(`${API_BASE_URL}/notes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setToastColor("bg-green-500");
      setToastMessage("✅ Notes uploaded successfully!");
      setTitle("");
      setSubject("");
      setDescription("");
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Upload failed:", error);
      if (error.response?.status === 401) {
        setToastColor("bg-red-500");
        setToastMessage("🔒 Session expired. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setToastColor("bg-red-500");
        setToastMessage(
          error.response?.data?.message || "Upload failed. Please try again."
        );
      }
    }

    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-10 space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-indigo-600">📘 Upload Notes</h2>
          <p className="text-gray-500 mt-2 text-base">
            Share your study materials with the community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., DBMS Important Questions"
                className="mt-1 w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="e.g., Operating Systems"
                className="mt-1 w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Briefly describe what the note covers"
                className="mt-1 w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Upload File *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
                required
                className="mt-1 w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                Accepted formats: PDF, DOC, DOCX. Max size: ~10MB.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-md transition duration-300"
          >
            Upload Note
          </button>
        </form>
      </div>

      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-xl shadow-xl z-50 ${toastColor}`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
