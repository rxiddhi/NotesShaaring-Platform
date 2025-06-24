// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  uploader: {
    type: String, // or mongoose.Schema.Types.ObjectId if referencing a user
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  description: String,
}, {
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.model('Note', noteSchema);
