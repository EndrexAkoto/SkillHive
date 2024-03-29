"use strict";

// Import necessary modules
var express = require('express');

var path = require('path');

var sqlite3 = require('sqlite3').verbose(); // Initialize Express


var app = express(); // Serve static files from the root directory

app.use(express["static"](path.join(__dirname))); // Connect to the SQLite database file

var db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
}); // Parse JSON request bodies

app.use(express.json()); // Route to handle user registration (signup)

app.post('/signup', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      email = _req$body.email,
      password = _req$body.password; // Insert user data into the database

  var sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(sql, [username, email, password], function (err) {
    if (err) {
      console.error('Error inserting user data:', err.message);
      return res.status(500).json({
        message: 'Failed to register user'
      });
    }

    console.log('User registered successfully!'); // Redirect the user to the login page after successful signup

    res.redirect('/login');
  });
}); // Route to handle user login

app.post('/login', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password; // Perform authentication (e.g., check if email/password match)
  // Redirect the user to the dashboard page after successful login

  res.redirect('/dashboard');
}); // Start the server

var PORT = process.env.PORT || 30010;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});