const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
} = require('../controllers/reminderController');

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
