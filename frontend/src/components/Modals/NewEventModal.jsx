import React, { useState } from 'react';
import { X, Calendar, Clock, Mail, Info, FileText } from 'lucide-react';

export default function NewEventModal({ isOpen, onClose, onCreate, initialDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate || '');
  const [time, setTime] = useState('09:00');
  const [email, setEmail] = useState('');
  const [notifyBeforeMinutes, setNotifyBeforeMinutes] = useState(60);

  // Update date if initialDate changes while modal is open (rare but safe)
  React.useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      date,
      time,
      email,
      notifyBeforeMinutes
    });
    // Reset form
    setTitle('');
    setDescription('');
    setTime('09:00');
    setEmail('');
    setNotifyBeforeMinutes(60);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0a0d14] border border-[#1e2638] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2638] flex items-center justify-between shrink-0 bg-[#0d121d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Add Calendar Event</h2>
              <p className="text-xs font-bold text-slate-400">Schedule activities & email reminders</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="newEventForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Event Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Math Exam"
                className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-purple-400" /> Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about this event..."
                className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Email Reminder Settings */}
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-4 mt-2">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-purple-200">Email Reminder</h4>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#121723] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remind Me</label>
                <select
                  value={notifyBeforeMinutes}
                  onChange={e => setNotifyBeforeMinutes(Number(e.target.value))}
                  className="w-full bg-[#121723] border border-[#1e2638] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none"
                >
                  <option value={0}>At time of event</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1e2638] bg-[#0d121d] shrink-0">
          <button
            type="submit"
            form="newEventForm"
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
          >
            Create Event & Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
