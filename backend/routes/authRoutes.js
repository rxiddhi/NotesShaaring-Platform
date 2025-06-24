const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Dummy user for testing
const user = {
  email: 'test@example.com',
  password: '123456'
};

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    message: 'This is protected user data',
    user: req.user
  });
});
router.get('/upload', authMiddleware, (req, res) => {
  res.json({
    message: 'You are allowed to upload notes!',
    user: req.user
  });
});

module.exports = router;
