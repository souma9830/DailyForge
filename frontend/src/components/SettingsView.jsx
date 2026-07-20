import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Clock, 
  Bell, 
  Palette, 
  Save, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { updateSettings } from '../services/api';

export default function SettingsView({ settings = {}, onReload, addToast, onSettingsChange }) {
  const [username, setUsername] = useState('');
  const [dailyStudyGoal, setDailyStudyGoal] = useState(6);
  const [notificationTime, setNotificationTime] = useState('20:00');
  const [theme, setTheme] = useState('dark');
  const [saving, setSaving] = useState(false);

  // Sync local state from settings prop (comes from MongoDB via App.jsx)
  useEffect(() => {
    if (settings) {
      if (settings.username !== undefined) setUsername(settings.username);
      if (settings.dailyStudyGoal !== undefined) setDailyStudyGoal(Number(settings.dailyStudyGoal));
      if (settings.notificationTime !== undefined) setNotificationTime(settings.notificationTime);
      if (settings.theme !== undefined) setTheme(settings.theme);
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        username: username.trim(),
        dailyStudyGoal: Number(dailyStudyGoal),
        notificationTime,
        theme,
      };
      await updateSettings(updated);

      // Immediately propagate to App.jsx so Dashboard updates without reload
      if (onSettingsChange) onSettingsChange(prev => ({ ...prev, ...updated }));

      addToast('Settings saved to MongoDB ✅', 'success');
      if (onReload) onReload();
    } catch (err) {
      addToast('Failed to save settings: ' + (err?.response?.data?.message || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'dark', name: 'Dark Forge (Default)', color: 'from-[#0a0d14] to-[#121723]', border: 'border-blue-500' },
    { id: 'blue', name: 'Neon Cyber Blue', color: 'from-[#09152b] to-[#102445]', border: 'border-cyan-400' },
    { id: 'emerald', name: 'Emerald Mastery', color: 'from-[#061814] to-[#0c2b23]', border: 'border-emerald-400' },
    { id: 'amber', name: 'Amber Pulse', color: 'from-[#1c1306] to-[#30220c]', border: 'border-amber-400' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center border border-blue-500/30 text-blue-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">System Settings</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              All changes save to MongoDB Atlas and immediately reflect across the entire app.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Username */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <User className="w-4 h-4 text-blue-400" /> User Profile & Display Name
          </h3>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Your Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Soumadeep"
              className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 max-w-md"
            />
            <p className="text-[11px] text-slate-400 mt-1">Shown in the welcome greeting and throughout the app.</p>
          </div>
        </div>

        {/* Daily Study Goal */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Clock className="w-4 h-4 text-cyan-400" /> Daily Study Goal
          </h3>
          <div className="space-y-3 max-w-md">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Target Study Duration:</span>
              <span className="text-cyan-400 font-extrabold text-sm">{dailyStudyGoal} Hours / Day</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="0.5"
              value={dailyStudyGoal}
              onChange={(e) => setDailyStudyGoal(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
              <span>1h</span>
              <span>8h</span>
              <span>16h</span>
            </div>
            <p className="text-[11px] text-slate-400">Used to calculate daily progress bars on the Dashboard.</p>
          </div>
        </div>

        {/* Notification Time */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Bell className="w-4 h-4 text-amber-400" /> Default Notification Time
          </h3>
          <div className="max-w-md space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">Daily Alert Time (HH:mm)</label>
            <input
              type="time"
              required
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              className="bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400">
              Notifications fire via the browser Service Worker even when the tab is in the background.
              Requires browser to be open.
            </p>
          </div>
        </div>

        {/* Theme */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Palette className="w-4 h-4 text-purple-400" /> App Visual Theme
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border text-left transition-all space-y-2 bg-gradient-to-r ${t.color} ${
                  theme === t.id
                    ? `${t.border} ring-2 ring-purple-500/50 shadow-lg`
                    : 'border-[#1e2638] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  {theme === t.id && <Sparkles className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="w-full bg-[#0d121d]/60 h-2 rounded-full overflow-hidden border border-[#1e2638]">
                  <div className={`h-full bg-gradient-to-r ${t.color}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1e2638]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving to MongoDB…' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
