const pool = require("../db");

// @desc Get system health and student count
// @route GET /api/health

const getHealth = async (req, res) => {
    try {
        const dbTest = await pool.query('SELECT COUNT(*) FROM students');
        res.json({
            status: 'healthy',
            message: 'Backend server is running smoothly.',
            total_students: parseInt(dbTest.rows[0].count)
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Database unreachable' });
    }
};

module.exports = { getHealth };