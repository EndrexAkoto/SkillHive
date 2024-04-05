"use strict";

var url = 'http://127.0.0.1:2345'; // Register

fetch("".concat(url, "/api/auth/register"), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  })
}).then(function (response) {
  return response.message;
})["catch"](function (error) {
  console.log(error.message);
  return error.message;
}); // Login

fetch("".concat(url, "/api/auth/login"), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: email,
    password: password
  })
}).then(function (response) {
  localStrorage.setItem('token', reponse.token);
})["catch"](function (error) {
  console.log(error.message);
  return error.message;
}); // Logout

fetch("".concat(url, "/api/auth/logout"), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(function (response) {// Handle response
})["catch"](function (error) {// Handle error
});