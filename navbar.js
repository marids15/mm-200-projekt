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

function addImage(evt) {
  let slideDiv = document.getElementById('slideDiv');
  let txtIn = document.getElementById('inTxt');
  let src = txtIn.value;

  let image = document.createElement('img');
  image.src = src;
  image.class = "slideImage";

  slideDiv.appendChild(image);
  txtIn.value = "";
}
