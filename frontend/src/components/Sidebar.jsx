import React from 'react';
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  BookOpen,
  Calendar,
  Target,
  Bell,
  Sparkles,
  BarChart3,
  Settings,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Forge Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habit Forge', icon: Flame },
    { id: 'tasks', label: 'Daily Task Manager', icon: CheckSquare },
    { id: 'study', label: 'Study Logger', icon: BookOpen },
    { id: 'calendar', label: 'Calendar Hub', icon: Calendar },
    { id: 'goals', label: 'Goals Tracker', icon: Target },
    { id: 'reminders', label: 'Reminders & Alerts', icon: Bell },
    { id: 'journal', label: 'Reflection Journal', icon: Sparkles },
    { id: 'analytics', label: 'Productivity Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d111a] border-r border-[#1e2638] flex flex-col justify-between hidden md:flex min-h-screen p-4 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-wider text-white">
              DAILY<span className="forge-gradient-text">FORGE</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Productivity Engine
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151c2c]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Level & Mastery Widget */}
      <div className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-blue-400">LEVEL {stats?.level || 1}</span>
          <span className="text-[11px] text-slate-400 font-bold">{stats?.xp || 0} XP</span>
        </div>
        <div className="w-full bg-[#0d111a] h-2 rounded-full overflow-hidden border border-[#1e2638]">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${(stats?.xp || 0) % 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 text-center font-semibold">
          Daily Forge Mastery Active
        </p>
      </div>
    </aside>
  );
}
