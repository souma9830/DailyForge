const Habit = require('../models/Habit');
const { getIsConnected } = require('../config/db');

// In-memory fallback state if MongoDB is disconnected
let mockHabits = [
  {
    _id: 'habit_1',
    title: 'Daily Morning Meditation & Breathwork',
    description: '10 minutes of mindfulness before starting work',
    category: 'Mindset',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    color: '#06b6d4',
    icon: 'Brain',
    currentStreak: 5,
    bestStreak: 12,
    completedDates: [
      new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'habit_2',
    title: 'Forge Code & Build Micro-features',
    description: 'Dedicate 45 minutes to personal project engineering',
    category: 'Skill',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    color: '#f59e0b',
    icon: 'Code',
    currentStreak: 8,
    bestStreak: 15,
    completedDates: [
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'habit_3',
    title: 'Hydration & Daily Physical Exercise',
    description: 'Drink 3L water and do 30 min workout or run',
    category: 'Fitness',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    color: '#10b981',
    icon: 'Dumbbell',
    currentStreak: 3,
    bestStreak: 9,
    completedDates: [
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    ],
    archived: false,
    createdAt: new Date().toISOString(),
  },
];

// Calculate streak helper
const calculateStreaks = (completedDates = []) => {
  if (!completedDates.length) return { currentStreak: 0, bestStreak: 0 };
  
  const sorted = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let currentStreak = 0;
  let checkDate = new Date();
  
  // If completed today or yesterday, streak is active
  if (sorted.includes(todayStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (sorted.includes(yesterdayStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  } else {
    currentStreak = 0;
  }

  if (currentStreak > 0) {
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak historically
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  const ascSorted = [...completedDates].sort((a, b) => new Date(a) - new Date(b));
  for (const dateStr of ascSorted) {
    const d = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((d - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    prevDate = d;
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
};

// @route GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    if (getIsConnected()) {
      const habits = await Habit.find({ archived: false }).sort({ createdAt: -1 });
      return res.json({ success: true, count: habits.length, data: habits });
    }
    return res.json({ success: true, count: mockHabits.length, data: mockHabits, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    const { title, description, category, frequency, targetDaysPerWeek, color, icon } = req.body;
    
    if (getIsConnected()) {
      const newHabit = await Habit.create({
        title,
        description,
        category: category || 'Custom',
        frequency: frequency || 'daily',
        targetDaysPerWeek: targetDaysPerWeek || 7,
        color: color || '#3b82f6',
        icon: icon || 'Flame',
      });
      return res.status(201).json({ success: true, data: newHabit });
    }

    const mockNew = {
      _id: 'habit_' + Date.now(),
      title,
      description: description || '',
      category: category || 'Custom',
      frequency: frequency || 'daily',
      targetDaysPerWeek: targetDaysPerWeek || 7,
      color: color || '#3b82f6',
      icon: icon || 'Flame',
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
      archived: false,
      createdAt: new Date().toISOString(),
    };
    mockHabits.unshift(mockNew);
    res.status(201).json({ success: true, data: mockNew, mode: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route POST /api/habits/:id/toggle
exports.toggleHabitDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // YYYY-MM-DD
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (getIsConnected()) {
      const habit = await Habit.findById(id);
      if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });

      const dateIndex = habit.completedDates.indexOf(targetDate);
      if (dateIndex > -1) {
        habit.completedDates.splice(dateIndex, 1);
      } else {
        habit.completedDates.push(targetDate);
      }

      const { currentStreak, bestStreak } = calculateStreaks(habit.completedDates);
      habit.currentStreak = currentStreak;
      habit.bestStreak = Math.max(habit.bestStreak, bestStreak);

      await habit.save();
      return res.json({ success: true, data: habit });
    }

    // Fallback in memory
    const habit = mockHabits.find((h) => h._id === id);
    if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });

    const idx = habit.completedDates.indexOf(targetDate);
    if (idx > -1) {
      habit.completedDates.splice(idx, 1);
    } else {
      habit.completedDates.push(targetDate);
    }

    const { currentStreak, bestStreak } = calculateStreaks(habit.completedDates);
    habit.currentStreak = currentStreak;
    habit.bestStreak = Math.max(habit.bestStreak || 0, bestStreak);

    res.json({ success: true, data: habit, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Habit.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Habit deleted successfully' });
    }

    mockHabits = mockHabits.filter((h) => h._id !== id);
    res.json({ success: true, message: 'Habit deleted in memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
