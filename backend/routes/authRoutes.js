const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route - Get current user data
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'This is protected user data',
    user: req.user
  });
});

// Protected route - Check upload access
router.get('/upload', authMiddleware, (req, res) => {
  res.json({
    message: 'You are allowed to upload notes!',
    user: req.user
  });
});

module.exports = router;
