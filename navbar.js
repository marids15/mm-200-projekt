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
