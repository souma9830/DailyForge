const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Health',
      enum: ['Health', 'Productivity', 'Mindset', 'Skill', 'Fitness', 'Custom'],
    },
    frequency: {
      type: String,
      default: 'daily',
      enum: ['daily', 'weekly'],
    },
    targetDaysPerWeek: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },
    color: {
      type: String,
      default: '#3b82f6', // Tailwind blue hex
    },
    icon: {
      type: String,
      default: 'Flame',
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    // Array of date strings in YYYY-MM-DD format
    completedDates: [
      {
        type: String,
      },
    ],
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);
