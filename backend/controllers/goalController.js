const Goal = require('../models/Goal');

// GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { title, category, progress, deadline, notes } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }
    if (!deadline) {
      return res.status(400).json({ success: false, message: 'Deadline is required' });
    }
    const pct = Number(progress) || 0;
    const newGoal = await Goal.create({
      title: title.trim(),
      category: category || 'Academic',
      progress: pct,
      deadline,
      notes: notes?.trim() || '',
      status: pct >= 100 ? 'completed' : 'in_progress',
      completedAt: pct >= 100 ? new Date() : null,
    });
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, progress, deadline, notes, status } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (category !== undefined) updates.category = category;
    if (deadline !== undefined) updates.deadline = deadline;
    if (notes !== undefined) updates.notes = notes.trim();

    if (progress !== undefined) {
      updates.progress = Number(progress);
      if (Number(progress) >= 100) {
        updates.status = 'completed';
        updates.completedAt = new Date();
      } else {
        updates.status = 'in_progress';
        updates.completedAt = null;
      }
    }

    if (status !== undefined && status === 'completed') {
      updates.status = 'completed';
      updates.progress = 100;
      updates.completedAt = new Date();
    }

    const updated = await Goal.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Goal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
