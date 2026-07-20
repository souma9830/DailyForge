import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stats API
export const fetchStats = async () => {
  return await api.get('/stats');
};

// Habits API
export const fetchHabits = async () => {
  return await api.get('/habits');
};

export const createHabit = async (habitData) => {
  return await api.post('/habits', habitData);
};

export const toggleHabit = async (id, dateStr) => {
  return await api.put(`/habits/${id}/toggle`, { dateStr });
};

export const deleteHabit = async (id) => {
  return await api.delete(`/habits/${id}`);
};

// Tasks API
export const fetchTasks = async () => {
  return await api.get('/tasks');
};

export const createTask = async (taskData) => {
  return await api.post('/tasks', taskData);
};

export const updateTask = async (id, updates) => {
  return await api.put(`/tasks/${id}`, updates);
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

// Reflection Journal API
export const fetchJournal = async () => {
  return await api.get('/journal');
};

export const fetchJournals = fetchJournal; // Alias for compatibility

export const saveJournal = async (journalData) => {
  return await api.post('/journal', journalData);
};

// Study Sessions API
export const fetchStudySessions = async () => {
  return await api.get('/study');
};

export const createStudySession = async (sessionData) => {
  return await api.post('/study', sessionData);
};

export const deleteStudySession = async (id) => {
  return await api.delete(`/study/${id}`);
};

// Goals API
export const fetchGoals = async () => {
  return await api.get('/goals');
};

export const createGoal = async (goalData) => {
  return await api.post('/goals', goalData);
};

export const updateGoal = async (id, updates) => {
  return await api.put(`/goals/${id}`, updates);
};

export const deleteGoal = async (id) => {
  return await api.delete(`/goals/${id}`);
};

// Reminders API
export const fetchReminders = async () => {
  return await api.get('/reminders');
};

export const createReminder = async (reminderData) => {
  return await api.post('/reminders', reminderData);
};

export const toggleReminder = async (id) => {
  return await api.put(`/reminders/${id}/toggle`);
};

export const deleteReminder = async (id) => {
  return await api.delete(`/reminders/${id}`);
};

// Settings API
export const fetchSettings = async () => {
  return await api.get('/settings');
};

export const updateSettings = async (settingsData) => {
  return await api.put('/settings', settingsData);
};

export default api;
