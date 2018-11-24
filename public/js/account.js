/* Constants ----------------------------------------------------------*/
const USER_URL = "/api/users"

/* Local storage ------------------------------------------------------*/
let userID = localStorage.getItem('user_id');
let token = localStorage.getItem('token');

/* DOM elements --------------------------------------------------------*/
let formEmail = document.getElementById('formEmail');
let formPass = document.getElementById('formPass');
let formDeleteUser = document.getElementById('formDeleteUser');

/* Event handlers ------------------------------------------------------*/
formEmail.onsubmit = saveEmail;
formPass.onsubmit = savePassword;
formDeleteUser.onsubmit = deleteUser;

/* Functions -----------------------------------------------------------*/
// Loading user data
fetch(USER_URL + `/${userID}`, {
  method: 'GET',
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": token
  }
}).then(response => {
  if (response.status < 400) {
    displayUserInfo(response);
  } else {
    showErrorPopup('User information could not be loaded.');
  }
}).catch(error => console.error(error));


// function to display user info in html
async function displayUserInfo(response) {
  let data = await response.json();
  let username = data[0].username;
  let email = data[0].email;

  let dispUsername = document.getElementById('dispUsername');
  let inEmail = document.getElementById('inEmail');

  dispUsername.innerHTML = `Username: ${username}`;
  inEmail.value = email;
}

// handler for storing email address
async function saveEmail(evt) {
  evt.preventDefault();

  let email = document.getElementById('inEmail').value;
  let data = JSON.stringify({
    user_id: userID,
    email: email
  })

  // request for storing changed email address
  fetch(USER_URL + `/${userID}/email`, {
    method: 'POST',
    headers: {
			"Content-Type": "application/json; charset=utf-8",
      "Authorization": token
		},
    body: data
  }).then(response => {
    if (response.status < 400) { // email is stored
      showConfirmPopup('Email was stored successfully!');
    } else if (response.status === 403) { // not authorized
      showErrorPopup('You are not authorized to change this information.');
    } else {  // something went wrong (on server)
      showErrorPopup('Something went wrong while storing the email, please try again later.');
    }
  }).catch(error => console.error(error));
}


// handler for storing new password
async function savePassword(evt) {
  evt.preventDefault();

  let oldPassword = document.getElementById('inOldPassword').value;
  let newPassword1 = document.getElementById('inNewPassword1').value;
  let newPassword2 = document.getElementById('inNewPassword2').value;

  // confirming new password
  if (newPassword1 !== newPassword2) { // confirmation not passed
    document.getElementById('message').innerHTML = "Your new password and the confirmation of your new password are not the same.";
    document.getElementById('inNewPassword1').value = "";
    document.getElementById('inNewPassword2').value = "";
  } else { // confirmation passed

    let data = JSON.stringify({
      user_id: userID,
      old_password: oldPassword,
      new_password: newPassword2
    })

    // request to server for changing password
    fetch(USER_URL + `/${userID}/pass`, {
      method: 'POST',
      headers: {
  			"Content-Type": "application/json; charset=utf-8",
        "Authorization": token
  		},
      body: data
    }).then(response => {
      if (response.status < 400) { // old password is valid
        document.getElementById('inOldPassword').value = "";
        document.getElementById('inNewPassword1').value = "";
        document.getElementById('inNewPassword2').value = "";
        showConfirmPopup('Your password is changed!');
      } else if (response.status === 400) { // old password is invalid
        document.getElementById('inOldPassword').value = "";
        showErrorPopup('Your old password is incorrect, please try again.');
      } else if (response.status === 403) { // user is not authorized
        document.getElementById('inOldPassword').value = "";
        document.getElementById('inNewPassword1').value = "";
        document.getElementById('inNewPassword2').value = "";
        showErrorPopup('You are not allowed to change this password.');
      } else { // something went wrong (on server)
        document.getElementById('inOldPassword').value = "";
        document.getElementById('inNewPassword1').value = "";
        document.getElementById('inNewPassword2').value = "";
        showErrorPopup('Something went wrong while changing the password, please try again later.');
      }
    }).catch(error => console.error(error));
  }
}

// delete user
async function deleteUser(evt) {
  evt.preventDefault();
  let option;

  if (document.getElementById('radAll').checked) { // check which option is ticked
    option = "0";
  } else {
    option = "1";
  }

  let data = JSON.stringify({
    user_id: userID,
    delete_option: option
  });

  // confirmation of deleting account
  let confirmed = confirm("Are you really sure that you want to delete your user account? \nThis is not reversable!");
  if (confirmed) { // deletion confirmed
    // request to server to delete account
    fetch(USER_URL + `/${userID}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": token
      },
      body: data
    }).then(response => {
      if (response.status < 400) { // user is deleted
        alert("Your user is deleted!");
        location.href = "./index.html";
      } else if (response.status === 403) { // user is not authorized
        showErrorPopup('You are not authorized to delete this user.');
      } else {
        showErrorPopup('Something went wrong while deleting your account, please try again later.');
      }
    }).catch(error => console.error(error));
  }
}
