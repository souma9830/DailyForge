const Habit = require('../models/Habit');
const Task = require('../models/Task');
const Journal = require('../models/Journal');
const StudySession = require('../models/StudySession');

// GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [habits, tasks, studySessions, latestJournal] = await Promise.all([
      Habit.find({ archived: false }).lean(),
      Task.find().lean(),
      StudySession.find().lean(),
      Journal.findOne().sort({ date: -1 }).lean(),
    ]);

    // Habit stats
    const habitsCount = habits.length;
    const habitsCompletedToday = habits.filter(
      (h) => Array.isArray(h.completedDates) && h.completedDates.includes(todayStr)
    ).length;
    const totalStreaksSum = habits.reduce((s, h) => s + (h.currentStreak || 0), 0);
    const maxStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak || 0), 0);
    const habitCompletionRate =
      habitsCount > 0 ? Math.round((habitsCompletedToday / habitsCount) * 100) : 0;

    // Task stats
    const tasksTotal = tasks.length;
    const tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
    const tasksInProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const tasksTodo = tasks.filter((t) => t.status === 'todo').length;
    const taskCompletionRate =
      tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    // Study stats
    const todaySessions = studySessions.filter((s) => s.date === todayStr);
    const todayStudyMinutes = todaySessions.reduce(
      (s, sess) => s + (Number(sess.durationMinutes) || 0), 0
    );
    const totalStudyMinutes = studySessions.reduce(
      (s, sess) => s + (Number(sess.durationMinutes) || 0), 0
    );
    const totalStudySessions = studySessions.length;

    // XP & Level
    const totalXP =
      habitsCompletedToday * 50 +
      totalStreaksSum * 20 +
      tasksCompleted * 30 +
      Math.floor(totalStudyMinutes / 10) * 5;
    const level = Math.floor(totalXP / 200) + 1;
    const xp = totalXP % 200;

    res.json({
      success: true,
      data: {
        summary: {
          habitsCount,
          habitsCompletedToday,
          habitCompletionRate,
          totalStreaksSum,
          maxStreak,
          tasksTotal,
          tasksCompleted,
          tasksInProgress,
          tasksTodo,
          taskCompletionRate,
          todayStudyMinutes,
          totalStudyMinutes,
          totalStudySessions,
          level,
          totalXP,
          xp,
          xpNextLevel: 200,
        },
        latestJournal,
        isMongoDBConnected: true,
      },
    });
  } catch (error) {
    console.error('[Stats Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
