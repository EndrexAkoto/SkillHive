"use strict";

// Import necessary modules
require('dotenv').config();

var express = require('express');

var path = require('path');

var sqlite3 = require('sqlite3').verbose();

var bcrypt = require('bcrypt');

var saltRounds = 10; // Initialize Express

var app = express(); // Serve static files from the root directory

app.use(express["static"](path.join(__dirname))); // Connect to the SQLite database file

var dbPath = process.env.DATABASE_PATH || './database.db';
var db = new sqlite3.Database(dbPath, function (err) {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
}); // Parse JSON and URL-encoded request bodies

app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); // Route to handle user registration (signup)

app.post('/signup', function _callee(req, res) {
  var _req$body, username, email, password, hashedPassword, sql;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(password, saltRounds));

        case 3:
          hashedPassword = _context.sent;
          sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
          db.run(sql, [username, email, hashedPassword], function (err) {
            if (err) {
              console.error('Error inserting user data:', err.message);
              return res.status(500).json({
                message: 'Failed to register user'
              });
            }

            console.log('User registered successfully!'); // Redirect the user to the login page after successful signup

            res.redirect('/login.html'); // Ensure the path matches your file structure
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Route to handle user login

app.post('/login', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;
  var sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], function (err, user) {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({
        message: 'Error logging in'
      });
    }

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          // Passwords match
          console.log('Authentication successful');
          res.redirect('/dashboard.html'); // Adjust according to your file structure
        } else {
          // Passwords don't match
          console.log('Authentication failed');
          res.status(401).json({
            message: 'Authentication failed'
          });
        }
      });
    } else {
      // No user found
      res.status(404).json({
        message: 'User not found'
      });
    }
  });
}); // Start the server

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});