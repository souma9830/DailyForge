const cron = require('node-cron');
const axios = require('axios');
const Reminder = require('../models/Reminder');

let _io = null;

// ─── Initialise (called from server.js with the io instance) ─────────────────
function init(io) {
  _io = io;
  startScheduler();
  console.log('[NotifService] Attendance scheduler started ✅');
}

// ─── Emit helper ─────────────────────────────────────────────────────────────
function emit(event, payload) {
  if (_io) _io.emit(event, payload);
}

// ─── Main Scheduler (every minute) ───────────────────────────────────────────
function startScheduler() {
  cron.schedule('* * * * *', checkReminders);
  cron.schedule('59 23 * * *', markAllMissed);   // midnight: mark missed
  cron.schedule('0 0 * * *', resetForNewDay);    // midnight+1: reset idle
}

async function checkReminders() {
  try {
    const now = new Date();
    const todayStr = toDateStr(now);

    const reminders = await Reminder.find({
      isActive: true,
      status: { $nin: ['attended', 'missed'] },
    });

    for (const rem of reminders) {
      const triggerTime = getTriggerTime(rem, now);

      const isNewDay = rem.scheduledDate !== todayStr;
      const isDue = now >= triggerTime;

      if (isNewDay && isDue) {
        await sendFirst(rem, now, todayStr);
      } else if (!isNewDay && rem.status === 'notified') {
        if (rem.nextNotificationAt && now >= new Date(rem.nextNotificationAt)) {
          await sendRepeat(rem, now);
        }
      }
    }
  } catch (err) {
    console.error('[Scheduler] Error:', err.message);
  }
}

// First notification for today
async function sendFirst(rem, now, todayStr) {
  const [h, m] = rem.scheduledTime.split(':').map(Number);
  const scheduled = new Date(now);
  scheduled.setHours(h, m, 0, 0);
  const minutesUntil = Math.max(0, Math.round((scheduled - now) / 60000));

  const title = `📚 ${rem.subject}`;
  const body = minutesUntil > 0
    ? `${rem.topic} — starts in ${minutesUntil} min`
    : `${rem.topic} — starting now!`;

  emit('reminder:notify', buildPayload(rem, title, body, 0, 'first'));
  await pushNtfy(rem, title, body);

  rem.status = 'notified';
  rem.scheduledDate = todayStr;
  rem.firstNotificationAt = now;
  rem.nextNotificationAt = new Date(now.getTime() + rem.repeatEveryMinutes * 60000);
  rem.notificationCount = 1;
  rem.isAttended = false;
  rem.attendedAt = null;
  rem.attendanceDelayMinutes = null;
  await rem.save();
}

// Repeat notification
async function sendRepeat(rem, now) {
  const delay = Math.round((now - new Date(rem.firstNotificationAt)) / 60000);

  const title = `⏰ Still Waiting — ${rem.subject}`;
  const body = `${rem.topic} · Delay: ${delay} min · Notification #${rem.notificationCount + 1}. Click I'm Present ✅`;

  emit('reminder:notify', buildPayload(rem, title, body, delay, 'repeat'));
  await pushNtfy(rem, title, body);

  rem.nextNotificationAt = new Date(now.getTime() + rem.repeatEveryMinutes * 60000);
  rem.notificationCount += 1;
  await rem.save();
}

// Mark all in-loop reminders as missed at midnight
async function markAllMissed() {
  const todayStr = toDateStr(new Date());
  const victims = await Reminder.find({ scheduledDate: todayStr, status: 'notified' });
  for (const rem of victims) {
    rem.history.push({
      date: todayStr,
      status: 'missed',
      notificationCount: rem.notificationCount,
    });
    rem.status = 'missed';
    await rem.save();
    emit('reminder:missed', { reminderId: rem._id.toString() });
  }
  console.log(`[Scheduler] Marked ${victims.length} reminder(s) as missed.`);
}

// Reset idle state for new day
async function resetForNewDay() {
  await Reminder.updateMany(
    { isActive: true, status: { $in: ['attended', 'missed'] } },
    {
      $set: {
        status: 'idle',
        isAttended: false,
        attendedAt: null,
        firstNotificationAt: null,
        nextNotificationAt: null,
        notificationCount: 0,
        attendanceDelayMinutes: null,
      },
    }
  );
  console.log('[Scheduler] Reset reminders for new day.');
}

// ─── ntfy Mobile Push ─────────────────────────────────────────────────────────
async function pushNtfy(rem, title, body) {
  if (!rem.ntfyTopic || !rem.ntfyTopic.trim()) return;
  const appUrl = process.env.APP_URL || 'http://localhost:5000';
  const attendUrl = `${appUrl}/api/reminders/${rem._id}/attend`;
  try {
    await axios.post(`https://ntfy.sh/${rem.ntfyTopic.trim()}`, body, {
      headers: {
        Title: title,
        Priority: 'high',
        Tags: 'bell,books',
        Actions: `http, I'm Present ✅, ${attendUrl}, method=POST`,
      },
      timeout: 8000,
    });
  } catch (err) {
    console.warn('[ntfy] Push failed:', err.message);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTriggerTime(rem, now) {
  const [h, m] = rem.scheduledTime.split(':').map(Number);
  const t = new Date(now);
  t.setHours(h, m - rem.reminderBeforeMinutes, 0, 0);
  return t;
}

function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

function buildPayload(rem, title, body, delayMinutes, type) {
  return {
    reminderId: rem._id.toString(),
    title,
    body,
    subject: rem.subject,
    topic: rem.topic,
    scheduledTime: rem.scheduledTime,
    delayMinutes,
    notificationCount: rem.notificationCount,
    repeatEveryMinutes: rem.repeatEveryMinutes,
    type,
  };
}

module.exports = { init };
