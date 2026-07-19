const Habit = require('../models/Habit');
const Task = require('../models/Task');
const Journal = require('../models/Journal');
const { getIsConnected } = require('../config/db');

// @route GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    let habitsCount = 0;
    let habitsCompletedToday = 0;
    let totalStreaksSum = 0;
    let tasksTotal = 0;
    let tasksCompleted = 0;
    let tasksInProgress = 0;
    let tasksTodo = 0;
    let latestJournal = null;

    if (getIsConnected()) {
      const habits = await Habit.find({ archived: false });
      habitsCount = habits.length;
      habits.forEach((h) => {
        if (h.completedDates.includes(todayStr)) habitsCompletedToday++;
        totalStreaksSum += h.currentStreak || 0;
      });

      const tasks = await Task.find();
      tasksTotal = tasks.length;
      tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
      tasksInProgress = tasks.filter((t) => t.status === 'in_progress').length;
      tasksTodo = tasks.filter((t) => t.status === 'todo').length;

      latestJournal = await Journal.findOne().sort({ date: -1 });
    } else {
      // In-memory stats query trigger fallback
      const habitRes = await require('./habitController').getHabits({ query: {} }, { json: (d) => d });
      const taskRes = await require('./taskController').getTasks({ query: {} }, { json: (d) => d });
      const journalRes = await require('./journalController').getJournals({ query: {} }, { json: (d) => d });

      const habits = habitRes?.data || [];
      habitsCount = habits.length;
      habits.forEach((h) => {
        if (h.completedDates.includes(todayStr)) habitsCompletedToday++;
        totalStreaksSum += h.currentStreak || 0;
      });

      const tasks = taskRes?.data || [];
      tasksTotal = tasks.length;
      tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
      tasksInProgress = tasks.filter((t) => t.status === 'in_progress').length;
      tasksTodo = tasks.filter((t) => t.status === 'todo').length;

      latestJournal = journalRes?.data?.[0] || null;
    }

    const habitCompletionRate = habitsCount > 0 ? Math.round((habitsCompletedToday / habitsCount) * 100) : 0;
    const taskCompletionRate = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    // Calculate level / XP for gamified productivity forge
    const totalXP = habitsCompletedToday * 50 + totalStreaksSum * 20 + tasksCompleted * 30;
    const level = Math.floor(totalXP / 200) + 1;
    const xpCurrentLevel = totalXP % 200;

    res.json({
      success: true,
      data: {
        summary: {
          habitsCount,
          habitsCompletedToday,
          habitCompletionRate,
          totalStreaksSum,
          tasksTotal,
          tasksCompleted,
          tasksInProgress,
          tasksTodo,
          taskCompletionRate,
          level,
          totalXP,
          xpCurrentLevel,
          xpNextLevel: 200,
        },
        latestJournal,
        isMongoDBConnected: getIsConnected(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
