const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // format HH:mm
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  notifyBeforeMinutes: {
    type: Number,
    default: 60,
  },
  isNotified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
