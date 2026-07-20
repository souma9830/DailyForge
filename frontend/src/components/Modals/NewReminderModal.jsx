import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Bell, Phone, Repeat, BookOpen, AlertCircle } from 'lucide-react';

export default function NewReminderModal({ isOpen, onClose, onCreate }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [reminderBeforeMinutes, setReminderBeforeMinutes] = useState(5);
  const [repeatEveryMinutes, setRepeatEveryMinutes] = useState(15);
  const [ntfyTopic, setNtfyTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      subject,
      topic,
      scheduledTime,
      reminderBeforeMinutes,
      repeatEveryMinutes,
      ntfyTopic
    });
    // reset
    setSubject('');
    setTopic('');
    setScheduledTime('08:00');
    setReminderBeforeMinutes(5);
    setRepeatEveryMinutes(15);
    setNtfyTopic('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#06080d]/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0d121d] border border-[#1e2638] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1e2638] flex justify-between items-center bg-[#121723]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/30 text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Schedule Attendance</h3>
                <p className="text-[11px] text-slate-400">Repeats until you confirm you are present.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-[#1e2638] rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Subject & Topic */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Backend"
                  className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. JWT Auth"
                  className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Time & Advance Warning */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#121723] border border-[#1e2638]">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Start Time
                </label>
                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Warn Before
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={reminderBeforeMinutes}
                    onChange={e => setReminderBeforeMinutes(e.target.value)}
                    className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-4 top-3 text-sm text-slate-500 font-bold">m</span>
                </div>
              </div>
            </div>

            {/* Repeat Interval */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#121723] border border-[#1e2638]">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-emerald-400" /> Repeat if unconfirmed
              </label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={repeatEveryMinutes}
                  onChange={e => setRepeatEveryMinutes(e.target.value)}
                  className="flex-1 accent-emerald-400"
                />
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  {repeatEveryMinutes} min
                </span>
              </div>
            </div>

            {/* Ntfy integration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-400" /> Ntfy Push Topic (Optional)
              </label>
              <input
                type="text"
                value={ntfyTopic}
                onChange={e => setNtfyTopic(e.target.value)}
                placeholder="e.g. souma-alerts"
                className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Install the ntfy app and subscribe to this topic for mobile notifications.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Create Attendance Schedule
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
