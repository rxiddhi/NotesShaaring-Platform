const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, note: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
