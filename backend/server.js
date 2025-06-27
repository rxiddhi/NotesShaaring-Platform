const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); 

// Routes
const authRoutes = require("./routes/auth");
const notesRouter = require("./routes/notes");

app.use("/api/auth", authRoutes);   
app.use("/api/notes", notesRouter); 
app.use(cors());
app.use("/uploads", express.static("uploads"));


Note.on('index', function(err) {
  if (err) {
    console.error('Note index error:', err);
  } else {
    console.log('Note text index ready');
  }
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(" MongoDB connection error:", err.message);
});
