const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const notificationService = require('./services/notificationService');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io); // allow routes to access io via req.app.get('io')

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`[Socket] User disconnected: ${socket.id}`));
});

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
app.use('/api/events', require('./routes/eventRoutes'));
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
server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 DailyForge Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
  
  // Initialize notification service once server starts
  notificationService.init(io);
});
