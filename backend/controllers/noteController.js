const Note = require("../models/Note");
const summarizeText = require("../utils/summarizer");
const uploadNote = async (req, res) => {
try {
    const { title, subject, description, fileUrl } = req.body;
    const uploadedBy = req.user?.userId;
    if (!title || !fileUrl) {
      return res.status(400).json({ message: "Title and fileUrl are required" });
    }
const fullText = description || title + " " + subject;
const summary = await summarizeText(fullText);
const newNote = await Note.create({
      title,
      subject,
      description,
      fileUrl,
      uploadedBy,
      summary,
    });
    res.status(201).json({ message: "Note uploaded", note: newNote });
  }catch (err) {
    console.error("Upload note error:", err.message);
    res.status(500).json({ message: "Server error while uploading note" });
  }
};
const getNoteById = async (req, res) => {
try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  }catch (err) {
    res.status(500).json({ message: "Error fetching note" });
  }
};
module.exports = { uploadNote, getNoteById };
