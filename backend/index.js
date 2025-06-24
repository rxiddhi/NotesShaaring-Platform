const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes/authRoutes'));


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Notes Sharing Platform API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

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
