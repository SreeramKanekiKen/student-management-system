const express = require("express");
const cors = require("cors");
const pool = require("./db"); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Modular Routes
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const bcrypt = require('bcryptjs');
console.log('🔑 GENERATED HASH:', bcrypt.hashSync('password123', 10));

app.listen(PORT, () => {
    console.log(`🚀 Server spinning on http://localhost:${PORT}`);
});