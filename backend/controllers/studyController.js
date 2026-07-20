const StudySession = require('../models/StudySession');

// GET /api/study
exports.getStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find().sort({ date: -1, createdAt: -1 }).lean();
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/study
exports.createStudySession = async (req, res) => {
  try {
    const { subject, topic, durationMinutes, difficulty, notes, date } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }
    const session = await StudySession.create({
      subject: subject.trim(),
      topic: topic.trim(),
      durationMinutes: Number(durationMinutes) || 30,
      difficulty: difficulty || 'Medium',
      notes: notes?.trim() || '',
      date: date || new Date().toISOString().split('T')[0],
    });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/study/:id
exports.deleteStudySession = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await StudySession.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, message: 'Study session deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
