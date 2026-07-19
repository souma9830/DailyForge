# DailyForge 🚀
> **Modern Full-Stack Personal Productivity & Habit Master System**  
> Built with **React**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Tailwind CSS**.

---

## ⚡ Overview
**DailyForge** is engineered for single-user mastery. It consolidates daily habit tracking, task board (Kanban), daily reflection journaling, visual productivity analytics, and gamified XP progress into one unified workspace.

---

## 🏗️ Architecture & Clean Structure

```
My Personal TODO/
├── backend/                  # Node.js & Express REST API
│   ├── config/
│   │   └── db.js             # Mongoose MongoDB connection with hybrid fallback
│   ├── controllers/
│   │   ├── habitController.js# Habit logic & streak calculations
│   │   ├── taskController.js # Kanban & task CRUD
│   │   ├── journalController.js # Daily reflection log
│   │   └── statsController.js # Gamified XP & progress metrics
│   ├── models/
│   │   ├── Habit.js          # Mongoose schema for habits
│   │   ├── Task.js           # Mongoose schema for tasks
│   │   └── Journal.js        # Mongoose schema for daily reflections
│   ├── routes/               # Express routing endpoints
│   ├── .env                  # Port & MongoDB URI config
│   └── server.js             # Express app entry point
│
├── frontend/                 # React (Vite) + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/       # Workspace view components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HabitTracker.jsx
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── ReflectionJournal.jsx
│   │   │   ├── ProductivityAnalytics.jsx
│   │   │   ├── SettingsView.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   └── api.js        # Centralized HTTP request client
│   │   ├── App.jsx           # Application state manager
│   │   ├── index.css         # Custom Tailwind styles & glassmorphism
│   │   └── main.jsx
│   ├── tailwind.config.js    # Custom DailyForge theme tokens
│   └── vite.config.js        # Vite dev server configuration & API proxy
└── package.json              # Main project scripts
```

---

## 🔌 MongoDB Mongoose Connection
The backend automatically connects to MongoDB via Mongoose using the connection string defined in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/dailyforge
PORT=5000
```

- **Mongoose Validation**: All collections (`habits`, `tasks`, `journals`) enforce typed schema validation.
- **Graceful Operation**: If MongoDB is active locally, all data is automatically stored in Mongoose collections. If MongoDB is off, the backend runs in hybrid memory mode so the UI remains 100% functional out of the box.

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the following in your terminal:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Launch Backend API
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:5000`)*

### 3. Launch Frontend UI
```bash
cd frontend
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## ✨ Features
1. **Forge Dashboard**: XP progress tracking, daily habit quick check-ins, active task board preview, and daily motivation quotes.
2. **Habits Forge**: 7-day matrix tracking, automatic streak calculation, best streak memory, and customizable category badges.
3. **Task & Quest Board**: Kanban status columns (`To Do`, `In Progress`, `Completed`), priority badges (`urgent`, `high`, `medium`), tag filtering, and instant state switching.
4. **Daily Reflection & Mindset Journal**: Daily mood tracker, key win logger, gratitude section, and historical journal feed.
5. **Analytics & Trends**: Recharts visual graphs rendering weekly completion rates and category distributions.
6. **Future Scalability**: Modular controller-service architecture ready to scale to multi-tenant user authentication or external integrations whenever needed.
