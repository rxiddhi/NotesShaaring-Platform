const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  uploader: {
    type: String,
    required: true,
    trim: true
  },
  fileUrl: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  pageCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  
}, {
  timestamps: true 
});


noteSchema.index({
  title: 'text',
  subject: 'text',
  description: 'text'
});

module.exports = mongoose.model('Note', noteSchema);