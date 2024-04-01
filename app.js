// Import necessary modules
const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

// Initialize Express
const app = express()

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)))

// Connect to the SQLite database file
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message)
    } else {
        console.log('Connected to the database.')
    }
})

// Parse JSON request bodies
app.use(express.json())

// Route to handle user registration (signup)
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body

    // Insert user data into the database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    db.run(sql, [username, email, password], (err) => {
        if (err) {
            console.error('Error inserting user data:', err.message)
            return res.status(500).json({ message: 'Failed to register user' })
        }
        console.log('User registered successfully!')
        // Redirect the user to the login page after successful signup
        res.redirect('/login')
    })
})

// Route to handle user login
app.post('/login', (req, res) => {
    const { email, password } = req.body

    // Perform authentication (e.g., check if email/password match)

    // Redirect the user to the dashboard page after successful login
    res.redirect('/dashboard')
})

// Start the server
const PORT = process.env.PORT || 30010
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
