const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject/Topic is required'],
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: 1,
    },
    category: {
      type: String,
      default: 'Engineering',
    },
    notes: {
      type: String,
      default: '',
    },
    date: {
      type: String, // YYYY-MM-DD
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
