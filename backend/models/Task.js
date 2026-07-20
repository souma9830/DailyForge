const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'todo',
      enum: ['todo', 'in_progress', 'completed'],
    },
    priority: {
      type: String,
      default: 'medium',
      enum: ['low', 'medium', 'high', 'urgent'],
    },
    category: {
      type: String,
      default: 'General',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Performance compound indexes for fast query execution
taskSchema.index({ status: 1, category: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
