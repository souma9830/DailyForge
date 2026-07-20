const express = require('express');
const router = express.Router();
const { getStudySessions, createStudySession } = require('../controllers/studyController');

router.route('/').get(getStudySessions).post(createStudySession);

module.exports = router;
