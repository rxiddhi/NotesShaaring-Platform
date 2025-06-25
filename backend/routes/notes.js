// backend/routes/notes.js
const express = require("express");
const router = express.Router();
const Note = require("../models/Note"); 


router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); 
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching notes." });
  }
});

//download endpoint 
router.put("/:id/download", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error tracking download." });
  }
});

module.exports = router;