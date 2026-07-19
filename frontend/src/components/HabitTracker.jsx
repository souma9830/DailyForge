import React, { useState } from 'react';
import { Flame, Check, Plus, Trash2, Calendar, Award } from 'lucide-react';

export default function HabitTracker({ habits, onToggleHabit, onDeleteHabit, onOpenNewHabit }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Generate last 7 days strings
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-[#1e2638]">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" /> Daily Habits Forge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consistency creates momentum. Log completed days to build streaks.
          </p>
        </div>

        <button
          onClick={onOpenNewHabit}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Habit
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-[#121723] text-slate-400 hover:text-slate-200 border border-[#1e2638]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits Grid / Table */}
      <div className="glass-panel rounded-3xl border border-[#1e2638] overflow-hidden">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <Flame className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold">No habits found in this category.</p>
            <button
              onClick={onOpenNewHabit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
            >
              <Plus className="w-4 h-4" /> Create New Habit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1e2638]">
            {/* Table Header with 7 Days */}
            <div className="p-4 bg-[#0d121d] grid grid-cols-12 items-center text-xs font-bold text-slate-400">
              <div className="col-span-5 sm:col-span-4 pl-2">Habit Name</div>
              <div className="col-span-7 sm:col-span-6 grid grid-cols-7 text-center">
                {last7Days.map((day) => (
                  <div key={day.dateStr} className={`flex flex-col items-center ${day.isToday ? 'text-amber-400 font-extrabold' : ''}`}>
                    <span>{day.dayName}</span>
                    <span className="text-[10px] opacity-75">{day.dayNum}</span>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block sm:col-span-2 text-right pr-2">Streak</div>
            </div>

            {/* Habit Rows */}
            {filteredHabits.map((habit) => (
              <div key={habit._id} className="p-4 grid grid-cols-12 items-center hover:bg-[#121723]/60 transition-all">
                {/* Info */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: habit.color || '#3b82f6' }}
                  >
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{habit.title}</h4>
                    <p className="text-[11px] text-slate-400">{habit.category}</p>
                  </div>
                </div>

                {/* 7 Days Toggle Buttons */}
                <div className="col-span-7 sm:col-span-6 grid grid-cols-7 text-center">
                  {last7Days.map((day) => {
                    const isDone = habit.completedDates?.includes(day.dateStr);
                    return (
                      <div key={day.dateStr} className="flex justify-center">
                        <button
                          onClick={() => onToggleHabit(habit._id, day.dateStr)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-[#151c2c] hover:bg-[#1f293d] border border-[#1e2638] text-slate-600'
                          }`}
                          title={`Toggle for ${day.dateStr}`}
                        >
                          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Streak & Actions */}
                <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-3 pr-2">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1 justify-end">
                      🔥 {habit.currentStreak || 0}d
                    </span>
                    <span className="text-[10px] text-slate-500">Best: {habit.bestStreak || 0}d</span>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit._id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
