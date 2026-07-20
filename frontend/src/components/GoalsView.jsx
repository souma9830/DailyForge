import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Award, 
  Calendar, 
  Sparkles,
  TrendingUp,
  Sliders
} from 'lucide-react';

export default function GoalsView({ goals = [], onCreateGoal, onUpdateGoal, onDeleteGoal, onOpenNewGoal }) {
  const [filter, setFilter] = useState('all'); // all, in_progress, completed

  const filteredGoals = goals.filter((g) => {
    if (filter === 'in_progress') return g.status !== 'completed';
    if (filter === 'completed') return g.status === 'completed';
    return true;
  });

  // Calculate high-level summary metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const overallCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Helper for deadline countdown calculations
  const getDaysRemaining = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Motivating Header & Progress Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" /> Milestone Goals Engine
            </div>
            <h2 className="text-2xl font-black text-white">Goals & Targets Tracker</h2>
            <p className="text-xs text-slate-400 mt-1">
              Define target deadlines, track progress percentage, and log milestones stored in MongoDB.
            </p>
          </div>

          <button
            onClick={onOpenNewGoal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white shadow-lg shadow-purple-600/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Goal
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Goals</span>
              <div className="text-xl font-black text-white mt-0.5">{totalGoals}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center border border-purple-500/30">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Goals</span>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{completedGoals}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Milestone Rate</span>
              <div className="text-xl font-black text-indigo-400 mt-0.5">{overallCompletionRate}%</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/30">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          All Goals ({goals.length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'in_progress'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          In Progress ({goals.filter((g) => g.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'completed'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-[#121723] text-slate-400 border border-[#1e2638] hover:text-white'
          }`}
        >
          Completed ({completedGoals})
        </button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-[#1e2638] text-center space-y-3">
          <Target className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No goals found</h3>
          <p className="text-xs text-slate-400">Set ambition into action by adding your first goal!</p>
          <button
            onClick={onOpenNewGoal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredGoals.map((goal) => {
              const isDone = goal.status === 'completed' || goal.progress >= 100;
              const daysRemaining = getDaysRemaining(goal.deadline);

              return (
                <motion.div
                  key={goal._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-5 transition-all ${
                    isDone
                      ? 'border-emerald-500/40 bg-[#0c1815]/80'
                      : 'border-[#1e2638] hover:border-purple-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top row: Category, Deadline & Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                          {goal.category}
                        </span>

                        {/* Deadline Badge */}
                        {goal.deadline && (
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                            isDone 
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : daysRemaining !== null && daysRemaining <= 3
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-[#151c2c] text-slate-300 border-[#1e2638]'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {isDone
                              ? 'Goal Achieved'
                              : daysRemaining !== null && daysRemaining >= 0
                              ? `${daysRemaining} days left`
                              : `Due ${goal.deadline}`}
                          </span>
                        )}
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => onDeleteGoal(goal._id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Goal Title & Notes */}
                    <div>
                      <h3 className={`text-lg font-extrabold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {goal.title}
                      </h3>
                      {goal.notes && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{goal.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Progress Section with Beautiful Gradient Progress Bar */}
                  <div className="space-y-3 pt-2 border-t border-[#1e2638]">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" /> Progress:
                      </span>
                      <span className={`font-black ${isDone ? 'text-emerald-400' : 'text-purple-400'}`}>
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Animated Gradient Progress Bar */}
                    <div className="w-full bg-[#0d121d] rounded-full h-3.5 p-0.5 border border-[#1e2638] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full transition-all ${
                          isDone
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 shadow-md shadow-purple-500/20'
                        }`}
                      />
                    </div>

                    {/* Interactive Progress Controls */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Step Adjust Buttons */}
                      <div className="flex items-center gap-1.5">
                        {[25, 50, 75, 100].map((val) => (
                          <button
                            key={val}
                            onClick={() => onUpdateGoal(goal._id, { progress: val })}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              goal.progress === val
                                ? 'bg-purple-600 text-white'
                                : 'bg-[#121723] hover:bg-[#1a2234] text-slate-400 border border-[#1e2638]'
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>

                      {/* Complete Toggle Button */}
                      <button
                        onClick={() =>
                          onUpdateGoal(goal._id, {
                            status: isDone ? 'in_progress' : 'completed',
                            progress: isDone ? 50 : 100,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-600/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isDone ? 'Completed' : 'Mark Completed'}
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
