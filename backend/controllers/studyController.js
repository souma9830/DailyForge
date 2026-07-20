const StudySession = require('../models/StudySession');
const { getIsConnected } = require('../config/db');

let mockStudySessions = [
  {
    _id: 'session_1',
    subject: 'Data Structures & Algorithms - Graph Traversal',
    durationMinutes: 120,
    category: 'CS Core',
    notes: 'Implemented BFS & DFS algorithms in TypeScript with test cases',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: 'session_2',
    subject: 'System Architecture & Microservices',
    durationMinutes: 90,
    category: 'System Design',
    notes: 'Studied event-driven messaging patterns with RabbitMQ & Kafka',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    _id: 'session_3',
    subject: 'React 19 & Next.js App Router Deep Dive',
    durationMinutes: 60,
    category: 'Frontend',
    notes: 'Reviewed server components, action state hooks, and streaming rendering',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// @route GET /api/study
exports.getStudySessions = async (req, res) => {
  try {
    if (getIsConnected()) {
      const sessions = await StudySession.find().sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, count: sessions.length, data: sessions });
    }
    res.json({ success: true, count: mockStudySessions.length, data: mockStudySessions, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/study
exports.createStudySession = async (req, res) => {
  try {
    const { subject, durationMinutes, category, notes, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (getIsConnected()) {
      const session = await StudySession.create({
        subject,
        durationMinutes: Number(durationMinutes) || 30,
        category: category || 'General',
        notes: notes || '',
        date: targetDate,
      });
      return res.status(201).json({ success: true, data: session });
    }

    const mockNew = {
      _id: 'session_' + Date.now(),
      subject,
      durationMinutes: Number(durationMinutes) || 30,
      category: category || 'General',
      notes: notes || '',
      date: targetDate,
      createdAt: new Date().toISOString(),
    };
    mockStudySessions.unshift(mockNew);
    res.status(201).json({ success: true, data: mockNew, mode: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
