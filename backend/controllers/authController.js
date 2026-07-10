const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Authenticate user and get token (Login)
// @route POST /api/auth/login
// @access Public

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if the user exists in the database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length == 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = userResult.rows[0];

        // 2. Verify the password matches the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // 3. Generate a JWT token signed with our secret key (expires in 1 day)
        const token = jwt.sign({
            userId: user.id,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
            }
        });
    }
    catch (err) {
        console.error('Login error: ',err.message);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

module.exports = { loginUser };