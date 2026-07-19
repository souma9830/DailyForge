import React from 'react';
import { Plus, Flame, CheckSquare, Search, Database } from 'lucide-react';

export default function Navbar({ onOpenNewHabit, onOpenNewTask, isMongoConnected }) {
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 border-b border-[#1e2638] bg-[#0d121d]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search & Date info */}
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-sm font-bold text-slate-200">Personal Workspace</h2>
          <p className="text-xs text-slate-400 font-medium">{currentDateStr}</p>
        </div>

        {/* Database Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#151c2c] border border-[#1e2638]">
          <Database className={`w-3.5 h-3.5 ${isMongoConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={isMongoConnected ? 'text-emerald-300' : 'text-amber-300'}>
            {isMongoConnected ? 'MongoDB Live' : 'Hybrid Auto-Storage'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNewHabit}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>New Habit</span>
        </button>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
