const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  date: { type: String, required: true },           // YYYY-MM-DD
  status: { type: String, enum: ['attended', 'missed'] },
  attendedAt: { type: Date, default: null },
  delayMinutes: { type: Number, default: null },     // mins after scheduled time
  notificationCount: { type: Number, default: 0 },
}, { _id: false });

const reminderSchema = new mongoose.Schema({
  // Core fields
  subject: { type: String, required: true, trim: true },
  topic: { type: String, required: true, trim: true },
  scheduledTime: { type: String, required: true },   // "HH:mm" 24h
  reminderBeforeMinutes: { type: Number, default: 5, min: 0, max: 60 },
  repeatEveryMinutes: { type: Number, default: 15, min: 1, max: 120 },
  ntfyTopic: { type: String, default: '', trim: true },

  // Active state (resets each day)
  status: {
    type: String,
    enum: ['idle', 'notified', 'attended', 'missed'],
    default: 'idle',
  },
  scheduledDate: { type: String, default: '' },       // YYYY-MM-DD of current activation
  firstNotificationAt: { type: Date, default: null },
  nextNotificationAt: { type: Date, default: null },
  notificationCount: { type: Number, default: 0 },

  // Today's attendance
  isAttended: { type: Boolean, default: false },
  attendedAt: { type: Date, default: null },
  attendanceDelayMinutes: { type: Number, default: null },

  // Config
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#3b82f6' },

  // All-time history
  history: [historySchema],
}, { timestamps: true });

// Indexes for fast scheduler lookups
reminderSchema.index({ isActive: 1, status: 1 });
reminderSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
