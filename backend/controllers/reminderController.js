const Reminder = require('../models/Reminder');

function toDateStr(d) { return d.toISOString().split('T')[0]; }

// GET /api/reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ isActive: true }).sort({ scheduledTime: 1 }).lean();
    res.json({ success: true, count: reminders.length, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reminders
exports.createReminder = async (req, res) => {
  try {
    const { subject, topic, scheduledTime, reminderBeforeMinutes, repeatEveryMinutes, ntfyTopic, color } = req.body;
    if (!subject?.trim()) return res.status(400).json({ success: false, message: 'Subject is required' });
    if (!topic?.trim()) return res.status(400).json({ success: false, message: 'Topic is required' });
    if (!scheduledTime) return res.status(400).json({ success: false, message: 'Scheduled time is required' });

    const rem = await Reminder.create({
      subject: subject.trim(),
      topic: topic.trim(),
      scheduledTime,
      reminderBeforeMinutes: Number(reminderBeforeMinutes) || 5,
      repeatEveryMinutes: Number(repeatEveryMinutes) || 15,
      ntfyTopic: ntfyTopic?.trim() || '',
      color: color || '#3b82f6',
    });
    res.status(201).json({ success: true, data: rem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/reminders/:id/toggle
exports.toggleReminder = async (req, res) => {
  try {
    const rem = await Reminder.findById(req.params.id);
    if (!rem) return res.status(404).json({ success: false, message: 'Not found' });
    rem.isActive = !rem.isActive;
    await rem.save();
    res.json({ success: true, data: rem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reminders/:id
exports.deleteReminder = async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reminders/:id/attend  — Mark as attended (called by browser SW or ntfy action)
exports.attendReminder = async (req, res) => {
  try {
    const rem = await Reminder.findById(req.params.id);
    if (!rem) return res.status(404).json({ success: false, message: 'Not found' });

    if (rem.isAttended) {
      return res.json({ success: true, message: 'Already attended', data: rem });
    }

    const now = new Date();
    const todayStr = toDateStr(now);

    // Calculate delay from scheduled time
    const [h, m] = rem.scheduledTime.split(':').map(Number);
    const scheduled = new Date(now);
    scheduled.setHours(h, m, 0, 0);
    const delayMinutes = Math.max(0, Math.round((now - scheduled) / 60000));

    rem.isAttended = true;
    rem.attendedAt = now;
    rem.status = 'attended';
    rem.attendanceDelayMinutes = delayMinutes;

    // Push to history
    rem.history.push({
      date: todayStr,
      status: 'attended',
      attendedAt: now,
      delayMinutes,
      notificationCount: rem.notificationCount,
    });

    await rem.save();

    // Emit socket event so frontend updates in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('reminder:attended', {
        reminderId: rem._id.toString(),
        attendedAt: now,
        delayMinutes,
        subject: rem.subject,
        topic: rem.topic,
      });
    }

    res.json({ success: true, data: rem, delayMinutes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reminders/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const reminders = await Reminder.find({ isActive: true }).lean();

    let totalSessions = 0;
    let attended = 0;
    let missed = 0;
    let delaySum = 0;
    let delayCount = 0;
    const subjectMissed = {};

    for (const rem of reminders) {
      for (const h of rem.history) {
        totalSessions++;
        if (h.status === 'attended') {
          attended++;
          if (h.delayMinutes != null) { delaySum += h.delayMinutes; delayCount++; }
        } else {
          missed++;
          subjectMissed[rem.subject] = (subjectMissed[rem.subject] || 0) + 1;
        }
      }
    }

    const attendancePct = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;
    const avgDelay = delayCount > 0 ? Math.round(delaySum / delayCount) : 0;
    const mostMissed = Object.entries(subjectMissed).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Current attendance streak (consecutive attended days)
    const allDates = [...new Set(
      reminders.flatMap(r => r.history.map(h => h.date))
    )].sort();

    let streak = 0;
    const today = toDateStr(new Date());
    let check = new Date();
    while (true) {
      const ds = toDateStr(check);
      const dayEntries = reminders.flatMap(r => r.history.filter(h => h.date === ds));
      if (dayEntries.length === 0 && ds !== today) break;
      const allAttended = dayEntries.length > 0 && dayEntries.every(h => h.status === 'attended');
      if (allAttended) streak++;
      else if (ds !== today) break;
      check.setDate(check.getDate() - 1);
    }

    res.json({
      success: true,
      data: { totalSessions, attended, missed, attendancePct, avgDelay, mostMissed, streak },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
