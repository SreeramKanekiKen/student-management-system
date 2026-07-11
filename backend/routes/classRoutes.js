const express = require('express');
const router = express.Router();
const { getClasses } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware ensures the user has a valid token before hitting the controller
router.get('/', protect, getClasses);

module.exports = router;