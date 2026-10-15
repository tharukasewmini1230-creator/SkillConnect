const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  // Owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Resource info
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: 1000
  },

  // Categorization
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other']
  },
  skillTags: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['Notes', 'Cheat Sheet', 'Book', 'Tutorial', 'Reference', 'Other'],
    default: 'Notes'
  },

  // File info
  file: {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true }
  },

  // Stats
  downloads: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text index for search
resourceSchema.index({ title: 'text', description: 'text', skillTags: 'text' });

// Index for fast queries
resourceSchema.index({ category: 1, createdAt: -1 });
resourceSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);