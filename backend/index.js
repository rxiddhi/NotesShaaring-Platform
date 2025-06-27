const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const passport = require("passport");
const connectDB = require("./config/db");
const initGooglePassport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Passport config
initGooglePassport();
app.use(passport.initialize());

// Routes
app.use("/api/auth", require("./routes/auth")); // for Google login
app.use("/api", require("./routes/authRoutes")); // local login/register
app.use("/api/notes", require("./routes/noteRoutes")); // notes upload/download/delete
app.use("/api/notes", require("./routes/reviewRoutes")); // 💡 reviews for each noteId

// Health and base test routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Notes Sharing Platform API" });
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ MongoDB connected");
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
