const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Note = require('../models/Note');
const Review = require('../models/Review');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    username = username.trim();
    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Auth Routes
router.get('/google-signup',
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'signup' })
);

router.get('/google-login',
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'login' })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const state = req.query.state;
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    if (state === 'signup') {
      if (req.user && req.user._alreadyExists) {
        return res.redirect(`${redirectUrl}/login?signup=exists`);
      } else {
        return res.redirect(`${redirectUrl}/login?signup=success`);
      }
    } else {
      return res.redirect(`${redirectUrl}/auth/success?token=${token}`);
    }
  }
);

// Dashboard stats endpoint
router.get('/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Dates for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Uploaded notes
    const uploadedNotes = await Note.countDocuments({ uploadedBy: userId });
    const uploadedThisMonth = await Note.countDocuments({
      uploadedBy: userId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });

    // Downloaded notes
    const downloadedNotes = await Note.countDocuments({ downloadedBy: userId });
    const downloadedThisMonth = await Note.countDocuments({
      downloadedBy: userId,
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });

    // Reviews received (for notes uploaded by user)
    const userNotes = await Note.find({ uploadedBy: userId }).select('_id');
    const userNoteIds = userNotes.map(n => n._id);
    const reviewsReceived = await Review.countDocuments({ note: { $in: userNoteIds } });
    const reviewsThisMonth = await Review.countDocuments({
      note: { $in: userNoteIds },
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });
    const allReviews = await Review.find({ note: { $in: userNoteIds } });
    const averageRating = allReviews.length > 0 ?
      (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(2) : 0;

    res.json({
      user: {
        username: user.username || user.name || 'User',
        joinDate: user.createdAt
      },
      stats: {
        uploadedNotes,
        downloadedNotes,
        reviewsReceived,
        uploadedThisMonth,
        downloadedThisMonth,
        reviewsThisMonth,
        averageRating: Number(averageRating)
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
});

module.exports = router;
