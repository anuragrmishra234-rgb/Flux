const mongoose = require('mongoose');

/**
 * HeartbeatModel
 * Stores a rolling window of what each user is browsing.
 * TTL index auto-expires documents after 5 minutes — zero maintenance needed.
 */
const HeartbeatSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  socketId:        { type: String },
  current_tab_url: { type: String, default: '' },
  page_title:      { type: String, default: '' },
  timestamp:       { type: Date, default: Date.now }
});

// Auto-delete after 5 minutes
HeartbeatSchema.index({ timestamp: 1 }, { expireAfterSeconds: 300 });

// Fast lookup: latest N heartbeats for a user
HeartbeatSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Heartbeat', HeartbeatSchema);
