const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Map POST /api/auth/login to the loginUser function
router.post('/login', loginUser);

module.exports = router;