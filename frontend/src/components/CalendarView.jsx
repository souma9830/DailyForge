import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  X, 
  Flame,
  Sparkles,
  Info
} from 'lucide-react';

export default function CalendarView({ tasks = [], studySessions = [], habits = [], events = [], onAddEvent, onDeleteEvent }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Build grid calendar days
  const calendarCells = [];
  // Empty padding cells for previous month days
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, dateStr: dStr });
  }

  // Get data for a specific date string (YYYY-MM-DD)
  const getDataForDate = (dateStr) => {
    // Completed tasks on this date (by completedAt or createdAt)
    const dayTasks = tasks.filter((t) => {
      if (t.status !== 'completed') return false;
      if (t.completedAt) return t.completedAt.startsWith(dateStr);
      if (t.updatedAt) return t.updatedAt.startsWith(dateStr);
      return false;
    });

    // Study sessions on this date
    const dayStudy = studySessions.filter((s) => s.date === dateStr || (s.createdAt && s.createdAt.startsWith(dateStr)));

    // Total study duration in minutes & hours
    const studyMins = dayStudy.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
    const studyHours = (studyMins / 60).toFixed(1);

    // Completed habits on this date
    const dayHabits = habits.filter((h) => h.completedDates?.includes(dateStr));

    // Events scheduled on this date
    const dayEvents = events.filter((e) => e.date === dateStr);

    return {
      tasks: dayTasks,
      studySessions: dayStudy,
      studyMins,
      studyHours,
      habits: dayHabits,
      events: dayEvents,
    };
  };

  // Selected date data
  const selectedData = getDataForDate(selectedDateStr);

  const handleDateClick = (dateStr) => {
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & Controls */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5" /> Interactive Calendar Hub
          </div>
          <h2 className="text-2xl font-black text-white">Daily Productivity Calendar</h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any date to inspect completed tasks, study topics, and total focus hours fetched from MongoDB.
          </p>
        </div>

        {/* Month Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#121723] hover:bg-[#1a2234] border border-[#1e2638] text-slate-200 transition-all"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-[#121723] p-1 rounded-2xl border border-[#1e2638]">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1f293d] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-white px-3 min-w-[130px] text-center">
              {monthName} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1f293d] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Grid & Selected Day Quick Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          {/* Day Names Row */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-[#1e2638]">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-24 rounded-2xl bg-[#090d15]/40 border border-transparent" />;
              }

              const data = getDataForDate(cell.dateStr);
              const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
              const isSelected = cell.dateStr === selectedDateStr;
              const hasActivity = data.tasks.length > 0 || data.studySessions.length > 0;

              return (
                <motion.div
                  key={cell.dateStr}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDateClick(cell.dateStr)}
                  className={`h-24 p-2.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/20'
                      : isToday
                      ? 'border-cyan-500/60 bg-[#0d1525]'
                      : 'border-[#1e2638] bg-[#0d121d] hover:bg-[#141b2b]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold rounded-lg px-2 py-0.5 ${
                      isToday ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-200'
                    }`}>
                      {cell.day}
                    </span>

                    {hasActivity && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  {/* Day Summary Micro Badges */}
                  <div className="space-y-1">
                    {data.events.length > 0 && (
                      <div className="text-[10px] font-bold text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded-md truncate border border-purple-500/20">
                        📅 {data.events.length} event(s)
                      </div>
                    )}
                    {Number(data.studyHours) > 0 && (
                      <div className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded-md truncate border border-cyan-500/20">
                        📚 {data.studyHours}h study
                      </div>
                    )}
                    {data.tasks.length > 0 && (
                      <div className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded-md truncate border border-emerald-500/20">
                        ✅ {data.tasks.length} tasks
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side Panel: Selected Date Overview */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-6">
          <div className="border-b border-[#1e2638] pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Details</span>
            <h3 className="text-xl font-black text-white mt-1">{selectedDateStr}</h3>
            <p className="text-xs text-cyan-400 font-semibold mt-0.5">MongoDB Activity Summary</p>
          </div>

          {/* Quick Stats Cards for Selected Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Study Hours</span>
              <div className="text-xl font-black text-cyan-400 mt-1 flex items-baseline gap-1">
                {selectedData.studyHours} <span className="text-xs font-semibold text-slate-400">hrs</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tasks Done</span>
              <div className="text-xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
                {selectedData.tasks.length} <span className="text-xs font-semibold text-slate-400">tasks</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Events</span>
              <div className="text-xl font-black text-purple-400 mt-1 flex items-baseline gap-1">
                {selectedData.events.length} <span className="text-xs font-semibold text-slate-400">evts</span>
              </div>
            </div>
          </div>

          {/* Study Topics List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Study Topics Logged ({selectedData.studySessions.length})
            </h4>

            {selectedData.studySessions.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#0d121d]">No study sessions recorded on this date.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedData.studySessions.map((session) => (
                  <div key={session._id} className="p-3 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{session.subject}</span>
                      <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded text-[10px]">
                        {session.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-medium">{session.topic}</p>
                    {session.notes && <p className="text-slate-400 text-[10px] italic">{session.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tasks Completed ({selectedData.tasks.length})
            </h4>

            {selectedData.tasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#0d121d]">No completed tasks recorded on this date.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedData.tasks.map((task) => (
                  <div key={task._id} className="p-3 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-200">{task.title}</h5>
                      <span className="text-[10px] text-slate-400">{task.category}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Inspector Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#121723] border border-[#1e2638] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
                <div className="flex items-center gap-2.5">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Date Inspection: {selectedDateStr}</h3>
                    <p className="text-xs text-slate-400">Fetched from MongoDB collections</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Stats Row */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Study</span>
                  <div className="text-lg font-black text-cyan-400 mt-1">{selectedData.studyHours}h</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tasks</span>
                  <div className="text-lg font-black text-emerald-400 mt-1">{selectedData.tasks.length}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Habits</span>
                  <div className="text-lg font-black text-amber-400 mt-1">{selectedData.habits.length}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0d121d] border border-[#1e2638]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Events</span>
                  <div className="text-lg font-black text-purple-400 mt-1">{selectedData.events.length}</div>
                </div>
              </div>

              {/* Scheduled Events */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-purple-400" /> Scheduled Events
                  </h4>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onAddEvent(selectedDateStr);
                    }}
                    className="text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded"
                  >
                    + Add Event
                  </button>
                </div>
                
                {selectedData.events.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#0d121d]">No events scheduled for this day.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedData.events.map((ev) => (
                      <div key={ev._id} className="p-3 rounded-xl bg-[#0d121d] border border-purple-500/20 text-xs">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{ev.title}</span>
                          <span className="text-purple-300 font-bold">{ev.time}</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{ev.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Reminder: {ev.notifyBeforeMinutes}m before
                          </span>
                          <button onClick={() => onDeleteEvent(ev._id)} className="text-red-400 hover:text-red-300 p-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Study Topics */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Study Topics Logged
                </h4>
                {selectedData.studySessions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#0d121d]">No study sessions logged for this day.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedData.studySessions.map((session) => (
                      <div key={session._id} className="p-3 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{session.subject}</span>
                          <span className="text-cyan-300 font-bold">{session.durationMinutes} min ({session.difficulty || 'Medium'})</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{session.topic}</p>
                        {session.notes && <p className="text-slate-400 text-[11px] mt-1 italic">{session.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks Completed */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tasks Completed
                </h4>
                {selectedData.tasks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#0d121d]">No tasks completed on this day.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedData.tasks.map((task) => (
                      <div key={task._id} className="p-3 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs flex items-center justify-between">
                        <span className="font-bold text-white">{task.title}</span>
                        <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
