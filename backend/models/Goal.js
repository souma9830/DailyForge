const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Academic',
      enum: ['Academic', 'Career', 'Skill', 'Personal', 'Fitness', 'Custom'],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deadline: {
      type: String,
      required: [true, 'Goal deadline is required'],
    },
    status: {
      type: String,
      default: 'in_progress',
      enum: ['in_progress', 'completed', 'archived'],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);
