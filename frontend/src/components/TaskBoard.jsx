import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Tag, 
  Calendar, 
  Clock, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TaskBoard({ tasks, onUpdateTask, onDeleteTask, onOpenNewTask }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Engineering', 'Backend', 'Frontend', 'Strategy', 'General'];

  // Filter tasks
  let filtered = [...tasks];
  if (activeFilter !== 'all') {
    filtered = filtered.filter((t) => t.status === activeFilter);
  }
  if (selectedCategory !== 'All') {
    filtered = filtered.filter((t) => t.category === selectedCategory);
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-slate-600', badge: 'bg-slate-500/20 text-slate-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500', badge: 'bg-blue-500/20 text-blue-300' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-[#1e2638]">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-400" /> Task & Quest Board
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize priorities, manage task execution states, and track progress.
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Task
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2 bg-[#121723] p-1.5 rounded-2xl border border-[#1e2638]">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-white'
                  : 'bg-[#121723] text-slate-400 hover:text-slate-200 border border-[#1e2638]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="glass-panel p-5 rounded-3xl border border-[#1e2638] space-y-4 flex flex-col min-h-[450px]">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${col.color}`} />
                  <h3 className="font-bold text-sm text-slate-200">{col.title}</h3>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.badge}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs italic">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 rounded-2xl bg-[#121723] border border-[#1e2638] hover:border-blue-500/40 space-y-3 transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                          {task.title}
                        </h4>
                        <button
                          onClick={() => onDeleteTask(task._id)}
                          className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                      )}

                      {/* Tags & Priority */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' :
                          task.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {task.priority}
                        </span>

                        <span className="text-[10px] text-slate-400 bg-[#171e2e] px-2 py-0.5 rounded-md border border-[#232c3f]">
                          {task.category}
                        </span>

                        {task.tags && task.tags.map((tg) => (
                          <span key={tg} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            #{tg}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Quick State Transition Selector */}
                      <div className="flex items-center justify-between border-t border-[#1e2638] pt-3 text-[11px]">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                          className="bg-[#0d121d] text-slate-300 text-xs rounded-lg px-2 py-1 border border-[#1e2638] focus:outline-none focus:border-blue-500"
                        >
                          <option value="todo">Move to To Do</option>
                          <option value="in_progress">Move to In Progress</option>
                          <option value="completed">Move to Completed</option>
                        </select>

                        {task.completedAt && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
