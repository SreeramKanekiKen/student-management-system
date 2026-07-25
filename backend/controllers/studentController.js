const pool = require('../db');

// @desc Get all students belonging to a specific class
// @route GET /api/students/:classId
// @access Private (JWT Required)
const getStudentsByClass = async (req, res) => {
    const { classId } = req.params;

    try {
        const result = await pool.query(`SELECT * FROM students WHERE class_id = $1 ORDER BY id ASC`, [classId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching students:', err.message);
        res.status(500).json({message: 'Server error fetching students' });
    }
};

module.exports = { getStudentsByClass };