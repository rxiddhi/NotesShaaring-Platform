const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const passport = require("passport");
const connectDB = require("./config/db");
const initGooglePassport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


initGooglePassport();
app.use(passport.initialize());


app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/authRoutes")); 
app.use("/api/notes", require("./routes/noteRoutes")); 
app.use("/api/notes", require("./routes/reviewRoutes")); 


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
