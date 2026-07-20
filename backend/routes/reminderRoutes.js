const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
  attendReminder,
  getAnalytics,
} = require('../controllers/reminderController');

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);
router.post('/:id/attend', attendReminder);   // Called by SW action / ntfy button
router.get('/analytics', getAnalytics);

module.exports = router;
