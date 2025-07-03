const express = require("express");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../config/multer"); 
const Note = require("../models/Note");


router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    if (!req.file || !title || !subject) {
      return res.status(400).json({ message: "File, title, and subject are required" });
    }

    const newNote = new Note({
      title,
      subject,
      description,
      fileUrl: req.file.path,
      uploadedBy: req.user.userId, 
      downloadedBy: [],
      downloadCount: 0,
    });

    await newNote.save();

    res.status(201).json({
      message: "Note uploaded successfully",
      note: newNote,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error while uploading note" });
  }
});


router.get("/", async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "username email");

    res.status(200).json({ notes });
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("uploadedBy", "username email");
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ note });
  } catch (err) {
    console.error("Fetch single note error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id/download", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const userId = req.user.userId;
    if (!note.downloadedBy.includes(userId)) {
      note.downloadedBy.push(userId);
    }

    note.downloadCount += 1;
    await note.save();

    res.status(200).json({ message: "Download tracked", note });
  } catch (err) {
    console.error("Download tracking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.uploadedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this note" });
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
