import React, { useState, useEffect } from 'react';
import { BookOpen, Smile, Sparkles, Save, Heart, CheckCircle2, History } from 'lucide-react';
import { saveJournal, fetchJournals } from '../services/api';

export default function ReflectionJournal() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [journals, setJournals] = useState([]);
  const [mood, setMood] = useState(4);
  const [moodLabel, setMoodLabel] = useState('Productive');
  const [focusNote, setFocusNote] = useState('');
  const [win1, setWin1] = useState('');
  const [win2, setWin2] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [reflection, setReflection] = useState('');
  const [energyLevel, setEnergyLevel] = useState(4);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      const res = await fetchJournals();
      if (res?.data) {
        setJournals(res.data);
        // If entry for today exists, populate
        const todayEntry = res.data.find(j => j.date === todayStr);
        if (todayEntry) {
          setMood(todayEntry.mood || 4);
          setMoodLabel(todayEntry.moodLabel || 'Productive');
          setFocusNote(todayEntry.focusNote || '');
          setWin1(todayEntry.wins?.[0] || '');
          setWin2(todayEntry.wins?.[1] || '');
          setGratitude1(todayEntry.gratitude?.[0] || '');
          setReflection(todayEntry.reflection || '');
          setEnergyLevel(todayEntry.energyLevel || 4);
        }
      }
    } catch (err) {
      console.error('Failed to load journals', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        date: todayStr,
        mood,
        moodLabel,
        focusNote,
        wins: [win1, win2].filter(Boolean),
        gratitude: [gratitude1].filter(Boolean),
        reflection,
        energyLevel,
      };
      await saveJournal(data);
      setSaveMessage('Reflection saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      loadJournals();
    } catch (err) {
      console.error('Error saving journal', err);
      setSaveMessage('Error saving reflection.');
    } finally {
      setIsSaving(false);
    }
  };

  const moods = [
    { rating: 1, emoji: '😔', label: 'Drained' },
    { rating: 2, emoji: '😐', label: 'Neutral' },
    { rating: 3, emoji: '🙂', label: 'Balanced' },
    { rating: 4, emoji: '⚡', label: 'Productive' },
    { rating: 5, emoji: '🚀', label: 'Empowered' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-[#1e2638]">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-400" /> Daily Reflection & Mindset Journal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Reflect on daily achievements, express gratitude, and capture key takeaways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Reflection Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <h3 className="font-bold text-base text-white">Today's Log ({todayStr})</h3>
            {saveMessage && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {saveMessage}
              </span>
            )}
          </div>

          {/* Mood Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Mindset & Energy</label>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.rating}
                  onClick={() => {
                    setMood(m.rating);
                    setMoodLabel(m.label);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                    mood === m.rating
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-[#121723] border-[#1e2638] text-slate-400 hover:bg-[#182030]'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[11px] font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Focus Note */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Daily Focus / Mission Statement</label>
            <input
              type="text"
              value={focusNote}
              onChange={(e) => setFocusNote(e.target.value)}
              placeholder="e.g. Mastered React state management and published core feature"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Today's Wins */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Accomplishments / Wins Today
            </label>
            <input
              type="text"
              value={win1}
              onChange={(e) => setWin1(e.target.value)}
              placeholder="Win 1: Completed core API endpoints"
              className="w-full px-4 py-2 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              value={win2}
              onChange={(e) => setWin2(e.target.value)}
              placeholder="Win 2: Maintained 100% daily habit streak"
              className="w-full px-4 py-2 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Gratitude & Reflection Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Gratitude & Deep Reflection
            </label>
            <textarea
              rows="4"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn today? What are you grateful for?"
              className="w-full px-4 py-3 rounded-xl bg-[#0d121d] border border-[#1e2638] text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Daily Reflection'}
          </button>
        </form>

        {/* History Feed */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1e2638] pb-4">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-base text-white">Past Reflections</h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {journals.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No past journal logs found.</p>
            ) : (
              journals.map((j) => (
                <div key={j._id} className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{j.date}</span>
                    <span className="text-slate-400">{j.moodLabel}</span>
                  </div>
                  {j.focusNote && <p className="text-xs text-slate-300 font-medium">{j.focusNote}</p>}
                  {j.wins && j.wins.length > 0 && (
                    <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                      {j.wins.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
