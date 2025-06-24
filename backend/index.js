const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const passport = require('passport');
const initGooglePassport = require('./config/passport');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Initialize passport
initGooglePassport();
app.use(passport.initialize());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/authRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes Sharing Platform API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
