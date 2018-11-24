/* DOM objects --------------------------------------------------------------*/
let view = document.getElementById('view');

/* Constants --------------------------------------------------------------*/
const USER_ROLE = '0';
const CREATE_USER_URL = '/api/user';
const LOGIN_USER_URL = '/api/users/auth';

/* setup ------------------------------------------------------------------*/
goToLogin();

/* functions --------------------------------------------------------------*/
// loads login view or signup view in page (from templates)
function addElementinView(element) {
  view.appendChild(element);
}

// empties the page
function clearView() {
  view.innerHTML = "";
}

// creates html from templates
function createElementFromTemplate(id) {
  let viewTemplate = document.querySelector(id);
  let clone = document.importNode(viewTemplate.content, true);
  return clone;
}

// displays login view
function goToLogin() {
  clearView();
  addElementinView(createElementFromTemplate("#loginView"));
  document.getElementById('loginForm').onsubmit = loginUser;
}

// displays signup view
function goToCreate() {
  clearView();
  addElementinView(createElementFromTemplate("#createUserView"));
  document.getElementById('createUserForm').onsubmit = createUser;
}

// function for creating a user
async function createUser(evt) {
  evt.preventDefault();

  let data = JSON.stringify({
    username: document.getElementById('inpUserName').value,
    email: document.getElementById('inpEmail').value,
    password: document.getElementById('inpPsw').value,
    role: USER_ROLE
  });

  // request for creating user
  fetch(CREATE_USER_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {  // user is created
      handleLogin(response);
    } else if (response.status === 403) { // username is already taken
      document.getElementById('signupMessage').innerHTML = 'This username is already taken, choose another one.';
    } else {  // something else is wrong (server)
      showErrorMessage('Something went wrong with creating this user, please try again later.');
    }
  })
  .catch(err => console.error(err));
}

// function for logging in
async function loginUser(evt) {
  evt.preventDefault();

  let data = JSON.stringify({
    username: document.getElementById('inpUserName').value,
    password: document.getElementById('inpPsw').value
  });

  // sending request to server for logging in
  fetch(LOGIN_USER_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) { // credentials were valid
      handleLogin(response);
    } else if (response.status === 401) { // username or password is incorrect
      document.getElementById('loginMessage').innerHTML = 'Username or password is incorrect.';
    } else { // something went wrong (server)
      showErrorMessage('Something went wrong with the login, please try again later.');
    }
  })
  .catch(err => console.error(err));
}

// reroutes to my presentations page and sets user info in localStorage
async function handleLogin(response) {
  let token = response.headers.get('Authorization');
  let data = await response.json();
  localStorage.setItem('user_id', data[0].id);
  localStorage.setItem('token', token);
  location.href = "./personnal.html";
}
