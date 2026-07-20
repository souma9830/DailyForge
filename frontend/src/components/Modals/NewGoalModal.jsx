import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, Award, AlignLeft } from 'lucide-react';

export default function NewGoalModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onCreate({
      title,
      category,
      progress: Number(progress),
      deadline,
      notes,
    });

    setTitle('');
    setCategory('Academic');
    setProgress(0);
    setNotes('');
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
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Create Milestone Goal</h3>
                <p className="text-xs text-slate-400">Set targets & track completion percentage</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2234]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Goal Title */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Goal Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React & Node.js Architecture"
                className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category & Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Academic">Academic</option>
                  <option value="Career">Career</option>
                  <option value="Skill">Skill</option>
                  <option value="Personal">Personal</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Initial Progress Percentage */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">Initial Progress Percentage</span>
                <span className="text-purple-400 font-extrabold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Goal Notes */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Notes & Milestones</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detail key steps, prerequisites, or outcomes..."
                className="w-full bg-[#0d121d] border border-[#1e2638] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-400"
              >
                Create Goal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
