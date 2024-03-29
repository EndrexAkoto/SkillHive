"use strict";

// db.js
// Import the required SQLite module
var sqlite3 = require('sqlite3').verbose(); // Connect to the SQLite database file


var db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
}); // Export the database connection for use in other files

module.exports = db;