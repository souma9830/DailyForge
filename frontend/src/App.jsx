import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
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
import NewEventModal from './components/Modals/NewEventModal';
import ExportDataModal from './components/ExportDataModal';

import { useToast } from './hooks/useToast';

import {
  fetchStats,
  fetchHabits, createHabit, toggleHabit, deleteHabit,
  fetchTasks, createTask, updateTask, deleteTask,
  fetchStudySessions, createStudySession, deleteStudySession,
  fetchGoals, createGoal, updateGoal, deleteGoal,
  fetchReminders, createReminder, toggleReminder, deleteReminder,
  fetchEvents, createEvent, deleteEvent,
  fetchSettings, updateSettings,
} from './services/api';

// ── Show Notification via Service Worker ──────────────────────────────────────
function showNotificationSW(payload) {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then((reg) => {
    if (reg.active) {
      reg.active.postMessage({ type: 'SHOW_NOTIFICATION', ...payload });
    }
  });
}

// ── Request notification permission & return boolean ─────────────────────────
async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

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
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({ username: '', dailyStudyGoal: 6, notificationTime: '20:00', theme: 'dark' });
  const [loading, setLoading] = useState(true);

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState('');

  const isMongoConnected = stats?.isMongoDBConnected === true;

  // ── Data Loading ─────────────────────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, habitsRes, tasksRes, studyRes, goalsRes, remRes, evRes, settingsRes] =
        await Promise.allSettled([
          fetchStats(),
          fetchHabits(),
          fetchTasks(),
          fetchStudySessions(),
          fetchGoals(),
          fetchReminders(),
          fetchEvents(),
          fetchSettings(),
        ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data ?? {});
      if (habitsRes.status === 'fulfilled') setHabits(habitsRes.value.data?.data ?? []);
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value.data?.data ?? []);
      if (studyRes.status === 'fulfilled') setStudySessions(studyRes.value.data?.data ?? []);
      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value.data?.data ?? []);
      if (remRes.status === 'fulfilled') {
        const rems = remRes.value.data?.data ?? [];
        setReminders(rems);
      }
      if (evRes.status === 'fulfilled') setEvents(evRes.value.data?.data ?? []);
      if (settingsRes.status === 'fulfilled') {
        const s = settingsRes.value.data?.data;
        if (s) setSettings(s);
      }

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

  // ── Request notification permission on first load ─────────────────────────
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ── Socket.io Setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend');
    });

    socket.on('reminder:notify', (payload) => {
      showNotificationSW({
        title: payload.title,
        body: payload.body,
        tag: `rem-${payload.reminderId}`,
        data: payload
      });
      addToast(`🔔 ${payload.title} — ${payload.body}`, 'warning');
      loadAllData();
    });

    socket.on('reminder:missed', () => loadAllData());
    socket.on('reminder:attended', () => loadAllData());

    return () => socket.disconnect();
  }, [addToast, loadAllData]);

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
  const handleCreateHabit    = withReload((d) => createHabit(d), 'Habit created ✅');
  const handleToggleHabit    = withReload((id, ds) => toggleHabit(id, ds));
  const handleDeleteHabit    = withReload((id) => deleteHabit(id), 'Habit deleted');

  // ── Task Handlers ─────────────────────────────────────────────────────────────
  const handleCreateTask     = withReload((d) => createTask(d), 'Task saved ✅');
  const handleUpdateTask     = withReload((id, u) => updateTask(id, u));
  const handleDeleteTask     = withReload((id) => deleteTask(id), 'Task deleted');

  // ── Study Handlers ────────────────────────────────────────────────────────────
  const handleCreateStudy    = withReload((d) => createStudySession(d), 'Study session saved ✅');
  const handleDeleteStudy    = withReload((id) => deleteStudySession(id), 'Session deleted');

  // ── Goal Handlers ─────────────────────────────────────────────────────────────
  const handleCreateGoal     = withReload((d) => createGoal(d), 'Goal saved ✅');
  const handleUpdateGoal     = withReload((id, u) => updateGoal(id, u));
  const handleDeleteGoal     = withReload((id) => deleteGoal(id), 'Goal deleted');

  // ── Reminder Handlers ─────────────────────────────────────────────────────────
  const handleCreateReminder = withReload((d) => createReminder(d), 'Reminder saved ✅');
  const handleToggleReminder = withReload((id) => toggleReminder(id));
  const handleDeleteReminder = withReload((id) => deleteReminder(id), 'Reminder deleted');

  // ── Event Handlers ────────────────────────────────────────────────────────────
  const handleCreateEvent    = withReload((d) => createEvent(d), 'Event scheduled & Email set ✅');
  const handleDeleteEvent    = withReload((id) => deleteEvent(id), 'Event deleted');

  return (
    <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats?.summary}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">

        {/* MongoDB Connection Banner */}
        {!loading && !isMongoConnected && (
          <div className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold">
            <span>⚠️</span>
            <span>MongoDB Atlas not connected – data won't persist. Check your <code className="bg-amber-900/40 px-1 rounded">.env</code> URI.</span>
          </div>
        )}
        {!loading && isMongoConnected && (
          <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            MongoDB Atlas Connected — all data saved permanently
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
                  username={settings.username}
                  dailyStudyGoal={Number(settings.dailyStudyGoal) || 6}
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
                <CalendarView 
                  tasks={tasks} 
                  studySessions={studySessions} 
                  habits={habits}
                  events={events}
                  onAddEvent={(date) => {
                    setSelectedEventDate(date);
                    setIsEventModalOpen(true);
                  }}
                  onDeleteEvent={handleDeleteEvent}
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
                  settings={settings}
                  onReload={loadAllData}
                  addToast={addToast}
                  onSettingsChange={setSettings}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <NewHabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} onCreate={handleCreateHabit} />
      <NewTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onCreate={handleCreateTask} />
      <LogStudyModal isOpen={isStudyModalOpen} onClose={() => setIsStudyModalOpen(false)} onCreate={handleCreateStudy} />
      <NewGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onCreate={handleCreateGoal} />
      <NewReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} onCreate={handleCreateReminder} />
      <NewEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onCreate={handleCreateEvent} initialDate={selectedEventDate} />
      <ExportDataModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} studySessions={studySessions} tasks={tasks} habits={habits} />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
