const express = require('express');
const router = express.Router();
const { getHabits, createHabit, toggleHabitDate, deleteHabit } = require('../controllers/habitController');

router.route('/').get(getHabits).post(createHabit);
router.route('/:id/toggle').post(toggleHabitDate);
router.route('/:id').delete(deleteHabit);

module.exports = router;
