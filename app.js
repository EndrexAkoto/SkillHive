// Import necessary modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Initialize Express
const app = express();

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Connect to the SQLite database file
const dbPath = process.env.DATABASE_PATH || './database.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle user registration (signup)
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [username, email, hashedPassword], (err) => {
        if (err) {
            console.error('Error inserting user data:', err.message);
            return res.status(500).json({ message: 'Failed to register user' });
        }
        console.log('User registered successfully!');
        // Redirect the user to the login page after successful signup
        res.redirect('/login.html'); // Ensure the path matches your file structure
    });
});

// Route to handle user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    // Passwords match
                    console.log('Authentication successful');
                    res.redirect('/dashboard.html'); // Adjust according to your file structure
                } else {
                    // Passwords don't match
                    console.log('Authentication failed');
                    res.status(401).json({ message: 'Authentication failed' });
                }
            });
        } else {
            // No user found
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
