import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';
import StudyHeatmap from './StudyHeatmap';

export default function ProductivityAnalytics({ stats, habits = [], tasks = [], studySessions = [] }) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Colors palette for Pie chart
  const PIE_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

  // 1. Total Completed Tasks
  const totalCompletedTasks = tasks.filter((t) => t.status === 'completed').length;

  // 2. Total Study Time (Overall in Hours)
  const overallStudyMinutes = studySessions.reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const totalStudyTimeHours = (overallStudyMinutes / 60).toFixed(1);

  // 3. Daily Study Hours (Today)
  const todayStudyMinutes = studySessions
    .filter((s) => s.date === todayStr || (s.createdAt && s.createdAt.startsWith(todayStr)))
    .reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const dailyStudyHours = (todayStudyMinutes / 60).toFixed(1);

  // 4. Weekly Study Hours (Last 7 Days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const weeklyStudyMinutes = studySessions
    .filter((s) => {
      const sDate = s.date ? new Date(s.date) : new Date(s.createdAt);
      return sDate >= sevenDaysAgo;
    })
    .reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const weeklyStudyHours = (weeklyStudyMinutes / 60).toFixed(1);

  // 5. Monthly Study Hours (Last 30 Days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  const monthlyStudyMinutes = studySessions
    .filter((s) => {
      const sDate = s.date ? new Date(s.date) : new Date(s.createdAt);
      return sDate >= thirtyDaysAgo;
    })
    .reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);
  const monthlyStudyHours = (monthlyStudyMinutes / 60).toFixed(1);

  // Daily Study Hours Chart Dataset (Last 7 Days)
  const dailyStudyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayMins = studySessions
      .filter((s) => s.date === dStr || (s.createdAt && s.createdAt.startsWith(dStr)))
      .reduce((acc, curr) => acc + (Number(curr.durationMinutes) || 0), 0);

    return {
      day: dayLabel,
      date: dStr,
      studyHours: Number((dayMins / 60).toFixed(1)),
    };
  });

  // Subject-Wise Pie Chart Dataset
  const subjectMap = {};
  studySessions.forEach((s) => {
    const subj = s.subject || 'General Study';
    subjectMap[subj] = (subjectMap[subj] || 0) + (Number(s.durationMinutes) || 0);
  });

  const subjectPieData = Object.keys(subjectMap).map((subj) => ({
    name: subj,
    value: Number((subjectMap[subj] / 60).toFixed(1)),
    minutes: subjectMap[subj],
  }));

  // Fallback if study sessions empty
  const pieDisplayData = subjectPieData.length > 0 ? subjectPieData : [
    { name: 'Computer Science', value: 4.5 },
    { name: 'Mathematics', value: 2.5 },
    { name: 'Engineering', value: 3.0 },
    { name: 'Web Dev', value: 2.0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Metrics Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Recharts Productivity Engine
          </div>
          <h2 className="text-2xl font-black text-white">Productivity & Study Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual graphs of daily focus hours, weekly/monthly trends, GitHub heatmap, and subject distribution from MongoDB.
          </p>
        </div>

        {/* 6 Top Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Daily Study Hours */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Daily Study</span>
            <div className="text-xl font-black text-cyan-400">{dailyStudyHours} <span className="text-xs font-normal">hrs</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Logged Today</p>
          </div>

          {/* Weekly Study Hours */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Weekly Study</span>
            <div className="text-xl font-black text-blue-400">{weeklyStudyHours} <span className="text-xs font-normal">hrs</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Last 7 Days</p>
          </div>

          {/* Monthly Study Hours */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Monthly Study</span>
            <div className="text-xl font-black text-purple-400">{monthlyStudyHours} <span className="text-xs font-normal">hrs</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Last 30 Days</p>
          </div>

          {/* Total Study Time */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Study</span>
            <div className="text-xl font-black text-amber-400">{totalStudyTimeHours} <span className="text-xs font-normal">hrs</span></div>
            <p className="text-[10px] text-slate-500 font-medium">All Time Focus</p>
          </div>

          {/* Total Completed Tasks */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Completed Tasks</span>
            <div className="text-xl font-black text-emerald-400">{totalCompletedTasks} <span className="text-xs font-normal">tasks</span></div>
            <p className="text-[10px] text-slate-500 font-medium">Quests Finished</p>
          </div>

          {/* Total Study Sessions */}
          <div className="p-4 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Study Sessions</span>
            <div className="text-xl font-black text-rose-400">{studySessions.length} <span className="text-xs font-normal">logs</span></div>
            <p className="text-[10px] text-slate-500 font-medium">MongoDB Records</p>
          </div>
        </div>
      </div>

      {/* GitHub Style Contribution Heatmap */}
      <StudyHeatmap studySessions={studySessions} />

      {/* Main Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Study Hours Trend Chart (Recharts BarChart) */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-white">Daily Study Hours (Last 7 Days)</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Hours / Day</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStudyData}>
                <Bar dataKey="studyHours" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121723', borderColor: '#1e2638', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject-Wise Pie Chart (Recharts PieChart) */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">Subject-Wise Study Distribution</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Total Hours Share</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDisplayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieDisplayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#121723', borderColor: '#1e2638', borderRadius: '12px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
