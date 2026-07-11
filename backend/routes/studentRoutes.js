const express = require('express');
const router = express.Router();
const { getStudentsByClass } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware checks the token, then passes the classId param forward
router.get('/:classId', protect, getStudentsByClass);

module.exports = router;