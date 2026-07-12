const pool = require("../db");

// @desc Get a student's marks across all subjects
// @route GET /api/grades/:studentId
// @access Private

const getStudentGrades = async (req, res) => {
    const { studentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, subject, assignment_name, score, max_score, recorded_at FROM grades WHERE student_id = $1`, [studentId]
        );

        res.json(result.rows);
    }
    catch (err) {
        console.error('Fetch grades error:', err.message);
        res.status(500).json({ message: 'Server error fetching grades' });
    }
};

// @desc Input exam marks for a student
// @route POST /api/grades
// @access Private

const addGrade = async (req, res) => {
    const { studentId, subject, assignmentName, score, maxScore } = req.body;

    // Validation checking against your exact required columns
    if (!studentId || !subject || !assignmentName || score === undefined || !maxScore) {
        return res.status(400).json({ message: 'Missing required grade fields' });
    }

    try {
        const insertQuery = `
        INSERT INTO grades (student_id, subject, assignment_name, score, max_score)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

        const result = await pool.query(insertQuery, [
            studentId,
            subject,
            assignmentName,
            score,
            maxScore
        ]);

        res.status(201).json({
            message: 'Grade recorded successfully', 
            grade: result.rows[0]
        });
    }

    catch (err) {
        console.error('Add grade error:', err.message);
        res.status(500).json({ message: 'Server error saving grade data' });
    }
};

module.exports = { getStudentGrades, addGrade };