const Reminder = require('../models/Reminder');

// GET /api/reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ time: 1 }).lean();
    res.status(200).json({ success: true, count: reminders.length, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reminders
exports.createReminder = async (req, res) => {
  try {
    const { title, time, category, repeat } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Reminder title is required' });
    }
    if (!time) {
      return res.status(400).json({ success: false, message: 'Reminder time is required' });
    }
    const newRem = await Reminder.create({
      title: title.trim(),
      time,
      category: category || 'Study',
      repeat: repeat || 'daily',
      isActive: true,
    });
    res.status(201).json({ success: true, data: newRem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/reminders/:id/toggle
exports.toggleReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const rem = await Reminder.findById(id);
    if (!rem) return res.status(404).json({ success: false, message: 'Reminder not found' });
    rem.isActive = !rem.isActive;
    await rem.save();
    res.status(200).json({ success: true, data: rem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/reminders/:id
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reminder.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Reminder not found' });
    res.status(200).json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
