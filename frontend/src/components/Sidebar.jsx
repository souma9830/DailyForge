import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  CheckSquare, 
  BookOpen, 
  BarChart3, 
  Settings,
  Zap,
  Sparkles
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Forge Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'habits', label: 'Habits Forge', icon: Flame, badge: 'Daily' },
  { id: 'tasks', label: 'Task & Quest Board', icon: CheckSquare, badge: null },
  { id: 'journal', label: 'Daily Reflection', icon: BookOpen, badge: null },
  { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const level = stats?.level || 1;
  const xp = stats?.xpCurrentLevel || 0;
  const xpNext = stats?.xpNextLevel || 200;
  const xpPercent = Math.min(Math.round((xp / xpNext) * 100), 100);

  return (
    <aside className="w-64 bg-[#0d121d] border-r border-[#1e2638] flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1e2638]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">DailyForge</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Single-User Master System</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Main Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151c2c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Forge Gamified Progress Level */}
      <div className="p-4 m-3 rounded-2xl bg-[#121723] border border-[#1e2638] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Forge Level {level}</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">{xp} / {xpNext} XP</span>
        </div>
        <div className="w-full bg-[#1e2638] rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 text-center">Complete daily habits to level up</p>
      </div>

      {/* Footer Profile status */}
      <div className="p-4 border-t border-[#1e2638] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
            DF
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Master User</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Offline/Mongo Connected
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
