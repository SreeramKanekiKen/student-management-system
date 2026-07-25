const pool = require('../db');

// @desc    Record or update batch class attendance
// @route   POST /api/attendance
// @access  Private
const submitAttendance = async (req, res) => {
  const { date, records } = req.body;

  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ message: 'Missing or invalid attendance payload.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start atomic batch transaction

    for (const record of records) {
      // Safe extraction for student ID
      const studentId = record.studentId ?? record.student_id ?? record.id;

      // Safe extraction for boolean status
      const rawStatus = record.status ?? record.is_present ?? record.isPresent;
      const isPresent = typeof rawStatus === 'boolean' ? rawStatus : true;

      if (!studentId) {
        console.warn('Skipping record without valid student ID:', record);
        continue;
      }

      // Upsert Query: Only targets student_id, date, and is_present
      const upsertQuery = `
        INSERT INTO attendance (student_id, attendance_date, is_present)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, attendance_date) 
        DO UPDATE SET is_present = EXCLUDED.is_present;
      `;

      await client.query(upsertQuery, [
        parseInt(studentId, 10),
        date,
        isPresent
      ]);
    }

    await client.query('COMMIT'); // Commit transaction
    res.status(200).json({ message: 'Attendance successfully saved!' });

  } catch (err) {
    await client.query('ROLLBACK'); // Roll back changes if any query fails
    console.error('Error saving attendance:', err.message);
    res.status(500).json({ message: 'Server error saving attendance data: ' + err.message });
  } finally {
    client.release();
  }
};

module.exports = { submitAttendance };