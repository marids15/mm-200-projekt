const CHECK_TOKEN_URL = '/api/users/token';

// checks whether user has valid token, returns boolean
function checkToken() {
  let data = JSON.stringify({
    token: localStorage.getItem('token'),
    userID: localStorage.getItem('user_id')
  })

  fetch(CHECK_TOKEN_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {
      // do nothing (continue with loading pages)
    } else if (response.status == 403) {
      redirectLogin();
    } else {
      redirectLogin();
    }
  }).catch(error => console.error(error));
}

// redirects to login page
function redirectLogin() {
  localStorage.clear();
  alert('You are not logged in, so you do not have access to this page.');
  location.href = "./index.html";
}

// Call authorization function
checkToken();
