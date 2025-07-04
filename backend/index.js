const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const passport = require("passport");
const connectDB = require("./config/db");
const initGooglePassport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://notes-sharingplatform.vercel.app",
  "https://notenest-lzm0.onrender.com", 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

initGooglePassport();
app.use(passport.initialize());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/doubts", require("./routes/doubtRoutes"));
app.use("/api/users", require("./routes/userRoutes")); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Notes Sharing Platform API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

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
