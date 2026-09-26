const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['Offer', 'Request']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);