import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PieChart,
  FolderPlus,
  Search,
  Filter,
  Check
} from 'lucide-react';
import EditTaskModal from './Modals/EditTaskModal';

export default function TaskBoard({ tasks, onUpdateTask, onDeleteTask, onOpenNewTask }) {
  const [activeStatus, setActiveStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom categories list
  const [categories, setCategories] = useState(['All', 'Engineering', 'Backend', 'Frontend', 'Strategy', 'General']);
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // Editing task state
  const [editingTask, setEditingTask] = useState(null);

  // Completion calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Add custom category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const catClean = newCatInput.trim();
    if (!categories.includes(catClean)) {
      setCategories([...categories, catClean]);
    }
    setSelectedCategory(catClean);
    setNewCatInput('');
    setShowAddCat(false);
  };

  // Filter tasks
  let filtered = [...tasks];

  if (activeStatus !== 'all') {
    filtered = filtered.filter((t) => t.status === activeStatus);
  }

  if (selectedCategory !== 'All') {
    filtered = filtered.filter((t) => t.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }

  // Toggle mark completed
  const handleToggleComplete = (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    onUpdateTask(task._id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Completion Metric Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#1e2638] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckSquare className="w-3.5 h-3.5" /> Daily Task Manager
            </div>
            <h2 className="text-2xl font-black text-white">Daily Tasks & Quest Center</h2>
            <p className="text-xs text-slate-400 mt-1">
              Organize priorities, mark items complete, and sync everything with MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCat(!showAddCat)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#121723] hover:bg-[#1a2234] border border-[#1e2638] text-slate-200 transition-all"
            >
              <FolderPlus className="w-4 h-4 text-cyan-400" /> + Add Category
            </button>

            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Dynamic Category Creation Input (Collapsible) */}
        {showAddCat && (
          <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-[#0d121d] border border-cyan-500/30 flex items-center gap-3">
            <input
              type="text"
              required
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              placeholder="Enter new category name (e.g. Health, Work, Study)"
              className="flex-1 px-4 py-2 rounded-xl bg-[#121723] border border-[#1e2638] text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Save Category
            </button>
          </form>
        )}

        {/* Progress Bar & Completion Stats Header */}
        <div className="p-5 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Daily Task Completion Progress</span>
            </div>
            <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
              {completionPercentage}% Completed ({completedTasks} / {totalTasks} Tasks)
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-[#151c2c] rounded-full h-3.5 p-0.5 border border-[#1e2638] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-md shadow-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold pt-1 text-slate-400">
            <div className="p-2 rounded-xl bg-[#121723] border border-[#1e2638]">
              <span className="text-slate-300 font-bold">{todoTasks}</span> To Do
            </div>
            <div className="p-2 rounded-xl bg-[#121723] border border-[#1e2638]">
              <span className="text-blue-400 font-bold">{inProgressTasks}</span> In Progress
            </div>
            <div className="p-2 rounded-xl bg-[#121723] border border-[#1e2638]">
              <span className="text-emerald-400 font-bold">{completedTasks}</span> Completed
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or tag..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121723] border border-[#1e2638] text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-[#121723] p-1.5 rounded-2xl border border-[#1e2638] overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'todo', label: 'To Do' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-[#121723] text-slate-400 hover:text-slate-200 border border-[#1e2638]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-[#1e2638] text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No tasks found</h3>
          <p className="text-xs text-slate-400">Try selecting a different filter or create a new task.</p>
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`glass-panel p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between group ${
                    isDone 
                      ? 'border-emerald-500/30 bg-[#0d131f]/70' 
                      : 'border-[#1e2638] hover:border-blue-500/40 hover:bg-[#141b2b]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Checkbox Mark Completed + Title + Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Checkbox Toggle */}
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                              : 'border-2 border-slate-600 hover:border-emerald-400 text-transparent'
                          }`}
                          title={isDone ? 'Mark as To Do' : 'Mark as Completed'}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div>
                          <h3 className={`text-sm font-bold transition-all ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-blue-300'
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                      </div>

                      {/* Action Buttons: Edit & Delete */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                          title="Edit Task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 pl-9">
                        {task.description}
                      </p>
                    )}

                    {/* Tags & Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pl-9">
                      {/* Priority */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        task.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Category Badge */}
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {task.category || 'General'}
                      </span>

                      {/* Tags */}
                      {task.tags && task.tags.map((tg) => (
                        <span key={tg} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Quick Status Selector & Saved MongoDB indicator */}
                  <div className="flex items-center justify-between border-t border-[#1e2638] pt-3 text-[11px] mt-3 pl-9">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                      className="bg-[#0d121d] text-slate-300 text-xs rounded-lg px-2 py-1 border border-[#1e2638] focus:outline-none focus:border-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {isDone ? '✅ Completed' : task.status === 'in_progress' ? '⚡ In Progress' : '📌 To Do'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onUpdate={onUpdateTask}
      />
    </div>
  );
}
