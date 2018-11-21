const USER_URL = "/api/users"

let userID = localStorage.getItem('user_id');
let formEmail = document.getElementById('formEmail');
let formPass = document.getElementById('formPass');
let formDeleteUser = document.getElementById('formDeleteUser');
formEmail.onsubmit = saveEmail;
formPass.onsubmit = savePassword;
formDeleteUser.onsubmit = deleteUser;

// Loading user data
fetch(USER_URL + `/${userID}`, {
  method: 'GET',
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
}).then(response => {
  if (response.status < 400) {
    console.log('Got the account!')
    displayUserInfo(response);
  } else {
    console.log('Did not load the presentation :(')
  }
}).catch(error => console.error(error));


// function to display user info in html
async function displayUserInfo(response) {
  let data = await response.json();
  console.log(data);
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

  fetch(USER_URL + `/${userID}/email`, {
    method: 'POST',
    headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
    body: data
  }).then(response => {
    if (response.status < 400) {
      console.log("Email saved :)");
      // todo: give message that it was changed successfully.
    } else {
      console.log("Did not save email :(");
    }
  }).catch(error => console.error(error));
}


// handler for storing new password
async function savePassword(evt) {
  evt.preventDefault();

  let oldPassword = document.getElementById('inOldPassword').value;
  let newPassword1 = document.getElementById('inNewPassword1').value;
  let newPassword2 = document.getElementById('inNewPassword2').value;
  console.log('Old password: ' + oldPassword);
  console.log('New pasword 1 : ' + newPassword1);
  console.log('New password 2: ' + newPassword2);

  // confirming new password
  if (newPassword1 !== newPassword2) {
    document.getElementById('message').innerHTML = "The confirmation of your new password is invalid. Imbecile.";
    document.getElementById('inNewPassword1').value = "";
    document.getElementById('inNewPassword2').value = "";
  } else {

    let data = JSON.stringify({
      user_id: userID,
      old_password: oldPassword,
      new_password: newPassword2
    })
    fetch(USER_URL + `/${userID}/pass`, {
      method: 'POST',
      headers: {
  			"Content-Type": "application/json; charset=utf-8"
  		},
      body: data
    }).then(response => {
      if (response.status < 400) {
        console.log('Password changed!');
      } else {
        console.log('Password not changed :(');
      }
    }).catch(error => console.error(error));
  }
}

// delete user
async function deleteUser(evt) {
  evt.preventDefault();
  let option;

  if (document.getElementById('radAll').checked) {
    option = "0";
  } else {
    option = "1";
  }

  console.log(option);

  let data = JSON.stringify({
    user_id: userID,
    delete_option: option
  });

  let confirmed = confirm("Are you really sure that you want to delete your user account? This is not reversable!");
  if (confirmed) {
    fetch(USER_URL + `/${userID}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: data
    }).then(response => {
      if (response.status < 400) {
        console.log('user deleted');
        alert("Your user is deleted!");
        location.href = "./index.html";
      } else {
        console.log('user not deleted :(');
      }

    }).catch(error => console.error(error));
  }
}
