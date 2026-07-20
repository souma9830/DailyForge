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
  TrendingUp, 
  Calendar,
  Zap,
  Target,
  Award
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
  setActiveTab 
}) {
  const summary = stats?.summary || {};
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's study hours
  const todayStudySessions = studySessions.filter(s => s.date === todayStr || s.createdAt?.startsWith(todayStr));
  const totalStudyMinutes = todayStudySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const studyHoursToday = (totalStudyMinutes / 60).toFixed(1);

  // Target study goal (e.g. 6.0 hours daily target)
  const targetStudyHours = 6.0;
  const studyProgressPercent = Math.min(Math.round((studyHoursToday / targetStudyHours) * 100), 100);

  // Tasks completed today / total
  const tasksCompletedCount = summary.tasksCompleted || 0;
  const tasksTotalCount = summary.tasksTotal || 0;
  const taskProgressPercent = summary.taskCompletionRate || 0;

  // Habit streak summary
  const activeStreak = habits.length ? Math.max(...habits.map(h => h.currentStreak || 0)) : 5;

  // Overall combined Daily Goal Progress percentage
  const combinedGoalPercent = Math.round((studyProgressPercent * 0.5) + (taskProgressPercent * 0.5));

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.08 }
    }
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
      {/* 1. Welcome Message & Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-950/80 via-[#111726] to-[#0d121d] border border-blue-500/25 shadow-2xl"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Daily Mastery Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome back, <span className="forge-gradient-text">Master Explorer</span> 👋
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            You are on a <span className="font-bold text-amber-400">{activeStreak}-day streak</span>! Track your study hours, complete daily tasks, and forge high-performance habits today.
          </p>
        </div>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* 2. Top Metrics Grid: Current Streak, Study Hours, Completed Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Current Streak */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-6 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Streak</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-md shadow-amber-500/10">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeStreak}</span>
            <span className="text-sm font-bold text-amber-400">Days Active 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Consecutive daily consistency</p>
        </motion.div>

        {/* Today's Study Hours */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-6 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Study Hours</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-md shadow-cyan-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{studyHoursToday}</span>
            <span className="text-sm font-bold text-cyan-400">/ {targetStudyHours} hrs 📚</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">{totalStudyMinutes} mins logged today</p>
        </motion.div>

        {/* Today's Completed Tasks */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-6 rounded-3xl border border-[#1e2638] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Tasks</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{tasksCompletedCount}</span>
            <span className="text-sm font-bold text-emerald-400">/ {tasksTotalCount} completed ✅</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">{taskProgressPercent}% completion rate</p>
        </motion.div>
      </div>

      {/* 3. Progress Bar & Daily Goal Master Tracker */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-white">Daily Target Progress</h3>
              <p className="text-xs text-slate-400">Combined progress of study targets and daily tasks</p>
            </div>
          </div>
          <span className="text-sm font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
            {combinedGoalPercent}% Completed
          </span>
        </div>

        {/* Progress Bar Track */}
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
            <span>Study Hours: {studyProgressPercent}%</span>
            <span>Task Quests: {taskProgressPercent}%</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Quick Action Buttons */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
      >
        <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider">Quick Action Command Bar</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Log Study Session */}
          <button
            onClick={onOpenLogStudy}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm group hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>+ Log Study Session</span>
          </button>

          {/* Action 2: Add Task */}
          <button
            onClick={onOpenNewTask}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>+ Add New Task</span>
          </button>

          {/* Action 3: Habit Check-In */}
          <button
            onClick={onOpenNewHabit}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm group hover:-translate-y-0.5"
          >
            <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>+ New Habit</span>
          </button>

          {/* Action 4: Reflection Journal */}
          <button
            onClick={() => setActiveTab('journal')}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-sm group hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Daily Reflection</span>
          </button>
        </div>
      </motion.div>

      {/* 5. Recent Study Activity Feed & Active Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Activity */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-white">Recent Study Activity</h3>
            </div>
            <button
              onClick={onOpenLogStudy}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              + Log Session
            </button>
          </div>

          <div className="space-y-3">
            {studySessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-medium">No study sessions logged yet today.</p>
                <button
                  onClick={onOpenLogStudy}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
                >
                  Log Your First Session
                </button>
              </div>
            ) : (
              studySessions.slice(0, 4).map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-start justify-between gap-3 hover:border-cyan-500/40 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100">{session.subject}</h4>
                    {session.notes && (
                      <p className="text-xs text-slate-400 line-clamp-1">{session.notes}</p>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {session.category || 'Engineering'}
                      </span>
                      <span className="text-[11px] text-slate-400">{session.date}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-white bg-cyan-600/20 px-3 py-1.5 rounded-xl border border-cyan-500/30 whitespace-nowrap">
                    ⏱️ {session.durationMinutes} min
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Active Quest Tasks */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">Active Quest Board</h3>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'completed').length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xs font-medium">All active tasks completed!</p>
              </div>
            ) : (
              tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task) => (
                <div
                  key={task._id}
                  className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-center justify-between hover:border-blue-500/40 transition-all"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{task.category} • Priority: {task.priority}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-[#1a2234] px-2.5 py-1 rounded-lg border border-[#26324c]">
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
