import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, CheckCircle2, XCircle, Clock, 
  Calendar, AlertCircle, PlayCircle, BarChart3,
  TrendingUp, Activity, Award
} from 'lucide-react';
import { fetchReminderAnalytics, attendReminder } from '../services/api';

// Circular Progress Component
const ProgressRing = ({ radius, stroke, progress, colorClass, text }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#1e2638"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-black text-white">{progress}%</span>
        {text && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{text}</span>}
      </div>
    </div>
  );
};

export default function RemindersView({ reminders, onDeleteReminder, onOpenNewReminder }) {
  const [analytics, setAnalytics] = useState(null);
  const [attending, setAttending] = useState(false);

  const loadAnalytics = async () => {
    try {
      const res = await fetchReminderAnalytics();
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // Also set up an interval to refresh analytics periodically
    const interval = setInterval(loadAnalytics, 60000);
    return () => clearInterval(interval);
  }, [reminders]); // Refresh when reminders list updates

  const handleAttend = async (id) => {
    setAttending(true);
    try {
      await attendReminder(id);
      // App.jsx socket will catch 'reminder:attended' and reload data
    } catch (err) {
      console.error(err);
    } finally {
      setAttending(false);
    }
  };

  // Group reminders
  const activeReminders = reminders.filter(r => r.status === 'notified');
  const completedReminders = reminders.filter(r => r.status === 'attended');
  const missedReminders = reminders.filter(r => r.status === 'missed');
  const upcomingReminders = reminders.filter(r => r.status === 'idle');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Attendance System</h1>
          <p className="text-slate-400 text-sm mt-1">Smart scheduling with required check-ins.</p>
        </div>
        <button
          onClick={onOpenNewReminder}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] flex items-center justify-center gap-6 col-span-1 md:col-span-2">
            <ProgressRing radius={55} stroke={8} progress={analytics.attendancePct} colorClass="text-blue-500" text="Attendance" />
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Overall Consistency</h3>
              <p className="text-xs text-slate-400">Total Sessions: <b className="text-slate-200">{analytics.totalSessions}</b></p>
              <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> {analytics.attended}</span>
                <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5"/> {analytics.missed}</span>
              </div>
            </div>
          </div>
          <div className="glass-panel p-5 rounded-3xl border border-[#1e2638] flex flex-col justify-center">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Clock className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Avg Delay</span>
            </div>
            <span className="text-3xl font-black text-white">{analytics.avgDelay} <span className="text-sm text-slate-400">min</span></span>
          </div>
          <div className="glass-panel p-5 rounded-3xl border border-[#1e2638] flex flex-col justify-center">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <TrendingUp className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Current Streak</span>
            </div>
            <span className="text-3xl font-black text-white">{analytics.streak} <span className="text-sm text-slate-400">days</span></span>
          </div>
        </motion.div>
      )}

      {/* Active / Required Action */}
      <AnimatePresence>
        {activeReminders.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> ACTION REQUIRED — ATTENDANCE PENDING
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeReminders.map(rem => {
                const now = new Date();
                const [h, m] = rem.scheduledTime.split(':').map(Number);
                const scheduled = new Date();
                scheduled.setHours(h, m, 0, 0);
                const delay = Math.max(0, Math.round((now - scheduled) / 60000));
                
                return (
                  <div key={rem._id} className="relative overflow-hidden p-6 rounded-3xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/40 to-[#0a0d14] shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            DELAY: {delay} MIN
                          </span>
                          <span className="text-xs font-bold text-slate-400">Scheduled: {rem.scheduledTime}</span>
                        </div>
                        <h3 className="text-xl font-black text-white">{rem.subject}</h3>
                        <p className="text-sm text-slate-300 mt-1">{rem.topic}</p>
                      </div>
                      <button
                        disabled={attending}
                        onClick={() => handleAttend(rem._id)}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" /> I'm Present
                      </button>
                    </div>
                    {/* Pulsing background effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid for Upcoming & Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Today's Upcoming Schedule
          </h2>
          <div className="glass-panel p-2 rounded-3xl border border-[#1e2638]">
            {upcomingReminders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium text-sm">
                No upcoming sessions today.
              </div>
            ) : (
              <div className="divide-y divide-[#1e2638]">
                {upcomingReminders.map(rem => (
                  <div key={rem._id} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400">
                        <span className="text-[10px] font-bold uppercase">{rem.scheduledTime.split(' ')[0]}</span>
                        <span className="text-sm font-black">{rem.scheduledTime}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{rem.subject}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{rem.topic}</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteReminder(rem._id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History (Completed & Missed) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" /> Today's Log
          </h2>
          <div className="glass-panel p-4 rounded-3xl border border-[#1e2638] space-y-3">
            {[...completedReminders, ...missedReminders].length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-medium">
                No sessions completed or missed yet.
              </div>
            ) : (
              [...completedReminders, ...missedReminders].sort((a,b) => a.scheduledTime.localeCompare(b.scheduledTime)).map(rem => (
                <div key={rem._id} className={`p-3 rounded-2xl border flex items-center gap-3 ${
                  rem.status === 'attended' 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-red-500/5 border-red-500/20'
                }`}>
                  {rem.status === 'attended' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{rem.subject}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{rem.scheduledTime}</span>
                      {rem.status === 'attended' && rem.attendanceDelayMinutes > 0 && (
                        <span className="text-amber-500/70 font-bold">+{rem.attendanceDelayMinutes}m delay</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
