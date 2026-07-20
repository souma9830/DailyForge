const StudySession = require('../models/StudySession');
const { getIsConnected } = require('../config/db');

let mockStudySessions = [
  {
    _id: 'session_1',
    subject: 'Computer Science',
    topic: 'Data Structures - Graph BFS & DFS Traversal',
    durationMinutes: 120,
    difficulty: 'Hard',
    notes: 'Implemented Graph adjacency list with cycle detection algorithms',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: 'session_2',
    subject: 'Software Engineering',
    topic: 'Distributed Systems & Consensus Protocols',
    durationMinutes: 90,
    difficulty: 'Expert',
    notes: 'Studied Raft consensus algorithm, leader election, and log replication',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    _id: 'session_3',
    subject: 'Web Development',
    topic: 'React 19 Server Components & Hooks',
    durationMinutes: 60,
    difficulty: 'Medium',
    notes: 'Learned useActionState, optimistic UI updates, and server actions',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'session_4',
    subject: 'Mathematics',
    topic: 'Linear Algebra - Eigenvalues & Matrix Factorization',
    durationMinutes: 75,
    difficulty: 'Hard',
    notes: 'Solved singular value decomposition problems and matrix transformations',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// @route GET /api/study
exports.getStudySessions = async (req, res) => {
  try {
    if (getIsConnected()) {
      const sessions = await StudySession.find().sort({ date: -1, createdAt: -1 });
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
    const { subject, topic, durationMinutes, difficulty, notes, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (getIsConnected()) {
      const session = await StudySession.create({
        subject: subject || 'General Study',
        topic: topic || 'General Topic',
        durationMinutes: Number(durationMinutes) || 30,
        difficulty: difficulty || 'Medium',
        notes: notes || '',
        date: targetDate,
      });
      return res.status(201).json({ success: true, data: session });
    }

    const mockNew = {
      _id: 'session_' + Date.now(),
      subject: subject || 'General Study',
      topic: topic || 'General Topic',
      durationMinutes: Number(durationMinutes) || 30,
      difficulty: difficulty || 'Medium',
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

// @route DELETE /api/study/:id
exports.deleteStudySession = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await StudySession.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Study session deleted' });
    }

    mockStudySessions = mockStudySessions.filter((s) => s._id !== id);
    res.json({ success: true, message: 'Study session deleted from memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
