let view = document.getElementById('view');
const USER_ROLE = '0';
const CREATE_USER_URL = '/api/user';
const LOGIN_USER_URL = '/api/users/auth';

goToLogin();

function addElementinView(element) {
  view.appendChild(element);
}

function clearView() {
  view.innerHTML = "";
}

function createElementFromTemplate(id) {
  let viewTemplate = document.querySelector(id);
  let clone = document.importNode(viewTemplate.content, true);
  return clone;
}

function goToLogin() {
  clearView();
  addElementinView(createElementFromTemplate("#loginView"));
  document.getElementById('loginForm').onsubmit = loginUser;
}

function goToCreate() {
  clearView();
  addElementinView(createElementFromTemplate("#createUserView"));
  document.getElementById('createUserForm').onsubmit = createUser;
}

async function createUser(evt) {
  evt.preventDefault();

  let data = JSON.stringify({
    username: document.getElementById('inpUserName').value,
    email: document.getElementById('inpEmail').value,
    password: document.getElementById('inpPsw').value,
    role: USER_ROLE
  });

  fetch(CREATE_USER_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {
      console.log('created user!!!! :D');
      handleLogin(response);
    } else {
      console.log('did not create user :(');
    }
  })
  .catch(err => console.error(err));
}

async function loginUser(evt) {
  evt.preventDefault();

  let data = JSON.stringify({
    username: document.getElementById('inpUserName').value,
    password: document.getElementById('inpPsw').value
  });

  fetch(LOGIN_USER_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {
      console.log('login success!!! :D');
      handleLogin(response);
    } else {
      console.log('login did not work :(');
    }
  })
  .catch(err => console.error(err));
}

async function handleLogin(response) {
  let token = response.headers.get('Authorization');
  let data = await response.json();
  localStorage.setItem('user_id', data[0].id);
  localStorage.setItem('token', token);
  location.href = "./personnal.html";
}
