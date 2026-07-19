const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');

let mockTasks = [
  {
    _id: 'task_1',
    title: 'Design & Code DailyForge Navigation Bar',
    description: 'Implement dark glassmorphism top navigation with quick status indicator',
    status: 'completed',
    priority: 'high',
    category: 'Engineering',
    dueDate: new Date().toISOString(),
    tags: ['UI/UX', 'React'],
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_2',
    title: 'Configure MongoDB Schema & Indexing',
    description: 'Set up Mongoose schemas for Habits, Tasks, and Reflections',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Backend',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    tags: ['Database', 'Node.js'],
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_3',
    title: 'Weekly Focus Review & Goal Calibration',
    description: 'Analyze weekly streak metrics and adjust personal development targets',
    status: 'todo',
    priority: 'medium',
    category: 'Strategy',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    tags: ['Productivity', 'Planning'],
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_4',
    title: 'Integrate Interactive Analytics Charts',
    description: 'Render Recharts visual graphs for completion trends & mood ratings',
    status: 'in_progress',
    priority: 'high',
    category: 'Frontend',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    tags: ['Charts', 'Recharts'],
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
];

// @route GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, category, priority } = req.query;

    if (getIsConnected()) {
      const query = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;

      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: tasks.length, data: tasks });
    }

    let filtered = [...mockTasks];
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (category) filtered = filtered.filter((t) => t.category === category);
    if (priority) filtered = filtered.filter((t) => t.priority === priority);

    res.json({ success: true, count: filtered.length, data: filtered, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, tags } = req.body;

    if (getIsConnected()) {
      const newTask = await Task.create({
        title,
        description,
        priority: priority || 'medium',
        category: category || 'General',
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      });
      return res.status(201).json({ success: true, data: newTask });
    }

    const mockNew = {
      _id: 'task_' + Date.now(),
      title,
      description: description || '',
      status: 'todo',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    mockTasks.unshift(mockNew);
    res.status(201).json({ success: true, data: mockNew, mode: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'completed') {
      updates.completedAt = null;
    }

    if (getIsConnected()) {
      const updated = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.json({ success: true, data: updated });
    }

    const idx = mockTasks.findIndex((t) => t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });

    mockTasks[idx] = { ...mockTasks[idx], ...updates };
    res.json({ success: true, data: mockTasks[idx], mode: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Task.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Task deleted' });
    }

    mockTasks = mockTasks.filter((t) => t._id !== id);
    res.json({ success: true, message: 'Task deleted from memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
