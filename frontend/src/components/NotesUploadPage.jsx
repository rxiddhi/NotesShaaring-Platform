import React, { useState, useRef } from "react";
import "../styles/NotesUploadPage.css";

function NotesUploadPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null); 

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!fileInputRef.current.files[0]) {
      alert("Please upload a file before submitting.");
      return;
    }


 
    setTitle("");
    setSubject("");
    setDescription("");
    fileInputRef.current.value = ""; 
  };

  return (
    <div className="upload-wrapper">
      <div className="upload-box">
        <h1>Upload Your Notes</h1>
        <p>Share your academic notes with the community</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Title <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Subject <span>*</span>
              </label>
              <input
                type="text"
                placeholder="Enter subject (e.g., Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="description-label">
                Description <span>*</span>
              </label>
              <textarea
                placeholder="Add a brief description of your notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="file-upload-label">
                Upload File (PDF, DOC, DOCX) <span>*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
                required 
              />
            </div>
          </div>

          <button type="submit">Upload Notes</button>
        </form>
      </div>
    </div>
  );
}

export default NotesUploadPage;