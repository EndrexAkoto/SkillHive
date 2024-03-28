"use strict";

// Import necessary modules
var express = require('express');

var bcrypt = require('bcrypt');

var sqlite3 = require('sqlite3').verbose(); // Initialize Express


var app = express();
app.use(express.json()); // Middleware to parse JSON bodies
// Connect to the SQLite database

var db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, function (err) {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the database.'); // Ensure the users table exists

    db.run("CREATE TABLE IF NOT EXISTS users (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            username TEXT NOT NULL UNIQUE,\n            email TEXT NOT NULL UNIQUE,\n            password TEXT NOT NULL\n        )", function (createErr) {
      if (createErr) {
        console.error('Error creating users table:', createErr.message);
      } else {
        console.log('Users table created successfully.');
      }
    });
  }
}); // User Registration Endpoint

app.post('/register', function _callee(req, res) {
  var _req$body, username, email, password, hashedPassword, sql;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password; // Validate input

          if (!(!username || !email || !password)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            error: "Username, email, and password are required."
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 6:
          hashedPassword = _context.sent;
          sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
          db.run(sql, [username, email, hashedPassword], function (err) {
            if (err) {
              console.error('Error registering user:', err.message);
              return res.status(400).send({
                error: "User already exists with that email."
              });
            }

            res.send({
              message: "User registered successfully!",
              userId: this.lastID
            });
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error registering user:', _context.t0.message);
          res.status(500).send({
            error: "Internal server error."
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); // User Login Endpoint

app.post('/login', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;
  var sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], function _callee2(err, user) {
    var isPasswordValid;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!err) {
              _context2.next = 3;
              break;
            }

            console.error('Error retrieving user:', err.message);
            return _context2.abrupt("return", res.status(400).send({
              error: "Invalid email or password."
            }));

          case 3:
            if (user) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.status(404).send({
              error: "User not found."
            }));

          case 5:
            _context2.next = 7;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 7:
            isPasswordValid = _context2.sent;

            if (isPasswordValid) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.status(401).send({
              error: "Invalid email or password."
            }));

          case 10:
            res.send({
              message: "Login successful!"
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}); // Start the server

var PORT = 3000;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});