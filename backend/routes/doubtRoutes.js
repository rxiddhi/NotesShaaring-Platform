const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newDoubt = new Doubt({
      title,
      description,
      userId: req.user.userId,
    });

    await newDoubt.save();

    res.status(201).json({ message: 'Doubt submitted successfully', doubt: newDoubt });
  } catch (err) {
    console.error('Error saving doubt:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
