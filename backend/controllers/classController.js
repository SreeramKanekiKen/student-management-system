const pool = require('../db');

// @desc Get all classes for the dropdown
// @route GET /api/classes
// @access Private (JWT Required)

const getClasses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM classes');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching classes:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getClasses };