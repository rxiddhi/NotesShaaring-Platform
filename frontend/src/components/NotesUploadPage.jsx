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
      setToastMessage(":x: Please select a file before submitting.");
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
        setToastMessage(":warning: You must be logged in to upload.");
        return;
      }

      await axios.post(`${API_BASE_URL}/notes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setToastColor("bg-green-500");
      setToastMessage(":white_check_mark: Notes uploaded successfully!");
      setTitle("");
      setSubject("");
      setDescription("");
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(":x: Upload failed:", error);
      if (error.response?.status === 401) {
        setToastColor("bg-red-500");
        setToastMessage(":lock: Session expired. Please log in again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 font-sans flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700">Upload Your Notes</h1>
          <p className="text-gray-500 mt-2">Help others by sharing your academic notes</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter subject (e.g., Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Add a brief description of your notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={fileInputRef}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Accepted formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white text-lg font-semibold rounded-xl transition duration-300 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg"
          >
            Upload Notes
          </button>
        </form>
      </div>
      {toastMessage && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded-xl shadow-lg z-50 ${toastColor}`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
