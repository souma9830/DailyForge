const API_BASE = '/api';

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchStats):', err);
    throw err;
  }
}

export async function fetchHabits() {
  try {
    const res = await fetch(`${API_BASE}/habits`);
    if (!res.ok) throw new Error('Failed to fetch habits');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchHabits):', err);
    throw err;
  }
}

export async function createHabit(habitData) {
  try {
    const res = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitData),
    });
    if (!res.ok) throw new Error('Failed to create habit');
    return await res.json();
  } catch (err) {
    console.error('API Error (createHabit):', err);
    throw err;
  }
}

export async function toggleHabit(id, dateStr) {
  try {
    const res = await fetch(`${API_BASE}/habits/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr }),
    });
    if (!res.ok) throw new Error('Failed to toggle habit date');
    return await res.json();
  } catch (err) {
    console.error('API Error (toggleHabit):', err);
    throw err;
  }
}

export async function deleteHabit(id) {
  try {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete habit');
    return await res.json();
  } catch (err) {
    console.error('API Error (deleteHabit):', err);
    throw err;
  }
}

export async function fetchTasks(filters = {}) {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/tasks?${params}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchTasks):', err);
    throw err;
  }
}

export async function createTask(taskData) {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  } catch (err) {
    console.error('API Error (createTask):', err);
    throw err;
  }
}

export async function updateTask(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  } catch (err) {
    console.error('API Error (updateTask):', err);
    throw err;
  }
}

export async function deleteTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return await res.json();
  } catch (err) {
    console.error('API Error (deleteTask):', err);
    throw err;
  }
}

export async function fetchJournals() {
  try {
    const res = await fetch(`${API_BASE}/journal`);
    if (!res.ok) throw new Error('Failed to fetch journals');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchJournals):', err);
    throw err;
  }
}

export async function saveJournal(journalData) {
  try {
    const res = await fetch(`${API_BASE}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journalData),
    });
    if (!res.ok) throw new Error('Failed to save journal');
    return await res.json();
  } catch (err) {
    console.error('API Error (saveJournal):', err);
    throw err;
  }
}

export async function fetchStudySessions() {
  try {
    const res = await fetch(`${API_BASE}/study`);
    if (!res.ok) throw new Error('Failed to fetch study sessions');
    return await res.json();
  } catch (err) {
    console.error('API Error (fetchStudySessions):', err);
    throw err;
  }
}

export async function createStudySession(sessionData) {
  try {
    const res = await fetch(`${API_BASE}/study`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
    if (!res.ok) throw new Error('Failed to create study session');
    return await res.json();
  } catch (err) {
    console.error('API Error (createStudySession):', err);
    throw err;
  }
}

export async function deleteStudySession(id) {
  try {
    const res = await fetch(`${API_BASE}/study/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete study session');
    return await res.json();
  } catch (err) {
    console.error('API Error (deleteStudySession):', err);
    throw err;
  }
}
