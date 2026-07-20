import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Network error – check your connection';

    // Dispatch a custom event so the UI can catch & toast it
    window.dispatchEvent(
      new CustomEvent('dailyforge:apierror', { detail: { message } })
    );

    return Promise.reject(error);
  }
);

// ─── Stats ───────────────────────────────────────────────────────────────────
export const fetchStats = () => api.get('/stats');

// ─── Habits ──────────────────────────────────────────────────────────────────
export const fetchHabits = () => api.get('/habits');

export const createHabit = (data) => api.post('/habits', data);

export const toggleHabit = (id, dateStr) =>
  api.put(`/habits/${id}/toggle`, { date: dateStr });

export const deleteHabit = (id) => api.delete(`/habits/${id}`);

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const fetchTasks = () => api.get('/tasks');

export const createTask = (data) => api.post('/tasks', data);

export const updateTask = (id, updates) => api.put(`/tasks/${id}`, updates);

export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ─── Journal ─────────────────────────────────────────────────────────────────
export const fetchJournal = () => api.get('/journal');
export const fetchJournals = fetchJournal; // alias

export const fetchJournalByDate = (date) => api.get(`/journal/${date}`);

export const saveJournal = (data) => api.post('/journal', data);

// ─── Study Sessions ───────────────────────────────────────────────────────────
export const fetchStudySessions = () => api.get('/study');

export const createStudySession = (data) => api.post('/study', data);

export const deleteStudySession = (id) => api.delete(`/study/${id}`);

// ─── Goals ───────────────────────────────────────────────────────────────────
export const fetchGoals = () => api.get('/goals');

export const createGoal = (data) => api.post('/goals', data);

export const updateGoal = (id, updates) => api.put(`/goals/${id}`, updates);

export const deleteGoal = (id) => api.delete(`/goals/${id}`);

// ─── Reminders ────────────────────────────────────────────────────────────────
export const fetchReminders = () => api.get('/reminders');

export const createReminder = (data) => api.post('/reminders', data);

export const toggleReminder = (id) =>
  api.put(`/reminders/${id}/toggle`);

export const deleteReminder = (id) => api.delete(`/reminders/${id}`);

export const attendReminder = (id) => api.post(`/reminders/${id}/attend`);

export const fetchReminderAnalytics = () => api.get('/reminders/analytics');

// ─── Settings ─────────────────────────────────────────────────────────────────
export const fetchSettings = () => api.get('/settings');

export const updateSettings = (data) => api.put('/settings', data);

// ─── Events (Calendar) ───────────────────────────────────────────────────────
export const fetchEvents = () => api.get('/events');
export const createEvent = (data) => api.post('/events', data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export default api;
