const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
      unique: true,
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    moodLabel: {
      type: String,
      default: 'Balanced',
    },
    focusNote: {
      type: String,
      default: '',
    },
    wins: [
      {
        type: String,
      },
    ],
    gratitude: [
      {
        type: String,
      },
    ],
    reflection: {
      type: String,
      default: '',
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Journal', journalSchema);
