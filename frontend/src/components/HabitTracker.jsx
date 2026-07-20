import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Check, 
  Plus, 
  Trash2, 
  Calendar, 
  Award, 
  Sparkles, 
  Target, 
  TrendingUp,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function HabitTracker({ habits, onToggleHabit, onDeleteHabit, onOpenNewHabit }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const todayStr = new Date().toISOString().split('T')[0];

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 6,
    };
  });

  const categories = ['All', 'Health', 'Productivity', 'Mindset', 'Skill', 'Fitness', 'Custom'];

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  // Overall Completion Calculations for Today
  const totalHabitsCount = habits.length;
  const completedTodayCount = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const todayProgressPercent = totalHabitsCount > 0 ? Math.round((completedTodayCount / totalHabitsCount) * 100) : 0;

  // Maximum active streak
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;

  return (
    <div className="space-y-6">
      {/* Motivating Header & Today's Progress Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Habits Forge
            </div>
            <h2 className="text-2xl font-black text-white">Daily Habit Tracker</h2>
            <p className="text-xs text-slate-400 mt-1">
              Consistency creates mastery. Complete daily habits to extend your streaks in MongoDB.
            </p>
          </div>

          <button
            onClick={onOpenNewHabit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Habit
          </button>
        </div>

        {/* Motivating Progress Card */}
        <div className="p-5 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Today's Habit Mastery Progress</h3>
                <p className="text-[11px] text-slate-400">
                  {completedTodayCount} of {totalHabitsCount} habits completed today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                🔥 {maxStreak} Days Top Streak
              </span>
              <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {todayProgressPercent}% Complete
              </span>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#151c2c] rounded-full h-3.5 p-0.5 border border-[#1e2638] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayProgressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 shadow-md shadow-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-[#121723] text-slate-400 hover:text-slate-200 border border-[#1e2638]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits List & Tracker Cards */}
      {filteredHabits.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-[#1e2638] text-center space-y-3">
          <Flame className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No habits found in this category</h3>
          <p className="text-xs text-slate-400">Start building daily discipline by creating your first habit!</p>
          <button
            onClick={onOpenNewHabit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
          >
            <Plus className="w-4 h-4" /> Create Habit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredHabits.map((habit) => {
              const isTodayCompleted = habit.completedDates?.includes(todayStr);
              // Calculate 7-day completion count for progress indicator
              const weeklyCompletedCount = last7Days.filter(d => habit.completedDates?.includes(d.dateStr)).length;
              const weeklyPercentage = Math.round((weeklyCompletedCount / 7) * 100);

              return (
                <motion.div
                  key={habit._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-panel p-5 rounded-3xl border transition-all space-y-4 ${
                    isTodayCompleted 
                      ? 'border-emerald-500/30 bg-[#0d1522]/80' 
                      : 'border-[#1e2638] hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Icon, Title & Streak Badge */}
                    <div className="flex items-center gap-3.5">
                      {/* Interactive Complete Button */}
                      <button
                        onClick={() => onToggleHabit(habit._id, todayStr)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
                          isTodayCompleted
                            ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                            : 'bg-[#121723] hover:bg-[#1a2234] border-2 border-slate-700 text-slate-500 hover:border-amber-400 hover:text-amber-400'
                        }`}
                        title={isTodayCompleted ? 'Completed Today!' : 'Click to complete for today'}
                      >
                        {isTodayCompleted ? (
                          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                        ) : (
                          <Flame className="w-6 h-6" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base font-bold transition-all ${
                            isTodayCompleted ? 'text-emerald-300' : 'text-slate-100'
                          }`}>
                            {habit.title}
                          </h3>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                            🔥 {habit.currentStreak || 0} Streak
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Category: <span className="text-slate-300 font-semibold">{habit.category}</span> • Best Streak: <span className="text-slate-300 font-semibold">{habit.bestStreak || 0} days</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: 7-Day Matrix Toggles */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {last7Days.map((day) => {
                        const isDone = habit.completedDates?.includes(day.dateStr);
                        return (
                          <div key={day.dateStr} className="flex flex-col items-center gap-1">
                            <span className={`text-[10px] font-bold ${day.isToday ? 'text-amber-400' : 'text-slate-500'}`}>
                              {day.dayName}
                            </span>
                            <button
                              onClick={() => onToggleHabit(habit._id, day.dateStr)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${
                                isDone
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                                  : 'bg-[#0d121d] hover:bg-[#151c2c] border border-[#1e2638] text-slate-600'
                              }`}
                              title={`Toggle ${day.dateStr}`}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : day.dayNum}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Progress Indicator & Delete Action */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-[#1e2638] pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-300 block">7-Day Consistency</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 bg-[#0d121d] h-2 rounded-full overflow-hidden border border-[#1e2638]">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${weeklyPercentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-amber-400">{weeklyCompletedCount}/7</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteHabit(habit._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
