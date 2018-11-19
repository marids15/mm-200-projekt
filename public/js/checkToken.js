const CHECK_TOKEN_URL = '/api/users/token';

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
      console.log('token is valid!');
    } else if (response.status == 403) {
      console.log('token is invalid!');
    } else {
      console.log(console.error(response.status));
    }
  })
}
