const express = require('express');
const router = express.Router();
const { getStudySessions, createStudySession, deleteStudySession } = require('../controllers/studyController');

router.route('/').get(getStudySessions).post(createStudySession);
router.route('/:id').delete(deleteStudySession);

module.exports = router;
