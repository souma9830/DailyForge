const Settings = require('../models/Settings');

// GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().lean();
    if (!settings) {
      // Create default settings document on first run
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const { username, dailyStudyGoal, notificationTime, theme } = req.body;

    const updates = {};
    if (username !== undefined) updates.username = username.trim();
    if (dailyStudyGoal !== undefined) updates.dailyStudyGoal = Number(dailyStudyGoal);
    if (notificationTime !== undefined) updates.notificationTime = notificationTime;
    if (theme !== undefined) updates.theme = theme;

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: updates },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: settings, message: 'Settings saved' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
