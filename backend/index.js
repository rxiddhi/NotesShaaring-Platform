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

// Passport initialization
initGooglePassport();
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth'));          // login/signup/google
app.use('/api', require('./routes/authRoutes'));         // protected routes
app.use('/api', require('./routes/noteRoutes'));         // note uploads/display

// Health check routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes Sharing Platform API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect DB and Start Server
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
