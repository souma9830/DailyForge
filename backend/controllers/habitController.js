const Habit = require('../models/Habit');

// Calculate streak from an array of 'YYYY-MM-DD' date strings
const calculateStreaks = (completedDates = []) => {
  if (!completedDates.length) return { currentStreak: 0, bestStreak: 0 };

  const sorted = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  const checkDate = new Date();

  if (sorted.includes(todayStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (sorted.includes(yesterdayStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  }

  if (currentStreak > 0) {
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sorted.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }
  }

  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;
  const ascSorted = [...completedDates].sort((a, b) => new Date(a) - new Date(b));
  for (const dateStr of ascSorted) {
    const d = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((d - prevDate) / 86400000);
      if (diffDays === 1) tempStreak++;
      else if (diffDays > 1) tempStreak = 1;
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
    prevDate = d;
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
};

// GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ archived: false }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: habits.length, data: habits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    const { title, description, category, frequency, targetDaysPerWeek, color, icon } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Habit title is required' });
    }
    const newHabit = await Habit.create({
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'Custom',
      frequency: frequency || 'daily',
      targetDaysPerWeek: targetDaysPerWeek || 7,
      color: color || '#3b82f6',
      icon: icon || 'Flame',
    });
    res.status(201).json({ success: true, data: newHabit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/habits/:id/toggle
exports.toggleHabitDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

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
    habit.bestStreak = Math.max(habit.bestStreak || 0, bestStreak);

    await habit.save();
    res.json({ success: true, data: habit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Habit.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Habit not found' });
    res.json({ success: true, message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
