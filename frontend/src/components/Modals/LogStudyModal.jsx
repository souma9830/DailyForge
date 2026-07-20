import React, { useState } from 'react';
import { X, BookOpen, Clock } from 'lucide-react';

export default function LogStudyModal({ isOpen, onClose, onCreate }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState('Medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;
    onCreate({
      subject,
      topic,
      durationMinutes: Number(durationMinutes),
      difficulty,
      notes,
    });
    setSubject('');
    setTopic('');
    setDurationMinutes(60);
    setDifficulty('Medium');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#121723] border border-[#1e2638] rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Log Study Session</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Topic *</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Graph Algorithms"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                max="600"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Key Learnings / Notes</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key concepts reviewed or challenges solved"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1e2638]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20"
            >
              Log Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
