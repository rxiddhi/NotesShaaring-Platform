const User = require("../models/User");
const Note = require("../models/Note");
const Review = require("../models/Review");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const uploadedNotes = await Note.countDocuments({ uploadedBy: userId });
    const downloadedNotes = await Note.countDocuments({ downloadedBy: userId });
    const reviewsReceived = await Review.countDocuments({
      note: { $in: await Note.find({ uploadedBy: userId }).distinct("_id") },
    });

    const stats = {
      uploadedNotes,
      downloadedNotes,
      reviewsReceived,
      uploadedThisMonth: 0,
      downloadedThisMonth: 0,
      reviewsThisMonth: 0,
      averageRating: 0,
    };

    res.status(200).json({ user, stats });
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    res.status(500).json({ message: "Server error while fetching dashboard stats" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (bio) user.bio = bio;
    if (req.file) user.imageUrl = req.file.path;

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      imageUrl: user.imageUrl,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
