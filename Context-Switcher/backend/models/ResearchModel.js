const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  emoji: { type: String, default: '📖' },
  quickStart: [{ heading: String, body: String }]
});

const ResearchResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  normalizedSubject: { type: String, required: true },
  resources: [ResourceSchema],
  createdAt: { type: Date, default: Date.now }
});

ResearchResultSchema.index({ userId: 1, normalizedSubject: 1 });

module.exports = mongoose.model('ResearchResult', ResearchResultSchema);
