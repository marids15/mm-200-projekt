/* This function expands or closes the menu in smaller screens */
function expandNavigation(evt) {
  let navbar = document.getElementById('topnav');

  if (navbar.className === "navbar") {
    // expands navigation
    navbar.className += " expanded";
  } else {
    // closes navigation
    navbar.className = "navbar";
  }
}
// defining variables for making active part of navbar
var a = "";
var b = "";
var c = "";
var d = "";
var e = "";

// Makes navbar- and handles what is the active element
function MakeNavbar(evt){
  let tokentest = localStorage.getItem("token");
  //console.log(tokentest);
  let logedinornot = "";
  if (tokentest && tokentest.length > 12){
  //  console.log("testedtokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    logedinornot = '<a class="btnLogOff" onclick="logOut()">Log out<i class="fas fa-power-off"></i></a>';
  }
  let isave ="";
  if (evt == 1){a = 'class="active"';}
  if (evt == 2){b = 'class="active"';}
  if (evt == 3){c = 'class="active"';}
  if (evt == 4){d = 'class="active"';}
  if (evt == 5){e = 'class="active"';}
  if (evt == 9){b = 'class="active"'; isave = 'onclick="storePresentation()"';}

  //  Makes the actual navbar
  var navi =  document.createElement("div");
  navi.id = "topnav";
  navi.innerHTML = '<a '+ isave +' href="index.html" '+ a +
    '>Home</a><a '+ isave +' href="personnal.html" '+ b +
    '>My Presentations</a><a '+ isave +' href="OfflinePresentations.html" ' + c +
    '>Offline Presentations</a><a '+ isave +' href="account.html" ' + d +
    '>My Account</a><a '+ isave +' href="publicPresentations.html" ' + e +
    '>Public Presentations</a>' +
    logedinornot +
    '<i class="fas fa-bars iconBurger" onclick="expandNavigation()"></i>';
  document.getElementById("top").appendChild(navi);
}

function logOut(){
  console.log('logging off');
  //let msg = "offLoged";
  if (activePage == 9){
  storePresentation();
}
  localStorage.setItem("token","offLoged");
  localStorage.setItem("user_id","offLoged");
  alert("you have now loged off");
  //console.log("loggeroffer");
    location.href = "./index.html";
}
