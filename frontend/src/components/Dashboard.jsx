import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Trophy,
  Zap,
  Target,
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  habits, 
  tasks, 
  studySessions = [], 
  onToggleHabit, 
  onOpenNewHabit, 
  onOpenNewTask, 
  onOpenLogStudy,
  onOpenExport,
  setActiveTab,
  username = '',
  dailyStudyGoal = 6,   // ← comes from App.jsx via MongoDB Settings
}) {
  const summary = stats?.summary || {};
  const todayStr = new Date().toISOString().split('T')[0];

  // ── Study stats from real sessions ────────────────────────────────────────
  const todayStudySessions = studySessions.filter(s => s.date === todayStr);
  const totalStudyMinutes = todayStudySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const studyHoursToday = (totalStudyMinutes / 60).toFixed(1);

  // dailyStudyGoal comes directly from Settings (passed from App.jsx)
  const studyProgressPercent = Math.min(
    Math.round((Number(studyHoursToday) / dailyStudyGoal) * 100),
    100
  );

  // ── Task stats ────────────────────────────────────────────────────────────
  const tasksCompletedCount = summary.tasksCompleted || 0;
  const tasksTotalCount = summary.tasksTotal || 0;
  const taskProgressPercent = summary.taskCompletionRate || 0;

  // ── Streak stats (real MongoDB data) ─────────────────────────────────────
  // currentStreak: longest active run (breaks if any day is missed)
  // bestStreak:    all-time highest streak ever achieved
  const activeStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.currentStreak || 0))
    : 0;
  const highestStreak = habits.length > 0
    ? Math.max(...habits.map(h => h.bestStreak || 0))
    : 0;

  // ── Combined daily goal ───────────────────────────────────────────────────
  const combinedGoalPercent = Math.round((studyProgressPercent * 0.5) + (taskProgressPercent * 0.5));

  // ── Animation variants ────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* ── Welcome Banner ──────────────────────────────────────────────────── */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-950/80 via-[#111726] to-[#0d121d] border border-blue-500/25 shadow-2xl"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Daily Mastery Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back,{' '}
            <span className="forge-gradient-text">
              {username || 'Explorer'}
            </span>{' '}👋
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            {activeStreak > 0
              ? <><span className="font-bold text-amber-400">{activeStreak}-day active streak</span> — keep the momentum going! Study target: <span className="text-cyan-300 font-bold">{dailyStudyGoal}h today</span>.</>
              : <>Start your first habit or log a study session to begin your streak. Every champion starts at day&nbsp;0 — today is your day!</>
            }
          </p>
        </div>
        {/* Glow FX */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* ── 4-Card Metrics Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1 — Current Streak */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Streak</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{activeStreak}</span>
            <span className="text-xs font-bold text-amber-400">
              {activeStreak === 0 ? 'days' : `day${activeStreak !== 1 ? 's' : ''} 🔥`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-tight">
            {activeStreak === 0
              ? 'Complete a habit to start'
              : 'Streak breaks if you miss a day'}
          </p>
        </motion.div>

        {/* Card 2 — Highest Streak (All-Time Best) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Best Streak</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{highestStreak}</span>
            <span className="text-xs font-bold text-yellow-400">
              day{highestStreak !== 1 ? 's' : ''} 🏆
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-tight">
            {highestStreak === 0 ? 'No streak recorded yet' : 'Your all-time personal best'}
          </p>
        </motion.div>

        {/* Card 3 — Today's Study Hours (uses dailyStudyGoal from Settings) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Study Today</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{studyHoursToday}</span>
            <span className="text-xs font-bold text-cyan-400">/ {dailyStudyGoal}h 📚</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
            {studyProgressPercent}% of daily goal ({totalStudyMinutes} min)
          </p>
          {/* Mini progress bar */}
          <div className="mt-2 w-full bg-[#0d121d] rounded-full h-1.5 border border-[#1e2638]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${studyProgressPercent}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
            />
          </div>
        </motion.div>

        {/* Card 4 — Completed Tasks */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks Done</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{tasksCompletedCount}</span>
            <span className="text-xs font-bold text-emerald-400">/ {tasksTotalCount} ✅</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
            {taskProgressPercent}% completion rate
          </p>
          {/* Mini progress bar */}
          <div className="mt-2 w-full bg-[#0d121d] rounded-full h-1.5 border border-[#1e2638]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${taskProgressPercent}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>
        </motion.div>
      </div>

      {/* ── Daily Target Progress Bar ────────────────────────────────────────── */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-white">Daily Target Progress</h3>
              <p className="text-xs text-slate-400">
                Study goal: {dailyStudyGoal}h/day · Tasks + Study combined
              </p>
            </div>
          </div>
          <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
            {combinedGoalPercent}% Completed
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-[#0d121d] rounded-full h-3.5 p-0.5 border border-[#1e2638] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${combinedGoalPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-md shadow-cyan-500/20"
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
            <span>Study: {studyProgressPercent}%</span>
            <span>Tasks: {taskProgressPercent}%</span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Action Command Bar ─────────────────────────────────────────── */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
      >
        <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider">Quick Action Command Bar</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button onClick={onOpenExport} className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:-translate-y-0.5">
            📊 Export Excel
          </button>
          <button onClick={onOpenLogStudy} className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all hover:-translate-y-0.5">
            <BookOpen className="w-4 h-4" /> + Log Study
          </button>
          <button onClick={onOpenNewTask} className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> + Add Task
          </button>
          <button onClick={onOpenNewHabit} className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all hover:-translate-y-0.5">
            <Flame className="w-4 h-4" /> + New Habit
          </button>
          <button onClick={() => setActiveTab('journal')} className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all hover:-translate-y-0.5">
            <Sparkles className="w-4 h-4" /> Reflection
          </button>
        </div>
      </motion.div>

      {/* ── Recent Activity ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Study Sessions */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-white">Recent Study Activity</h3>
            </div>
            <button onClick={onOpenLogStudy} className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
              + Log Session
            </button>
          </div>
          <div className="space-y-3">
            {studySessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-medium">No study sessions yet.</p>
                <button onClick={onOpenLogStudy} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30">
                  Log Your First Session
                </button>
              </div>
            ) : (
              studySessions.slice(0, 4).map((session) => (
                <div key={session._id} className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-start justify-between gap-3 hover:border-cyan-500/40 transition-all">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{session.subject}</h4>
                    <p className="text-xs text-slate-400 truncate">{session.topic}</p>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{session.date}</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-cyan-600/20 px-3 py-1.5 rounded-xl border border-cyan-500/30 whitespace-nowrap shrink-0">
                    ⏱️ {session.durationMinutes} min
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Active Tasks */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">Active Quest Board</h3>
            </div>
            <button onClick={() => setActiveTab('tasks')} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'completed').length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xs font-medium">All active tasks completed! 🎉</p>
              </div>
            ) : (
              tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task) => (
                <div key={task._id} className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-center justify-between hover:border-blue-500/40 transition-all">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-100 truncate">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.category} · {task.priority}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-[#1a2234] px-2.5 py-1 rounded-lg border border-[#26324c] whitespace-nowrap shrink-0 ml-2">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
