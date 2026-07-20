import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Clock, Sparkles } from 'lucide-react';

export default function NewReminderModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('20:00');
  const [category, setCategory] = useState('Study');
  const [repeat, setRepeat] = useState('daily');

  if (!isOpen) return null;

  const presets = [
    { title: 'Study Backend at 8 PM', time: '20:00', category: 'Study' },
    { title: 'Drink Water', time: '14:00', category: 'Health' },
    { title: 'Exercise & Stretching', time: '18:30', category: 'Fitness' },
    { title: 'Take a 10-Min Focus Break', time: '16:00', category: 'Health' },
  ];

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setTime(preset.time);
    setCategory(preset.category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !time) return;

    onCreate({
      title,
      time,
      category,
      repeat,
    });

    setTitle('');
    setTime('20:00');
    setCategory('Study');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#121723] border border-[#1e2638] rounded-3xl p-6 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Create Browser Reminder</h3>
                <p className="text-xs text-slate-400">Scheduled desktop notifications</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2234]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#0d121d] hover:bg-amber-500/10 border border-[#1e2638] hover:border-amber-500/30 text-[11px] text-slate-300 font-semibold transition-all"
                >
                  ⚡ {p.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Reminder Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study Backend at 8 PM"
                className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Time & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Time *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Task">Task</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            {/* Repeat */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Frequency</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRepeat('daily')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    repeat === 'daily'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#0d121d] text-slate-400 border border-[#1e2638]'
                  }`}
                >
                  Every Day
                </button>
                <button
                  type="button"
                  onClick={() => setRepeat('once')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    repeat === 'once'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#0d121d] text-slate-400 border border-[#1e2638]'
                  }`}
                >
                  One Time Only
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1e2638]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              >
                Set Reminder
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
