import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Plus,
  BookOpen
} from 'lucide-react';

export default function Dashboard({ stats, habits, tasks, onToggleHabit, onOpenNewHabit, onOpenNewTask, setActiveTab }) {
  const summary = stats?.summary || {};
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks
  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-blue-900/40 via-indigo-950/60 to-[#121723] border border-blue-500/20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Forge Operational
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Forge Your Greatness Today, <span className="forge-gradient-text">Master</span>.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit." Stay disciplined and track your growth.
          </p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Habit Completion Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1e2638]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Habits Today</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {summary.habitsCompletedToday || 0}/{summary.habitsCount || 0}
            </span>
            <span className="text-xs font-bold text-amber-400">
              ({summary.habitCompletionRate || 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active daily habits logged</p>
        </div>

        {/* Task Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1e2638]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Task Completion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {summary.tasksCompleted || 0}/{summary.tasksTotal || 0}
            </span>
            <span className="text-xs font-bold text-blue-400">
              ({summary.taskCompletionRate || 0}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Completed across all boards</p>
        </div>

        {/* Total Streaks */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1e2638]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Streak Sum</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {summary.totalStreaksSum || 0} <span className="text-sm font-normal text-slate-400">days</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Combined active consistency</p>
        </div>

        {/* Level XP */}
        <div className="glass-panel p-5 rounded-2xl border border-[#1e2638]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Forge Level</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              Lvl {summary.level || 1}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              ({summary.totalXP || 0} XP)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Keep completing habits to gain XP</p>
        </div>
      </div>

      {/* Main Content Grid: Today's Habits & Active Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Habits Check-In */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-base text-white">Today's Habits</h2>
            </div>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No habits configured yet.</p>
                <button
                  onClick={onOpenNewHabit}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Create First Habit
                </button>
              </div>
            ) : (
              habits.slice(0, 5).map((habit) => {
                const isCompletedToday = habit.completedDates?.includes(todayStr);
                return (
                  <div
                    key={habit._id}
                    className="p-3.5 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleHabit(habit._id, todayStr)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isCompletedToday
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'border-2 border-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {isCompletedToday && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>
                      <div>
                        <h4 className={`text-sm font-semibold ${isCompletedToday ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {habit.title}
                        </h4>
                        <p className="text-[11px] text-slate-400">{habit.category} • {habit.currentStreak} day streak</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      🔥 {habit.currentStreak}d
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-base text-white">Active Tasks & Quests</h2>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Open Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">All tasks completed! Great work.</p>
                <button
                  onClick={onOpenNewTask}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Task
                </button>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3.5 rounded-2xl bg-[#121723] border border-[#1e2638] flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[11px] text-slate-400">{task.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-slate-400 bg-[#171e2e] px-2.5 py-1 rounded-lg border border-[#232c3f]">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
