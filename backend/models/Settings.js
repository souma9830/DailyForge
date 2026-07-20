const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: 'Master Explorer',
      trim: true,
    },
    dailyStudyGoal: {
      type: Number,
      default: 6, // hours
      min: 1,
      max: 24,
    },
    notificationTime: {
      type: String,
      default: '20:00', // HH:mm format
    },
    theme: {
      type: String,
      default: 'dark',
      enum: ['dark', 'blue', 'emerald', 'amber'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
