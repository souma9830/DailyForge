import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Lock, 
  Unlock, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Zap,
  Star,
  BookOpen,
  Target
} from 'lucide-react';

export default function AchievementsView({ studySessions = [], habits = [], tasks = [], goals = [] }) {
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  // Dynamic MongoDB Metrics Calculations
  const totalStudySessions = studySessions.length;
  
  const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length;

  const maxHabitStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak || 0)) : 0;
  const maxBestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.bestStreak || 0)) : 0;
  const activeStreak = Math.max(maxHabitStreak, maxBestStreak);

  // System Achievements Definition
  const ALL_ACHIEVEMENTS = [
    {
      id: 'first_study',
      title: 'First Study Session',
      description: 'Log your very first study session in the Study Logger.',
      category: 'Study',
      xp: 50,
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-500',
      unlocked: totalStudySessions >= 1,
      current: totalStudySessions,
      target: 1,
      unit: 'session',
    },
    {
      id: 'study_10_hours',
      title: '10 Study Hours',
      description: 'Accumulate a total of 10 focus hours.',
      category: 'Study',
      xp: 150,
      icon: Trophy,
      color: 'from-cyan-500 to-emerald-500',
      unlocked: Number(totalStudyHours) >= 10,
      current: Number(totalStudyHours),
      target: 10,
      unit: 'hours',
    },
    {
      id: 'topics_100',
      title: '100 Topics Completed',
      description: 'Complete 100 study topics & quests.',
      category: 'Mastery',
      xp: 500,
      icon: Award,
      color: 'from-purple-600 to-pink-500',
      unlocked: totalStudySessions + completedTasksCount >= 100,
      current: totalStudySessions + completedTasksCount,
      target: 100,
      unit: 'topics',
    },
    {
      id: 'streak_7_day',
      title: '7 Day Streak',
      description: 'Maintain consistency for 7 consecutive days.',
      category: 'Streak',
      xp: 200,
      icon: Flame,
      color: 'from-amber-500 to-orange-500',
      unlocked: activeStreak >= 7,
      current: activeStreak,
      target: 7,
      unit: 'days',
    },
    {
      id: 'streak_30_day',
      title: '30 Day Streak',
      description: 'Achieve a legendary 30-day streak of productivity.',
      category: 'Streak',
      xp: 1000,
      icon: Zap,
      color: 'from-amber-400 via-rose-500 to-purple-600',
      unlocked: activeStreak >= 30,
      current: activeStreak,
      target: 30,
      unit: 'days',
    },
    {
      id: 'task_master_10',
      title: 'Quest Master',
      description: 'Finish 10 daily tasks in the Task Board.',
      category: 'Tasks',
      xp: 100,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-400',
      unlocked: completedTasksCount >= 10,
      current: completedTasksCount,
      target: 10,
      unit: 'tasks',
    },
    {
      id: 'goal_crusher',
      title: 'Goal Crusher',
      description: 'Achieve 100% completion on your first milestone goal.',
      category: 'Goals',
      xp: 300,
      icon: Target,
      color: 'from-indigo-600 to-purple-500',
      unlocked: completedGoalsCount >= 1,
      current: completedGoalsCount,
      target: 1,
      unit: 'goal',
    },
  ];

  // Filtering
  const filteredAchievements = ALL_ACHIEVEMENTS.filter((ach) => {
    if (filter === 'unlocked') return ach.unlocked;
    if (filter === 'locked') return !ach.unlocked;
    return true;
  });

  const unlockedCount = ALL_ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalXP = ALL_ACHIEVEMENTS.reduce((acc, curr) => acc + (curr.unlocked ? curr.xp : 0), 0);

  return (
    <div className="space-y-6">
      {/* Motivating Gamified Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Gamified Mastery Engine
            </div>
            <h2 className="text-2xl font-black text-white">DailyForge Achievements</h2>
            <p className="text-xs text-slate-400 mt-1">
              Unlock prestigious badges automatically as your study hours, streaks, and tasks grow in MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Star className="w-5 h-5 fill-slate-950 stroke-none" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Earned XP</span>
                <div className="text-lg font-black text-amber-400">{totalXP} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Badges Metric Progress */}
        <div className="p-5 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Unlocked Badges: <span className="text-amber-400">{unlockedCount}</span> of {ALL_ACHIEVEMENTS.length}
              </span>
            </div>
            <span className="text-xs font-black text-amber-400">
              {Math.round((unlockedCount / ALL_ACHIEVEMENTS.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-[#151c2c] rounded-full h-3 p-0.5 border border-[#1e2638] overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCount / ALL_ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          All Badges ({ALL_ACHIEVEMENTS.length})
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unlocked'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          Unlocked 🏆 ({unlockedCount})
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'locked'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          Locked 🔒 ({ALL_ACHIEVEMENTS.length - unlockedCount})
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAchievements.map((ach) => {
            const Icon = ach.icon;
            const progressPercent = Math.min(100, Math.round((ach.current / ach.target) * 100));

            return (
              <motion.div
                key={ach.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                  ach.unlocked
                    ? 'border-amber-500/40 bg-[#141822]/90 shadow-xl shadow-amber-500/10'
                    : 'border-[#1e2638] bg-[#090d15]/60 opacity-70'
                }`}
              >
                {/* Header: Icon & XP Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${ach.color} text-white shadow-lg shadow-amber-500/10 ${
                    !ach.unlocked && 'grayscale opacity-60'
                  }`}>
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      +{ach.xp} XP
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      ach.unlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#151c2c] text-slate-400 border border-[#1e2638]'
                    }`}>
                      {ach.unlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                      {ach.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className={`text-base font-extrabold ${ach.unlocked ? 'text-white' : 'text-slate-300'}`}>
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                </div>

                {/* Progress Bar & Criteria */}
                <div className="space-y-2 pt-2 border-t border-[#1e2638]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Requirement Criteria:</span>
                    <span className={ach.unlocked ? 'text-emerald-400' : 'text-amber-400'}>
                      {ach.current} / {ach.target} {ach.unit}
                    </span>
                  </div>

                  <div className="w-full bg-[#0d121d] rounded-full h-2.5 border border-[#1e2638] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.unlocked
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
