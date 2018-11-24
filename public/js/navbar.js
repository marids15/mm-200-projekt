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
  if (tokentest.length > 12){
  //  console.log("testedtokennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    logedinornot = '<i class="fas fa-power-off" onclick="log_out()"></i>';
  }
  if (evt == 1){a = 'class="active"';}
  if (evt == 2){b = 'class="active"';}
  if (evt == 3){c = 'class="active"';}
  if (evt == 4){d = 'class="active"';}
  if (evt == 5){e = 'class="active"';}
  if (evt == 9){b = 'class="active"';}

  //  Makes the actual navbar
  var navi =  document.createElement("div");
  navi.id = "topnav";
  navi.innerHTML = '<a href="index.html" '+ a +
    '>Home</a><a href="personnal.html" '+ b +
    '>My Presentations</a><a href="OfflinePresentations.html" ' + c +
    '>Offline Presentations</a><a href="account.html" ' + d +
    '>My Account</a><a href="publicPresentations.html" ' + e +
    '>Public Presentations</a>' +
    logedinornot +
    '<i class="fas fa-bars" onclick="expandNavigation()"></i>';
  document.getElementById("top").appendChild(navi);
}

function log_out(){
  //let msg = "offLoged";
  if (activePage == 9){
  storePresentation();
}
  localStorage.setItem("token","offLoged");
  localStorage.setItem("user_id","offLoged");
  //console.log("loggeroffer");
    location.href = "./index.html";
}
