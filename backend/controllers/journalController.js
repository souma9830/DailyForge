const Journal = require('../models/Journal');

// GET /api/journal
exports.getJournals = async (req, res) => {
  try {
    const logs = await Journal.find().sort({ date: -1 }).lean();
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journal/:date
exports.getJournalByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const entry = await Journal.findOne({ date }).lean();
    res.json({ success: true, data: entry || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/journal  (upsert by date)
exports.saveJournal = async (req, res) => {
  try {
    const { date, mood, moodLabel, focusNote, wins, gratitude, reflection, energyLevel } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const updated = await Journal.findOneAndUpdate(
      { date: targetDate },
      {
        date: targetDate,
        mood: mood ?? 3,
        moodLabel: moodLabel || 'Balanced',
        focusNote: focusNote?.trim() || '',
        wins: Array.isArray(wins) ? wins : [],
        gratitude: Array.isArray(gratitude) ? gratitude : [],
        reflection: reflection?.trim() || '',
        energyLevel: energyLevel ?? 3,
      },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
