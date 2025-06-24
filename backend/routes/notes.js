// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
});

module.exports = router;
