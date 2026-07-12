const express = require('express');
const router = express.Router();
const { submitAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Lock down the submission pipeline under out JWT middleware guard
router.post('/', protect, submitAttendance);

module.exports = router;