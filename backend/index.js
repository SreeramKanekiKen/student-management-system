const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Health check Route
app.get('/api/health', async (req, res) => {
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
        res.status(500).json({
            status: 'error',
            message: 'Database unreachable'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server spinning on http://localhost:${PORT}`);
});