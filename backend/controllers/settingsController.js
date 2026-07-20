const Settings = require('../models/Settings');

// Mock memory settings fallback
let mockSettings = {
  _id: 'settings-1',
  username: 'Master Explorer',
  dailyStudyGoal: 6,
  notificationTime: '20:00',
  theme: 'dark',
  updatedAt: new Date(),
};

const isConnected = () => require('mongoose').connection.readyState === 1;

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    if (isConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({});
      }
      return res.status(200).json({ success: true, data: settings });
    }
    return res.status(200).json({ success: true, data: mockSettings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const { username, dailyStudyGoal, notificationTime, theme } = req.body;

    if (isConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings({});
      }
      if (username !== undefined) settings.username = username;
      if (dailyStudyGoal !== undefined) settings.dailyStudyGoal = Number(dailyStudyGoal);
      if (notificationTime !== undefined) settings.notificationTime = notificationTime;
      if (theme !== undefined) settings.theme = theme;

      await settings.save();
      return res.status(200).json({ success: true, data: settings, message: 'Settings saved to MongoDB' });
    }

    if (username !== undefined) mockSettings.username = username;
    if (dailyStudyGoal !== undefined) mockSettings.dailyStudyGoal = Number(dailyStudyGoal);
    if (notificationTime !== undefined) mockSettings.notificationTime = notificationTime;
    if (theme !== undefined) mockSettings.theme = theme;
    mockSettings.updatedAt = new Date();

    return res.status(200).json({ success: true, data: mockSettings, message: 'Settings saved to memory' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
