
const UPDATE_USER_URL = '/api/update';
const CREATE_USER_URL = '/api/user';
document.getElementById("SaveCredChanges").onclick= UpdateCreds;

//var UserName = document.getElementById("MyUsername").value;
//let UserEmail = document.getElementById("MyEmail").value;
UpdateFields();
function UpdateFields(){
  console.log("updatefields");
  let Username = localStorage.getItem("username");
let Useremail = localStorage.getItem("email");
let useridd = localStorage.getItem("id");
console.log(useridd);
   console.log(Username);
document.getElementById("MyUsername").value = Username;
document.getElementById("MyEmail").value = Useremail;
}
function UpdateCreds (){
  let username = document.getElementById("MyUsername").value;
  console.log(username);
  console.log("saveClicked");
  updateUser();
}

async function updateUser(evt) {
//  evt.preventDefault();
  console.log("updadeUser");
  let data = JSON.stringify({
    username: document.getElementById('MyUsername').value,
  email: document.getElementById('MyEmail').value,
  password: document.getElementById("Passwordinp").value,
  id: localStorage.getItem("id").value,
  role: localStorage.getItem("role").value,
  oldname: localStorage.getItem("username").value,
  oldemail: localStorage.getItem("email").value,
psw: localStorage.getItem("password").value  })
  // password: document.getElementById('inpPsw').value
  //UPDATE "public"."users" SET "username" = 'james2' WHERE "id" = 34 AND "username" LIKE 'james' ESCAPE '#' AND "email" LIKE 'test@mytest.com' ESCAPE '#' AND "password" LIKE '123' ESCAPE '#' AND "role" = 0

  fetch(UPDATE_USER_URL,{
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {
      console.log('update success!!! :D');
  } else {
      console.log('update did not work :(');
    }
  })
//  .catch(error => console.error(error));
}
