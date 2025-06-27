const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching notes." });
  }
});


router.put("/:id/download", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { downloadCount: 1 },
        $addToSet: { downloadedBy: userId } 
      },
      { new: true }
    );

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error tracking download." });
  }
});

module.exports = router;
