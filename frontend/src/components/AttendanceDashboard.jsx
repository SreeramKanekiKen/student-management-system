import React, { useState, useEffect} from 'react';
import API from '../api';

const AttendanceDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await API.get('/classes');
                setClasses(response.data);

                if (response.data.length > 0) {
                    setSelectedClass(response.data[0].id);
                }
            }
            catch (err) {
                setError('Failed to load classes from server.');
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;

        const fetchRoster = async () => {
            setLoading(true);
            setError('');
            setMessage('');

            try {
                const response = await API.get('/students/${selectedClass}');
                const initializedRoster = response.data.map(student => ({
                    ...student,
                    status: true
                }));
                setStudents(initializedRoster);
            }
            catch (err) {
                setError('Failed to fetch student roster.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchRoster();
    }, [selectedClass]);

    const handleStatusChange = (studentId) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.id === studentID ? { ...student, status: !student.status } : student
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const payload = {
            classId: parseInd(selectedClass);
            date: date,
            records: students.map(student => ({
                studentID: student.id,
                status: student.status
            }))
        };

        try {
            const response = await API.post('/attendance', payload);
            setMessage(response.data.message || 'Attendance recorded successfully!');
        }
        catch (err) {
            setError(err.response?.message || 'Error saving attendance records.');
        }
    };

    return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', color: '#333' }}>
      <h2>📋 Daily Attendance Tracker</h2>
      <hr style={{ margin: '15px 0', borderColor: '#eee' }} />

      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ {error}</div>}
      {message && <div style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>✅ {message}</div>}

      {/* Control Configuration Panel */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Class Group:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name || `Class ${c.id}`}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Target Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>

      {/* Roster Grid and Submission Form */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Compiling class roster list...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '150px' }}>Status Toggle</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No students assigned to this class segment.</td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>
                      {student.name || `Student ID: ${student.id}`}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '20px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'background-color 0.2s',
                          backgroundColor: student.status ? '#28a745' : '#dc3545',
                          color: 'white'
                        }}
                      >
                        {student.status ? 'Present' : 'Absent'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {students.length > 0 && (
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Submit Roster to Database
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default AttendanceDashboard;