const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: 1,
    },
    difficulty: {
      type: String,
      default: 'Medium',
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for date range and subject queries
studySessionSchema.index({ date: -1, subject: 1 });
studySessionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StudySession', studySessionSchema);
