const pool = require("../db");

// @desc Submit or update daily attendance for a class
// @route POST /api/attendance
// @access Private

const submitAttendance = async (req, res) => {
    try {
         const { classId, date, records } = req.body;

        // Basic Payload Validation
        if (!classId || !date || !records || !Array.isArray(records)) {
            return res.status(400).json({ message: 'Missing required attendance fields' });
        }

        await pool.query('BEGIN');

        const insertQuery = `
        INSERT INTO attendance (student_id, attendance_date, is_present)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, attendance_date) 
        DO UPDATE SET is_present = EXCLUDED.is_present
        `;

        for (const record of records) {
            await pool.query(insertQuery, [record.studentId, date, record.is_present]);
        }

        await pool.query('COMMIT');

        res.json({ message: `Attendance for class ${classId} recorded successfully for ${date}` });
    } 
    catch (err) {
        await pool.query('ROLLBACK');
        console.error('Attendance submission error:', err.stack);
        res.status(500).json({ message: 'Server error saving attendance data' });
    }
}

module.exports = { submitAttendance };