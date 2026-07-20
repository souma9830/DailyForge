const Reminder = require('../models/Reminder');

// Mock in-memory storage fallback
let mockReminders = [
  {
    _id: 'rem-1',
    title: 'Study Backend at 8 PM',
    time: '20:00',
    category: 'Study',
    repeat: 'daily',
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: 'rem-2',
    title: 'Drink Water',
    time: '14:00',
    category: 'Health',
    repeat: 'daily',
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: 'rem-3',
    title: 'Exercise & Stretching',
    time: '18:30',
    category: 'Fitness',
    repeat: 'daily',
    isActive: true,
    createdAt: new Date(),
  },
];

const isConnected = () => require('mongoose').connection.readyState === 1;

// GET /api/reminders
exports.getReminders = async (req, res) => {
  try {
    if (isConnected()) {
      const reminders = await Reminder.find().sort({ time: 1 });
      return res.status(200).json({ success: true, count: reminders.length, data: reminders });
    }
    return res.status(200).json({ success: true, count: mockReminders.length, data: mockReminders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/reminders
exports.createReminder = async (req, res) => {
  try {
    const { title, time, category, repeat } = req.body;
    if (!title || !time) {
      return res.status(400).json({ success: false, message: 'Title and time are required' });
    }

    if (isConnected()) {
      const newRem = await Reminder.create({
        title,
        time,
        category: category || 'Study',
        repeat: repeat || 'daily',
        isActive: true,
      });
      return res.status(201).json({ success: true, data: newRem });
    }

    const newMock = {
      _id: `rem-${Date.now()}`,
      title,
      time,
      category: category || 'Study',
      repeat: repeat || 'daily',
      isActive: true,
      createdAt: new Date(),
    };
    mockReminders.unshift(newMock);
    return res.status(201).json({ success: true, data: newMock });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/reminders/:id/toggle
exports.toggleReminder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      const rem = await Reminder.findById(id);
      if (!rem) return res.status(404).json({ success: false, message: 'Reminder not found' });
      rem.isActive = !rem.isActive;
      await rem.save();
      return res.status(200).json({ success: true, data: rem });
    }

    const rem = mockReminders.find((r) => r._id === id);
    if (!rem) return res.status(404).json({ success: false, message: 'Reminder not found' });
    rem.isActive = !rem.isActive;
    return res.status(200).json({ success: true, data: rem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/reminders/:id
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      await Reminder.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
    }
    mockReminders = mockReminders.filter((r) => r._id !== id);
    return res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
