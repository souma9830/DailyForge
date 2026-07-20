import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import TaskBoard from './components/TaskBoard';
import StudyLogger from './components/StudyLogger';
import CalendarView from './components/CalendarView';
import GoalsView from './components/GoalsView';
import RemindersView from './components/RemindersView';
import AchievementsView from './components/AchievementsView';
import ReflectionJournal from './components/ReflectionJournal';
import ProductivityAnalytics from './components/ProductivityAnalytics';
import SettingsView from './components/SettingsView';

import NewHabitModal from './components/Modals/NewHabitModal';
import NewTaskModal from './components/Modals/NewTaskModal';
import LogStudyModal from './components/Modals/LogStudyModal';
import NewGoalModal from './components/Modals/NewGoalModal';
import NewReminderModal from './components/Modals/NewReminderModal';
import ExportDataModal from './components/ExportDataModal';

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
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  fetchReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  // Global Scheduled Browser Notification Check (runs every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5); // "HH:mm"

      reminders.forEach((rem) => {
        if (rem.isActive && rem.time === currentHHMM) {
          // Trigger browser notification
          new Notification(`🔔 DailyForge Reminder: ${rem.title}`, {
            body: `Scheduled alert for ${rem.category} at ${rem.time}`,
            icon: '/favicon.ico',
          });
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [reminders]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, habitsRes, tasksRes, studyRes, goalsRes, remRes] = await Promise.all([
        fetchStats().catch(() => null),
        fetchHabits().catch(() => ({ data: [] })),
        fetchTasks().catch(() => ({ data: [] })),
        fetchStudySessions().catch(() => ({ data: [] })),
        fetchGoals().catch(() => ({ data: [] })),
        fetchReminders().catch(() => ({ data: [] })),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (habitsRes?.data) setHabits(habitsRes.data);
      if (tasksRes?.data) setTasks(tasksRes.data);
      if (studyRes?.data) setStudySessions(studyRes.data);
      if (goalsRes?.data) setGoals(goalsRes.data);
      if (remRes?.data) setReminders(remRes.data);
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

  // Goal Handlers
  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      loadAllData();
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  };

  const handleUpdateGoal = async (id, updates) => {
    try {
      await updateGoal(id, updates);
      loadAllData();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      loadAllData();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  // Reminder Handlers
  const handleCreateReminder = async (reminderData) => {
    try {
      await createReminder(reminderData);
      loadAllData();
    } catch (err) {
      console.error('Error creating reminder:', err);
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      await toggleReminder(id);
      loadAllData();
    } catch (err) {
      console.error('Error toggling reminder:', err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id);
      loadAllData();
    } catch (err) {
      console.error('Error deleting reminder:', err);
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
          onOpenExport={() => setIsExportModalOpen(true)}
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
              onOpenExport={() => setIsExportModalOpen(true)}
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

          {activeTab === 'goals' && (
            <GoalsView
              goals={goals}
              onCreateGoal={handleCreateGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onOpenNewGoal={() => setIsGoalModalOpen(true)}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              onCreateReminder={handleCreateReminder}
              onToggleReminder={handleToggleReminder}
              onDeleteReminder={handleDeleteReminder}
              onOpenNewReminder={() => setIsReminderModalOpen(true)}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              studySessions={studySessions}
              habits={habits}
              tasks={tasks}
              goals={goals}
            />
          )}

          {activeTab === 'journal' && <ReflectionJournal />}

          {activeTab === 'analytics' && (
            <ProductivityAnalytics stats={stats} habits={habits} tasks={tasks} studySessions={studySessions} />
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
      <NewGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onCreate={handleCreateGoal}
      />
      <NewReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onCreate={handleCreateReminder}
      />
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        studySessions={studySessions}
        tasks={tasks}
        habits={habits}
      />
    </div>
  );
}
