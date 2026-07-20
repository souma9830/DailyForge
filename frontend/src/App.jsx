import React, { useState, useEffect, useCallback } from 'react';
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
import ToastContainer from './components/ToastContainer';

import NewHabitModal from './components/Modals/NewHabitModal';
import NewTaskModal from './components/Modals/NewTaskModal';
import LogStudyModal from './components/Modals/LogStudyModal';
import NewGoalModal from './components/Modals/NewGoalModal';
import NewReminderModal from './components/Modals/NewReminderModal';
import ExportDataModal from './components/ExportDataModal';

import { useToast } from './hooks/useToast';

import {
  fetchStats,
  fetchHabits, createHabit, toggleHabit, deleteHabit,
  fetchTasks, createTask, updateTask, deleteTask,
  fetchStudySessions, createStudySession, deleteStudySession,
  fetchGoals, createGoal, updateGoal, deleteGoal,
  fetchReminders, createReminder, toggleReminder, deleteReminder,
  fetchSettings, updateSettings,
} from './services/api';

export default function App() {
  const { toasts, addToast, removeToast } = useToast();

  // ── Page State ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Data State ──────────────────────────────────────────────────────────────
  const [stats, setStats] = useState({});
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const isMongoConnected = stats?.isMongoDBConnected === true;

  // ── Data Loading ─────────────────────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, habitsRes, tasksRes, studyRes, goalsRes, remRes, settingsRes] =
        await Promise.allSettled([
          fetchStats(),
          fetchHabits(),
          fetchTasks(),
          fetchStudySessions(),
          fetchGoals(),
          fetchReminders(),
          fetchSettings(),
        ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data ?? {});
      if (habitsRes.status === 'fulfilled') setHabits(habitsRes.value.data?.data ?? []);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value.data?.data ?? []);
      if (studyRes.status === 'fulfilled') setStudySessions(studyRes.value.data?.data ?? []);
      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value.data?.data ?? []);
      if (remRes.status === 'fulfilled') setReminders(remRes.value.data?.data ?? []);
      if (settingsRes.status === 'fulfilled') {
        const s = settingsRes.value.data?.data;
        if (s?.username) setUsername(s.username);
      }

      // Notify if backend is unreachable
      if (statsRes.status === 'rejected') {
        addToast('Could not reach DailyForge backend. Is the server running?', 'warning');
      }
    } catch (error) {
      addToast('Unexpected error loading data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // ── Background Notification Scheduler ────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5);
      reminders.forEach((rem) => {
        if (rem.isActive && rem.time === currentHHMM) {
          new Notification(`🔔 DailyForge: ${rem.title}`, {
            body: `Scheduled alert – ${rem.category} at ${rem.time}`,
            icon: '/favicon.ico',
          });
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [reminders]);

  // ── Generic reload-after-mutation helper ─────────────────────────────────────
  const withReload = (asyncFn, successMsg) => async (...args) => {
    try {
      await asyncFn(...args);
      await loadAllData();
      if (successMsg) addToast(successMsg, 'success');
    } catch (err) {
      addToast(err?.response?.data?.message || err.message || 'Action failed', 'error');
    }
  };

  // ── Habit Handlers ────────────────────────────────────────────────────────────
  const handleCreateHabit     = withReload((d) => createHabit(d), 'Habit created & saved to MongoDB ✅');
  const handleToggleHabit     = withReload((id, ds) => toggleHabit(id, ds));
  const handleDeleteHabit     = withReload((id) => deleteHabit(id), 'Habit deleted');

  // ── Task Handlers ─────────────────────────────────────────────────────────────
  const handleCreateTask      = withReload((d) => createTask(d), 'Task saved to MongoDB ✅');
  const handleUpdateTask      = withReload((id, u) => updateTask(id, u));
  const handleDeleteTask      = withReload((id) => deleteTask(id), 'Task deleted');

  // ── Study Handlers ────────────────────────────────────────────────────────────
  const handleCreateStudy     = withReload((d) => createStudySession(d), 'Study session saved to MongoDB ✅');
  const handleDeleteStudy     = withReload((id) => deleteStudySession(id), 'Session deleted');

  // ── Goal Handlers ─────────────────────────────────────────────────────────────
  const handleCreateGoal      = withReload((d) => createGoal(d), 'Goal saved to MongoDB ✅');
  const handleUpdateGoal      = withReload((id, u) => updateGoal(id, u));
  const handleDeleteGoal      = withReload((id) => deleteGoal(id), 'Goal deleted');

  // ── Reminder Handlers ─────────────────────────────────────────────────────────
  const handleCreateReminder  = withReload((d) => createReminder(d), 'Reminder saved to MongoDB ✅');
  const handleToggleReminder  = withReload((id) => toggleReminder(id));
  const handleDeleteReminder  = withReload((id) => deleteReminder(id), 'Reminder deleted');

  return (
    <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats?.summary}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* MongoDB Disconnected Warning Banner */}
        {!loading && !isMongoConnected && (
          <div className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold">
            <span>⚠️</span>
            <span>
              MongoDB Atlas not connected – running in memory-only mode. Data will reset on server restart.
              Check your <code className="bg-amber-900/40 px-1 rounded">.env</code> connection string.
            </span>
          </div>
        )}

        {!loading && isMongoConnected && (
          <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            MongoDB Atlas Connected — all data is being saved permanently
          </div>
        )}

        <Navbar
          onOpenNewHabit={() => setIsHabitModalOpen(true)}
          onOpenNewTask={() => setIsTaskModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          isMongoConnected={isMongoConnected}
          onToggleMobileNav={() => setIsOpenMobile(!isOpenMobile)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-semibold">Connecting to MongoDB Atlas…</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  stats={stats}
                  habits={habits}
                  tasks={tasks}
                  studySessions={studySessions}
                  username={username}
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
                  onCreateStudySession={handleCreateStudy}
                  onDeleteStudySession={handleDeleteStudy}
                />
              )}
              {activeTab === 'calendar' && (
                <CalendarView tasks={tasks} studySessions={studySessions} habits={habits} />
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
              {activeTab === 'journal' && <ReflectionJournal addToast={addToast} />}
              {activeTab === 'analytics' && (
                <ProductivityAnalytics
                  stats={stats}
                  habits={habits}
                  tasks={tasks}
                  studySessions={studySessions}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsView
                  stats={stats}
                  onReload={loadAllData}
                  addToast={addToast}
                  onUsernameChange={setUsername}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
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
        onCreate={handleCreateStudy}
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

      {/* ── Global Toast Notifications ────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
