const express = require('express');
const router = express.Router();
const { getStudentGrades, addGrade } = require('../controllers/gradesController');
const { protect } = require('../middleware/authMiddleware');

// Route configurations
router.post('/', protect, addGrade);
router.get('/:studentId', protect, getStudentGrades);

module.exports = router;