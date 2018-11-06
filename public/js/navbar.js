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
// Makes navbar- and handles what is the active element
function MakeNavbar(evt){
  if (evt == 1){a = 'class="active"';}
  if (evt == 2){b = 'class="active"';}
  if (evt == 3){c = 'class="active"';}
  //  Makes the actual navbar
  var navi =  document.createElement("div");
  navi.id = "topnav";
  navi.innerHTML = '<a href="index.html" '+a+' >Home</a><a href="personnal.html" '+b+' >My presentations</a><a href="my_account.html" '+c+'>My account</a><i class="fas fa-bars" onclick="expandNavigation()"></i>';
  document.getElementById("top").appendChild(navi);
}
