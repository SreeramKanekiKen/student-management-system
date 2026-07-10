const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');

// Map the root of this route to the getHealth function

router.get('/', getHealth);

module.exports = router;