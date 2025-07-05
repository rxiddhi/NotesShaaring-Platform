const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const upload = require("../config/multer");

const {
  updateProfile,
  getDashboardStats,
} = require("../controllers/userController");

router.put("/update-profile", auth, upload.single("image"), updateProfile);
router.get("/dashboard-stats", auth, getDashboardStats);

module.exports = router;
