const Journal = require('../models/Journal');
const { getIsConnected } = require('../config/db');

let mockJournals = [
  {
    _id: 'journal_1',
    date: new Date().toISOString().split('T')[0],
    mood: 5,
    moodLabel: 'Empowered',
    focusNote: 'High momentum and deep flow state while building DailyForge UI.',
    wins: ['Completed task component design', 'Maintained 5-day meditation streak', 'Healthy home meal'],
    gratitude: ['Grateful for modern web frameworks', 'Quiet focused workspace'],
    reflection: 'Felt extremely energized during code creation. Keeping momentum for tomorrow.',
    energyLevel: 5,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'journal_2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    mood: 4,
    moodLabel: 'Productive',
    focusNote: 'Structured backend API architecture and database models.',
    wins: ['Designed schema definitions', 'Completed 5km morning run'],
    gratitude: ['Good health', 'Clear mind'],
    reflection: 'Solid progress. Staying consistent yields exponential growth.',
    energyLevel: 4,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// @route GET /api/journal
exports.getJournals = async (req, res) => {
  try {
    if (getIsConnected()) {
      const logs = await Journal.find().sort({ date: -1 });
      return res.json({ success: true, count: logs.length, data: logs });
    }
    res.json({ success: true, count: mockJournals.length, data: mockJournals, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/journal/:date
exports.getJournalByDate = async (req, res) => {
  try {
    const { date } = req.params;
    if (getIsConnected()) {
      const entry = await Journal.findOne({ date });
      return res.json({ success: true, data: entry || null });
    }
    const entry = mockJournals.find((j) => j.date === date);
    res.json({ success: true, data: entry || null, mode: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/journal
exports.saveJournal = async (req, res) => {
  try {
    const { date, mood, moodLabel, focusNote, wins, gratitude, reflection, energyLevel } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (getIsConnected()) {
      const updated = await Journal.findOneAndUpdate(
        { date: targetDate },
        {
          date: targetDate,
          mood: mood || 3,
          moodLabel: moodLabel || 'Balanced',
          focusNote: focusNote || '',
          wins: wins || [],
          gratitude: gratitude || [],
          reflection: reflection || '',
          energyLevel: energyLevel || 3,
        },
        { upsert: true, new: true, runValidators: true }
      );
      return res.json({ success: true, data: updated });
    }

    const idx = mockJournals.findIndex((j) => j.date === targetDate);
    const item = {
      _id: idx > -1 ? mockJournals[idx]._id : 'journal_' + Date.now(),
      date: targetDate,
      mood: mood || 3,
      moodLabel: moodLabel || 'Balanced',
      focusNote: focusNote || '',
      wins: wins || [],
      gratitude: gratitude || [],
      reflection: reflection || '',
      energyLevel: energyLevel || 3,
      createdAt: new Date().toISOString(),
    };

    if (idx > -1) {
      mockJournals[idx] = item;
    } else {
      mockJournals.unshift(item);
    }

    res.json({ success: true, data: item, mode: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
