const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const passport = require('passport');
const connectDB = require('./config/db');
const initGooglePassport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport
initGooglePassport();
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));         // handles login/signup/OAuth
app.use('/api', require('./routes/noteRoutes'));        // handles /notes routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes Sharing Platform API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// DB connect & start
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ MongoDB connected');
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
