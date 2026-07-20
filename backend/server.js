const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { getIsConnected } = require('./config/db');
  res.json({
    status: 'online',
    appName: 'DailyForge API',
    mongoDBConnected: getIsConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[DailyForge Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 DailyForge Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
