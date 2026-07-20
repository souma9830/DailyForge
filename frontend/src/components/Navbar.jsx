import React from 'react';
import { Plus, Sparkles, FileSpreadsheet, Menu } from 'lucide-react';

export default function Navbar({ onOpenNewHabit, onOpenNewTask, onOpenExport, isMongoConnected, onToggleMobileNav }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0d14]/80 backdrop-blur-md border-b border-[#1e2638] px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Search / Status Indicator & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-[#121723] border border-[#1e2638]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121723] border border-[#1e2638] text-xs">
          <div className={`w-2 h-2 rounded-full ${isMongoConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-semibold text-slate-300">
            {isMongoConnected ? 'MongoDB Connected' : 'Local Persistence Mode'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Export Excel Button */}
        <button
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#121723] hover:bg-emerald-500/10 border border-[#1e2638] hover:border-emerald-500/30 text-emerald-400 transition-all"
          title="Export Study Logs, Tasks & Habits to Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span className="hidden sm:inline">Export Excel (.xlsx)</span>
        </button>

        <button
          onClick={onOpenNewHabit}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#121723] hover:bg-[#1a2234] border border-[#1e2638] text-slate-200 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> New Habit
        </button>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Task
        </button>
      </div>
    </header>
  );
}
