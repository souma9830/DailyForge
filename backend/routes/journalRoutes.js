const express = require('express');
const router = express.Router();
const { getJournals, getJournalByDate, saveJournal } = require('../controllers/journalController');

router.route('/').get(getJournals).post(saveJournal);
router.route('/:date').get(getJournalByDate);

module.exports = router;
