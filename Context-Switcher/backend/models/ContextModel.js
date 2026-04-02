const mongoose = require('mongoose');

const contextSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  urls: [{
    type: String
  }],
  sessionNote: {
    type: String,
    default: ''
  },
  dailyFocus: {
    type: String,
    default: ''
  },
  // New fields for color labels & icon
  color: {
    type: String,
    default: '#6366f1' // default indigo
  },
  icon: {
    type: String,
    default: '⚡'
  },
  // Track activation count for analytics
  activationCount: {
    type: Number,
    default: 0
  },
  lastActivatedAt: {
    type: Date,
    default: null
  },
  // Drag-to-reorder sort index
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Context', contextSchema);
