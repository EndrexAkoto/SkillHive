const url = 'http://127.0.0.1:2345'
// Register
fetch(`${url}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
    })
  })
  .then(response => {
    return response.message
  })
  .catch(error => {
    console.log(error.message)
    return error.message
  })
  
  // Login
  fetch(`${url}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })
  .then(response => {
    localStrorage.setItem('token', reponse.token)
  })
  .catch(error => {
    console.log(error.message)
    return error.message
  })
  
  // Logout
  fetch(`${url}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    // Handle response
  })
  .catch(error => {
    // Handle error
  })
  