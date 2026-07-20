import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Droplet, 
  Dumbbell, 
  BookOpen, 
  Volume2,
  CheckCircle2
} from 'lucide-react';

export default function RemindersView({ reminders = [], onCreateReminder, onToggleReminder, onDeleteReminder, onOpenNewReminder }) {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [notificationToast, setNotificationToast] = useState(null);

  // Request Notification Permission
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const res = await Notification.requestPermission();
    setPermission(res);
  };

  // Trigger test notification
  const triggerTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('🔥 DailyForge Reminder Engine Active!', {
        body: 'Scheduled notifications will arrive automatically at your chosen target times.',
        icon: '/favicon.ico',
      });
      setNotificationToast('Test notification dispatched!');
      setTimeout(() => setNotificationToast(null), 4000);
    } else {
      requestPermission();
    }
  };

  // Quick Preset Add Handler
  const handleQuickAdd = (title, time, category) => {
    onCreateReminder({ title, time, category, repeat: 'daily' });
  };

  return (
    <div className="space-y-6">
      {/* Header & Browser Notification Permission Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" /> Scheduled Notifications Engine
            </div>
            <h2 className="text-2xl font-black text-white">Browser Reminders & Timers</h2>
            <p className="text-xs text-slate-400 mt-1">
              Set scheduled alerts for study sessions, hydration, and exercise backed by MongoDB persistence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerTestNotification}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#121723] hover:bg-[#1a2234] border border-[#1e2638] text-slate-200 flex items-center gap-1.5 transition-all"
            >
              <Volume2 className="w-4 h-4 text-amber-400" /> Test Notification
            </button>
            <button
              onClick={onOpenNewReminder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Reminder
            </button>
          </div>
        </div>

        {/* Permission Status Box */}
        <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              permission === 'granted'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}>
              {permission === 'granted' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Browser Notification Permission:
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${
                  permission === 'granted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {permission}
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                {permission === 'granted'
                  ? 'System notifications are active! Alerts will pop up at scheduled target times.'
                  : 'Notifications require browser permission to trigger desktop popups.'}
              </p>
            </div>
          </div>

          {permission !== 'granted' && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Enable Browser Notifications
            </button>
          )}
        </div>
      </div>

      {/* Quick Template Preset Buttons */}
      <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> One-Click Quick Reminders
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Preset 1: Study Backend at 8 PM */}
          <button
            onClick={() => handleQuickAdd('Study Backend at 8 PM', '20:00', 'Study')}
            className="p-4 rounded-2xl bg-[#0d121d] hover:bg-[#151c2c] border border-[#1e2638] hover:border-amber-500/40 text-left transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/30 text-blue-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                20:00 (8 PM)
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300">Study Backend at 8 PM</h4>
            <p className="text-[11px] text-slate-400">+ Add daily study alert</p>
          </button>

          {/* Preset 2: Drink Water */}
          <button
            onClick={() => handleQuickAdd('Drink Water', '14:00', 'Health')}
            className="p-4 rounded-2xl bg-[#0d121d] hover:bg-[#151c2c] border border-[#1e2638] hover:border-cyan-500/40 text-left transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 text-cyan-400">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                14:00 (2 PM)
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">Drink Water</h4>
            <p className="text-[11px] text-slate-400">+ Add daily hydration alert</p>
          </button>

          {/* Preset 3: Exercise */}
          <button
            onClick={() => handleQuickAdd('Exercise & Workout', '18:30', 'Fitness')}
            className="p-4 rounded-2xl bg-[#0d121d] hover:bg-[#151c2c] border border-[#1e2638] hover:border-emerald-500/40 text-left transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                18:30 (6:30 PM)
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">Exercise & Workout</h4>
            <p className="text-[11px] text-slate-400">+ Add daily workout alert</p>
          </button>
        </div>
      </div>

      {/* Active Reminders List */}
      <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Active Scheduled Reminders ({reminders.length})
          </h3>
          <span className="text-xs text-slate-400">Stored in MongoDB</span>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No scheduled reminders found.</p>
            <button
              onClick={onOpenNewReminder}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
            >
              <Plus className="w-4 h-4" /> Create Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {reminders.map((rem) => (
                <motion.div
                  key={rem._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    rem.isActive
                      ? 'bg-[#0d121d] border-[#1e2638] hover:border-amber-500/30'
                      : 'bg-[#090d15]/50 border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Time Badge */}
                    <div className="w-14 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center font-black text-amber-400 text-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                      <span>{rem.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white">{rem.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-[#151c2c] px-2 py-0.5 rounded border border-[#1e2638]">
                          {rem.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Frequency: <span className="text-slate-300 font-semibold">{rem.repeat}</span> • Status: {' '}
                        <span className={rem.isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {rem.isActive ? 'Active 🔔' : 'Paused 🔕'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Controls: Toggle & Delete */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleReminder(rem._id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        rem.isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-[#151c2c] text-slate-400 border border-[#1e2638]'
                      }`}
                    >
                      {rem.isActive ? 'Active' : 'Enable'}
                    </button>

                    <button
                      onClick={() => onDeleteReminder(rem._id)}
                      className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Notification Toast Alert */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>{notificationToast}</span>
        </div>
      )}
    </div>
  );
}
