const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
    },
    time: {
      type: String, // HH:mm format e.g. "20:00"
      required: [true, 'Reminder target time is required'],
    },
    category: {
      type: String,
      default: 'Study',
      enum: ['Study', 'Health', 'Fitness', 'Task', 'Custom'],
    },
    repeat: {
      type: String,
      default: 'daily',
      enum: ['once', 'daily'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastTriggeredDate: {
      type: String, // YYYY-MM-DD
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);
