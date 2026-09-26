const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: [true, 'Please specify the skill']
  },
  message: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: [true, 'Please select a date']
  },
  time: {
    type: String,
    required: [true, 'Please select a time']
  },
  mode: {
    type: String,
    enum: ['Online', 'Physical'],
    default: 'Online'
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);