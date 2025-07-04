const express = require("express");
const router = express.Router();
const Doubt = require("../models/Doubt");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all doubts
router.get("/", async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("userId", "username name email")
      .sort({ timestamp: -1 });
    res.json({ doubts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single doubt by ID (with answers)
router.get("/:id", async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate("userId", "username name email")
      .populate("answers.author", "username name email");
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    res.json({ doubt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post a new doubt
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, subject } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ message: "Title and subject are required" });
  }

  try {
    const newDoubt = new Doubt({
      title,
      description,
      subject,
      userId: req.user.userId,
    });
    await newDoubt.save();
    await newDoubt.populate("userId", "username name email");
    res
      .status(201)
      .json({ message: "Doubt submitted successfully", doubt: newDoubt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post an answer to a doubt
router.post("/:id/answers", authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text)
    return res.status(400).json({ message: "Answer text is required" });
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    const answer = {
      text,
      author: req.user.userId,
      time: new Date(),
    };
    doubt.answers.push(answer);
    await doubt.save();
    // Populate the author field for the new answer
    await doubt.populate("answers.author", "username name email");
    const newAnswer = doubt.answers[doubt.answers.length - 1];
    res.status(201).json({ answer: newAnswer });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Edit a doubt
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, description, subject } = req.body;
    if (title) doubt.title = title;
    if (description !== undefined) doubt.description = description;
    if (subject) doubt.subject = subject;
    await doubt.save();
    await doubt.populate("userId", "username name email");
    res.json({ message: "Doubt updated", doubt });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a doubt
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await doubt.deleteOne();
    res.json({ message: "Doubt deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Edit an answer
router.put("/:doubtId/answers/:answerId", authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.doubtId).populate(
      "answers.author",
      "username name email"
    );
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    const answer = doubt.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    // Fix: handle both populated and unpopulated author fields
    const authorId = answer.author._id
      ? answer.author._id.toString()
      : answer.author.toString();
    if (authorId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.body.text) answer.text = req.body.text;
    answer.time = new Date();
    answer.updatedAt = new Date();
    await doubt.save();
    // Re-populate the author field for the updated answer
    await doubt.populate("answers.author", "username name email");
    const updatedAnswer = doubt.answers.id(req.params.answerId);
    res.json({ message: "Answer updated", answer: updatedAnswer });
  } catch (err) {
    console.error("Error editing answer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an answer
router.delete(
  "/:doubtId/answers/:answerId",
  authMiddleware,
  async (req, res) => {
    try {
      const doubt = await Doubt.findById(req.params.doubtId);
      if (!doubt) return res.status(404).json({ message: "Doubt not found" });
      const answer = doubt.answers.id(req.params.answerId);
      if (!answer) return res.status(404).json({ message: "Answer not found" });
      if (answer.author.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      doubt.answers.pull({ _id: req.params.answerId });
      await doubt.save();
      res.json({ message: "Answer deleted" });
    } catch (err) {
      console.error("Error deleting answer:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
