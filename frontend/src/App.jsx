import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import TaskBoard from './components/TaskBoard';
import StudyLogger from './components/StudyLogger';
import CalendarView from './components/CalendarView';
import ReflectionJournal from './components/ReflectionJournal';
import ProductivityAnalytics from './components/ProductivityAnalytics';
import SettingsView from './components/SettingsView';
import NewHabitModal from './components/Modals/NewHabitModal';
import NewTaskModal from './components/Modals/NewTaskModal';
import LogStudyModal from './components/Modals/LogStudyModal';

import {
  fetchStats,
  fetchHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchStudySessions,
  createStudySession,
  deleteStudySession,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, habitsRes, tasksRes, studyRes] = await Promise.all([
        fetchStats().catch(() => null),
        fetchHabits().catch(() => ({ data: [] })),
        fetchTasks().catch(() => ({ data: [] })),
        fetchStudySessions().catch(() => ({ data: [] })),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (habitsRes?.data) setHabits(habitsRes.data);
      if (tasksRes?.data) setTasks(tasksRes.data);
      if (studyRes?.data) setStudySessions(studyRes.data);
    } catch (error) {
      console.error('Data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Habit Handlers
  const handleCreateHabit = async (habitData) => {
    try {
      await createHabit(habitData);
      loadAllData();
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  const handleToggleHabit = async (id, dateStr) => {
    try {
      await toggleHabit(id, dateStr);
      loadAllData();
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      loadAllData();
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  // Task Handlers
  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      loadAllData();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await updateTask(id, updates);
      loadAllData();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      loadAllData();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Study Session Handlers
  const handleCreateStudySession = async (sessionData) => {
    try {
      await createStudySession(sessionData);
      loadAllData();
    } catch (err) {
      console.error('Error creating study session:', err);
    }
  };

  const handleDeleteStudySession = async (id) => {
    try {
      await deleteStudySession(id);
      loadAllData();
    } catch (err) {
      console.error('Error deleting study session:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats?.summary} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar
          onOpenNewHabit={() => setIsHabitModalOpen(true)}
          onOpenNewTask={() => setIsTaskModalOpen(true)}
          isMongoConnected={stats?.isMongoDBConnected}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              habits={habits}
              tasks={tasks}
              studySessions={studySessions}
              onToggleHabit={handleToggleHabit}
              onOpenNewHabit={() => setIsHabitModalOpen(true)}
              onOpenNewTask={() => setIsTaskModalOpen(true)}
              onOpenLogStudy={() => setIsStudyModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'habits' && (
            <HabitTracker
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
              onOpenNewHabit={() => setIsHabitModalOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskBoard
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTask={() => setIsTaskModalOpen(true)}
            />
          )}

          {activeTab === 'study' && (
            <StudyLogger
              studySessions={studySessions}
              onCreateStudySession={handleCreateStudySession}
              onDeleteStudySession={handleDeleteStudySession}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              studySessions={studySessions}
              habits={habits}
            />
          )}

          {activeTab === 'journal' && <ReflectionJournal />}

          {activeTab === 'analytics' && (
            <ProductivityAnalytics stats={stats} habits={habits} tasks={tasks} />
          )}

          {activeTab === 'settings' && <SettingsView stats={stats} onReload={loadAllData} />}
        </main>
      </div>

      {/* Action Modals */}
      <NewHabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onCreate={handleCreateHabit}
      />
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={handleCreateTask}
      />
      <LogStudyModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        onCreate={handleCreateStudySession}
      />
    </div>
  );
}
