const Goal = require('../models/Goal');

// Mock in-memory storage fallback
let mockGoals = [
  {
    _id: 'goal-1',
    title: 'Master Data Structures & Algorithms',
    category: 'Skill',
    progress: 75,
    deadline: '2026-08-30',
    status: 'in_progress',
    notes: 'Solve 150 LeetCode problems',
    createdAt: new Date(),
  },
  {
    _id: 'goal-2',
    title: 'Build Full-Stack MERN DailyForge App',
    category: 'Academic',
    progress: 100,
    deadline: '2026-07-25',
    status: 'completed',
    notes: 'Complete Study Logger, Task Board, and Analytics',
    completedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: 'goal-3',
    title: 'Maintain 30-Day Daily Study Streak',
    category: 'Personal',
    progress: 40,
    deadline: '2026-09-15',
    status: 'in_progress',
    notes: 'Log minimum 2 hours focus daily',
    createdAt: new Date(),
  },
];

// Helper to check DB connection
const isConnected = () => require('mongoose').connection.readyState === 1;

// GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    if (isConnected()) {
      const goals = await Goal.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: goals.length, data: goals });
    }
    return res.status(200).json({ success: true, count: mockGoals.length, data: mockGoals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { title, category, progress, deadline, notes } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ success: false, message: 'Title and deadline are required' });
    }

    if (isConnected()) {
      const newGoal = await Goal.create({
        title,
        category: category || 'Academic',
        progress: progress || 0,
        deadline,
        notes: notes || '',
        status: progress >= 100 ? 'completed' : 'in_progress',
        completedAt: progress >= 100 ? new Date() : null,
      });
      return res.status(201).json({ success: true, data: newGoal });
    }

    const newMock = {
      _id: `goal-${Date.now()}`,
      title,
      category: category || 'Academic',
      progress: progress || 0,
      deadline,
      notes: notes || '',
      status: progress >= 100 ? 'completed' : 'in_progress',
      completedAt: progress >= 100 ? new Date() : null,
      createdAt: new Date(),
    };
    mockGoals.unshift(newMock);
    return res.status(201).json({ success: true, data: newMock });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, progress, deadline, notes, status } = req.body;

    let updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (deadline !== undefined) updates.deadline = deadline;
    if (notes !== undefined) updates.notes = notes;
    if (progress !== undefined) {
      updates.progress = progress;
      if (progress >= 100) {
        updates.status = 'completed';
        updates.completedAt = new Date();
      } else if (status !== 'completed') {
        updates.status = 'in_progress';
        updates.completedAt = null;
      }
    }
    if (status !== undefined) {
      updates.status = status;
      if (status === 'completed') {
        updates.progress = 100;
        updates.completedAt = new Date();
      }
    }

    if (isConnected()) {
      const updated = await Goal.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Goal not found' });
      return res.status(200).json({ success: true, data: updated });
    }

    const idx = mockGoals.findIndex((g) => g._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Goal not found' });

    mockGoals[idx] = { ...mockGoals[idx], ...updates };
    return res.status(200).json({ success: true, data: mockGoals[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      await Goal.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Goal deleted successfully' });
    }
    mockGoals = mockGoals.filter((g) => g._id !== id);
    return res.status(200).json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
