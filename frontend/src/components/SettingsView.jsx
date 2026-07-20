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
  Database,
  Sparkles
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../services/api';

export default function SettingsView({ stats, onReload, onUsernameChange }) {
  const [username, setUsername] = useState('');
  const [dailyStudyGoal, setDailyStudyGoal] = useState(6);
  const [notificationTime, setNotificationTime] = useState('20:00');
  const [theme, setTheme] = useState('dark');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetchSettings();
      if (res?.data?.data) {
        const s = res.data.data;
        if (s.username) setUsername(s.username);
        if (s.dailyStudyGoal) setDailyStudyGoal(s.dailyStudyGoal);
        if (s.notificationTime) setNotificationTime(s.notificationTime);
        if (s.theme) setTheme(s.theme);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        username,
        dailyStudyGoal: Number(dailyStudyGoal),
        notificationTime,
        theme,
      });

      setToast('Settings successfully saved to MongoDB!');
      setTimeout(() => setToast(null), 4000);
      if (onUsernameChange) onUsernameChange(username);
      if (onReload) onReload();
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings: ' + err.message);
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
      {/* Motivating Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center border border-blue-500/30 text-blue-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">System Settings & Configuration</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize your profile, daily goals, scheduled notifications, and visual theme stored in MongoDB.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: User Profile Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <User className="w-4 h-4 text-blue-400" /> User Profile & Display Name
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Username / Explorer Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Soumadeep"
              className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 max-w-md"
            />
            <p className="text-[11px] text-slate-400 mt-1">Displayed in greetings, achievement badges, and reports.</p>
          </div>
        </div>

        {/* Card 2: Daily Study Goal */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Clock className="w-4 h-4 text-cyan-400" /> Daily Target Study Hours
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
              onChange={(e) => setDailyStudyGoal(e.target.value)}
              className="w-full accent-cyan-400"
            />
            <p className="text-[11px] text-slate-400">Used for calculating daily progress bars and target completion alerts.</p>
          </div>
        </div>

        {/* Card 3: Notification Scheduled Time */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Bell className="w-4 h-4 text-amber-400" /> Default Scheduled Notification Time
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
            <p className="text-[11px] text-slate-400">Time when daily study reminders will trigger in your browser.</p>
          </div>
        </div>

        {/* Card 4: Theme Selection */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e2638] pb-3">
            <Palette className="w-4 h-4 text-purple-400" /> Application Visual Theme
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

        {/* Submit Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1e2638]">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving to MongoDB...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
