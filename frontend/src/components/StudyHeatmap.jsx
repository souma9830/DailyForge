import React, { useState } from 'react';
import { Flame, Calendar, Info, Award } from 'lucide-react';

export default function StudyHeatmap({ studySessions = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Map study hours by YYYY-MM-DD date string
  const studyHoursMap = {};
  const sessionCountMap = {};

  studySessions.forEach((s) => {
    const dStr = s.date || (s.createdAt ? s.createdAt.split('T')[0] : null);
    if (dStr) {
      const mins = Number(s.durationMinutes) || 0;
      studyHoursMap[dStr] = (studyHoursMap[dStr] || 0) + mins / 60;
      sessionCountMap[dStr] = (sessionCountMap[dStr] || 0) + 1;
    }
  });

  // Generate 365 days for the past year ending today
  const days = [];
  const today = new Date();
  
  // Go back 364 days so we have 365 total days (~52 weeks)
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hours = studyHoursMap[dateStr] || 0;
    const sessionCount = sessionCountMap[dateStr] || 0;
    days.push({
      dateStr,
      date: d,
      hours: Number(hours.toFixed(1)),
      sessionCount,
      dayOfWeek: d.getDay(), // 0 = Sun
      month: d.toLocaleString('default', { month: 'short' }),
    });
  }

  // Determine color scale intensity (GitHub green/cyan dark theme scale)
  const getCellColor = (hours) => {
    if (hours === 0) return 'bg-[#121723] border-[#1e2638]';
    if (hours < 2) return 'bg-cyan-950 border-cyan-800/50 text-cyan-200';
    if (hours < 4) return 'bg-cyan-700 border-cyan-600 text-cyan-100 shadow-sm shadow-cyan-700/20';
    if (hours < 6) return 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/30';
    return 'bg-emerald-400 border-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-400/40 animate-pulse';
  };

  // Group days by 52 columns (weeks)
  const weeks = [];
  let currentWeek = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (day.dayOfWeek === 6 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Month labels across the top
  const monthLabels = [];
  let lastMonth = '';
  weeks.forEach((week, wIdx) => {
    const firstDayOfWeek = week[0];
    if (firstDayOfWeek && firstDayOfWeek.month !== lastMonth) {
      monthLabels.push({ name: firstDayOfWeek.month, index: wIdx });
      lastMonth = firstDayOfWeek.month;
    }
  });

  // Total active study days
  const activeDaysCount = Object.keys(studyHoursMap).filter((d) => studyHoursMap[d] > 0).length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2638] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" /> GitHub Contribution Heatmap
          </div>
          <h3 className="text-xl font-black text-white">Annual Study Contribution Grid</h3>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing 365 days of study consistency fetched live from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0d121d] border border-[#1e2638] text-xs font-bold text-slate-300">
            🔥 <span className="text-cyan-400">{activeDaysCount}</span> Active Days Logged
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="min-w-[750px] space-y-2">
          {/* Month Header Row */}
          <div className="flex text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-7">
            {weeks.map((_, wIdx) => {
              const label = monthLabels.find((m) => m.index === wIdx);
              return (
                <div key={wIdx} className="w-3.5 text-center flex-shrink-0">
                  {label ? label.name : ''}
                </div>
              );
            })}
          </div>

          {/* Grid Rows (Days of Week) */}
          <div className="flex gap-1">
            {/* Day of Week Labels Column */}
            <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-500 pr-2 py-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 rounded-[3px] border transition-all cursor-pointer hover:scale-125 hover:z-10 ${getCellColor(
                        day.hours
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Hover Tooltip Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t border-[#1e2638]">
        {/* Tooltip text */}
        <div className="text-slate-300 font-medium h-5 flex items-center">
          {hoveredDay ? (
            <span>
              <strong className="text-cyan-400">{hoveredDay.hours} hrs</strong> study logged on{' '}
              <span className="font-bold text-white">{hoveredDay.dateStr}</span> ({hoveredDay.sessionCount} sessions)
            </span>
          ) : (
            <span className="text-slate-500 italic">Hover over any square to view study hours for that day</span>
          )}
        </div>

        {/* GitHub Color Intensity Scale Legend */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[3px] bg-[#121723] border border-[#1e2638]" title="0 hrs" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-950 border border-cyan-800/50" title="< 2 hrs" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-700 border border-cyan-600" title="2-4 hrs" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-500 border border-cyan-400" title="4-6 hrs" />
          <div className="w-3 h-3 rounded-[3px] bg-emerald-400 border border-emerald-300" title="6+ hrs" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
