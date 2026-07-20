const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 }).lean();
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, email, notifyBeforeMinutes } = req.body;
    if (!title?.trim() || !date || !time || !email?.trim()) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const ev = await Event.create({
      title: title.trim(),
      description: description?.trim() || '',
      date,
      time,
      email: email.trim(),
      notifyBeforeMinutes: Number(notifyBeforeMinutes) || 60,
      isNotified: false
    });

    res.status(201).json({ success: true, data: ev });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
