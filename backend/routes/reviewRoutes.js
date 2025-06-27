const express = require("express");
const {
  createOrUpdateReview,
  getReviewsForNote,
  deleteReview,
} = require("../controllers/reviewController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/:noteId/reviews")
  .post(protect, createOrUpdateReview)
  .get(getReviewsForNote)
  .delete(protect, deleteReview);

module.exports = router;
