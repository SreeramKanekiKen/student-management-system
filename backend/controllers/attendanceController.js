const pool = require("../db");

// @desc Submit or update daily attendance for a class
// @route POST /api/attendance
// @access Private

const submitAttendance = async (req, res) => {
    const { classId, date, attendance } = req.body;

    // Basic Payload Validation
    if (!classId || !date || !records || !Array.isArray(records)) {
        return res.status(400).json({ message: 'Missing required attendance fields' });
    }

    try {
        await pool.query('BEGIN');

        const insertQuery = `
        INSERT INTO attendance (student_id, date, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, date) 
        DO UPDATE SET status = EXCLUDED.status
        `;

        for (const record of records) {
            await pool.query(insertQuery, [record.studentId, date, record.status]);
        }

        await pool.query('COMMIT');

        res.json({ message: `Attendance for class ${classId} recorded successfully for ${date}` });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Attendance submission error:', err.message);
        res.status(500).json({ message: 'Server error saving attendance data' });
    }
}

module.exports = { submitAttendance };