let view = document.getElementById('view');
const USER_ROLE = '0';
const CREATE_USER_URL = '/api/user';
const LOGIN_USER_URL = '/api/users/auth';

addElementinView(createElementFromTemplate("#loginView"));

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
}

function goToCreate() {
  clearView();
  addElementinView(createElementFromTemplate("#createUserView"));
  document.getElementById('createUserForm').onsubmit = createUser;
}

async function createUser(evt) {
  console.log(1);
  evt.preventDefault();
  console.log(2);

  let data = JSON.stringify({
    username: document.getElementById('inpUserName').value,
    email: document.getElementById('inpEmail').value,
    password: document.getElementById('inpPsw').value,
    role: USER_ROLE
  });

  console.log(data);

  fetch(CREATE_USER_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    console.log(response.status)
    if (response.status < 400) {
      console.log('created user!!!! :D');
    } else {
      console.log('did not create user :(');
    }
  }).then(data => console.log('next'))
  .catch(err => console.err(err));
}



//RegisterBTN.onclick = register;
/*
loginButton.onclick = login;
createNewUser.onclick = newUser;

function login(){
    let USERNAME = document.getElementById("usernameINPUT").value;
let PASSWORD = document.getElementById("passwordINPUT").value;
        console.log(USERNAME, PASSWORD);
    }
    function newUser(){
        document.getElementById("extra1").innerHTML = ` <input class="inputElementclass" type="text" id="passwordINPUT2" placeholder="Repeat password">`;

        document.getElementById("extra2").innerHTML = ` <button class="inputElementclass" id="RegisterBTN">Register</button>`;
      let Username = document.getElementById("usernameINPUT").value ="";
       let Password = document.getElementById("passwordINPUT").value ="";
    }
  function register (){

  }*/
