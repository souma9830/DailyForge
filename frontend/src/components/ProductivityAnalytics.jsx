import React from 'react';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export default function ProductivityAnalytics({ stats, habits, tasks }) {
  // Generate habit completion dataset for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    let completedCount = 0;
    habits.forEach((h) => {
      if (h.completedDates?.includes(dateStr)) completedCount++;
    });

    return {
      day: dayName,
      date: dateStr,
      completedHabits: completedCount,
      totalHabits: habits.length || 1,
    };
  });

  // Data by category
  const taskCategoryMap = {};
  tasks.forEach((t) => {
    taskCategoryMap[t.category] = (taskCategoryMap[t.category] || 0) + 1;
  });

  const categoryData = Object.keys(taskCategoryMap).map((cat) => ({
    category: cat,
    count: taskCategoryMap[cat],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-[#1e2638]">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" /> Productivity Analytics & Trends
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Visual insights into habit consistency, task distribution, and performance metrics.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Habit Completion Trend */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> 7-Day Habit Completion
            </h3>
            <span className="text-xs text-slate-400">Habits Logged</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121723', borderColor: '#1e2638', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="completedHabits" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Category Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" /> Task Category Breakdown
            </h3>
            <span className="text-xs text-slate-400">Total Quests</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.length ? categoryData : [{ category: 'General', count: 1 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121723', borderColor: '#1e2638', borderRadius: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
