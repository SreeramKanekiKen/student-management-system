import React, { useState, useEffect } from 'react';
import API from '../API';

const GradebookDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [subject, setSubject] = useState('Mathematics');
    const [examName, setExamName] = useState('Quiz 1');
    const [maxScore, setMaxScore] = useState(100);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await API.get('/classes');
                setClasses(response.data || []);
                if (response.data && response.data.length > 0) {
                    setSelectedClass(response.data[0].id);
                }
            }
            catch (err) {
                setError('Failed to load classes.');
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
                const response = await API.get('/students/' + selectedClass);
                const rosterData = Array.isArray(response.data) ? response.data : [];
                const initializedRoster = rosterData.map(student => ({
                    ...student,
                    score: ''
                }));
                setStudents(initializedRoster);
            }
            catch(err) {
                setError('Failed to fetch student roster.');
            }
            finally {
                setLoading(false);
            }
        };

        fetchRoster();
    }, [selectedClass]);

    const handleScoreChange = (studentId, value) => {
        setStudents(prev =>
            prev.map(student =>
                student.id === studentId ? { ...student, score: value } : student
            )
        );
    };

    const getStudentName = (student) => {
        if (!student) return 'Unknown Student';
        if (student.name) return student.name;
        if (student.first_name) {
            return `${student.first_name} ${student.last_name || ''}`.trim();
        }
        return `Student ID: ${student.id}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const payload = {
            classId: parseInt(selectedClass, 10),
            subject,
            examName,
            maxScore: parseFloat(maxScore),
            records: students.map(s => ({
                studentId: s.id,
                score: s.score === '' ? 0 : parseFloat(s.score)
            }))
        };

        try {
            const response = await API.post('/grades', payload);
            setMessage(response.data?.message || 'Grades saved successfully!');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Error submitting grades.');
        }
    };

    return (
        <div style={{ maxWidth: '750px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', color: '#333' }}>
      <h2 style={{ color: '#1a1a1a', margin: '0 0 10px 0' }}>📝 Student Gradebook</h2>
      <hr style={{ margin: '15px 0', borderColor: '#eee' }} />

      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ {error}</div>}
      {message && <div style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>✅ {message}</div>}

      {/* Settings Header Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ width: '100%', padding: '9px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name || `Class ${c.id}`}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subject / Module:</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assessment Title:</label>
          <input 
            type="text" 
            value={examName} 
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. Midterm Exam"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Max Possible Score:</label>
          <input 
            type="number" 
            value={maxScore} 
            onChange={(e) => setMaxScore(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
          />
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading class roster...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Student Name</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '180px', color: '#333' }}>Score Entry</th>
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No students assigned to this class.</td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: '500', color: '#333' }}>
                      {getStudentName(student)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          max={maxScore}
                          value={student.score}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          placeholder="0"
                          style={{ width: '80px', padding: '6px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                        />
                        <span style={{ color: '#666', fontSize: '14px' }}>/ {maxScore}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {students && students.length > 0 && (
            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Save Grades to Database
            </button>
          )}
        </form>
      )}
    </div>
    );
};

export default GradebookDashboard;