const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/", authMiddleware, async (req, res) => {
  const { doubtId, content } = req.body;

  if (!doubtId || !content) {
    return res.status(400).json({ message: "doubtId and content are required" });
  }

  try {
    const newAnswer = new Answer({
      doubtId,
      content,
      userId: req.user.userId,
    });

    const savedAnswer = await newAnswer.save();
    res.status(201).json(savedAnswer);
  } catch (err) {
    console.error("Error saving answer:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
