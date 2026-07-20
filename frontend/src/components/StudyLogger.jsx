import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Search, 
  Plus, 
  Trash2, 
  Calendar, 
  Flame, 
  Award, 
  Filter, 
  FileText,
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function StudyLogger({ studySessions = [], onCreateStudySession, onDeleteStudySession }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    onCreateStudySession({
      subject,
      topic,
      durationMinutes: Number(durationMinutes) || 30,
      difficulty,
      notes,
      date,
    });

    // Reset Form
    setSubject('');
    setTopic('');
    setDurationMinutes(60);
    setDifficulty('Medium');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Metrics Calculations
  const totalSessions = studySessions.length;
  const totalMinutes = studySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Filter study logs
  let filteredLogs = [...studySessions];

  if (filterDifficulty !== 'All') {
    filteredLogs = filteredLogs.filter((s) => s.difficulty === filterDifficulty);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredLogs = filteredLogs.filter(
      (s) =>
        (s.subject && s.subject.toLowerCase().includes(q)) ||
        (s.topic && s.topic.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        (s.date && s.date.includes(q))
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner & Summary Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Study Logger & Time Tracker
          </div>
          <h2 className="text-2xl font-black text-white">Study Logger</h2>
          <p className="text-xs text-slate-400 mt-1">
            Log your study topics, track focus duration, notes, and analyze your subject mastery history in MongoDB.
          </p>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Total Study Time</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">{totalHours} <span className="text-xs font-normal text-cyan-400">Hours</span></div>
            <p className="text-[11px] text-slate-400 mt-1">{totalMinutes} mins logged across {totalSessions} sessions</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Total Sessions</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">{totalSessions} <span className="text-xs font-normal text-blue-400">Logs</span></div>
            <p className="text-[11px] text-slate-400 mt-1">Average {avgMinutes} mins / session</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
              <span>Hardest Challenge</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {studySessions.filter(s => s.difficulty === 'Expert' || s.difficulty === 'Hard').length} <span className="text-xs font-normal text-purple-400">Hard/Expert</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">High difficulty topics tackled</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Study Session Form */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-5 h-fit">
          <div className="flex items-center gap-2 border-b border-[#1e2638] pb-4">
            <Plus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Log Study Session</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Computer Science, Math, Physics"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Topic / Lesson *</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Graph Algorithms & Dijkstra DFS"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Duration & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Duration (Mins) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="600"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🟠 Hard</option>
                  <option value="Expert">🔴 Expert</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Key Notes / Takeaways</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write key concepts, solved problems, or reminders..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition-all"
            >
              + Save Study Session
            </button>
          </form>
        </div>

        {/* Right Column: Searchable Table of Previous Study Logs */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2638] pb-4">
            <div>
              <h3 className="font-bold text-base text-white">Study Session History</h3>
              <p className="text-xs text-slate-400">Searchable list of all logged study sessions stored in MongoDB</p>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-[#0d121d] text-slate-200 text-xs rounded-xl px-3 py-1.5 border border-[#1e2638] focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search study logs by Subject, Topic, Date, or Notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Searchable Table */}
          <div className="overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-medium">No study sessions found matching your search.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1e2638] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Subject & Topic</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Difficulty</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2638]/60 text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#121826]/70 transition-colors group">
                      {/* Date */}
                      <td className="py-3.5 px-3 font-semibold text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{log.date}</span>
                        </div>
                      </td>

                      {/* Subject & Topic */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{log.subject}</div>
                        <div className="text-[11px] text-cyan-300 font-medium">{log.topic}</div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                          <Clock className="w-3 h-3" /> {log.durationMinutes} mins
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          log.difficulty === 'Expert' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          log.difficulty === 'Hard' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          log.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {log.difficulty}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                        {log.notes || '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => onDeleteStudySession(log._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
