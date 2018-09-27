 //--------------- usefull variables
let numCurrentSlide = 0;

//---------------- array of every div
let listOfSlide = [];

//---------------- document.getElementById variables
let indexOfSlide = document.getElementById("indexOfSlide");

let inTxt  = document.getElementById("inTxt");

let slideDiv = document.getElementById("slideDiv");

let btnAddPicture = document.getElementById("btnAddPicture");
let btnAddText = document.getElementById("btnAddText");
//let btnAddVideo = document.getElementById("btnAddVideo");
let btnAddSlide = document.getElementById("btnAddSlide");
let btnNextSlide = document.getElementById("btnNextSlide");
let btnPreviousSlide = document.getElementById("btnPreviousSlide");
let selectorSlide = document.getElementById("selectSlide");
let btnDeleteSlide = document.getElementById("btnDeleteSlide");

//--------------- eventhandlers
btnAddPicture.onclick = addImage;
btnAddText.onclick = btnAddTextClick;
//btnAddVideo.onclick = addVideo;
btnAddSlide.onclick = AddNewSlide;
btnNextSlide.onclick = goToNextSlide;
btnPreviousSlide.onclick = goToPreviousSlide;
btnDeleteSlide.onclick = DeleteCurrentSlide;

//------------ first slide
AddFirstSlide();

// UGLY ==> need to change that
//------------ lance fct makeDivDraggable every 100ms
//------------  to adapt the size of the div if there is a changing

setInterval("makeDivDraggable(listOfSlide[numCurrentSlide])",100);

//-----------eventlisteners-----------
 window.addEventListener("keydown", clickKeyArrows, true);

 //-------------------- function to display the number and the total of slide
function displayNumberCurrentSlide(){
  indexOfSlide.innerHTML = `Slide number ${numCurrentSlide + 1} (total = ${listOfSlide.length})`;
}

//--------------- function to Add text in a slide
function btnAddTextClick() {
  let cont = listOfSlide[numCurrentSlide];
  let myText = document.createElement("p");

  //myText.contentEditable = true;
  myText.innerHTML = inTxt.value;
  myText.setAttribute( 'class', 'textElementSlide');
 
  cont.appendChild(myText);

  inTxt.value = "";
}


//--------------- function to add image in a slide
function addImage() {
  let cont = listOfSlide[numCurrentSlide];
  let src = inTxt.value;

  let image = document.createElement('img');
  image.src = src;
  image.class = "slideImage";
  //image.onclick = scaleImage;
  image.draggable = false;

  cont.appendChild(image);
  inTxt.value = "";
}

/*// -------------- function add video (TODO!!!!)

function addVideo() {
  let slideDiv = document.getElementById('creationDiv_' + numCurrentSlide);
  let src = inTxt.value + "&output=embed";

  let video = document.createElement('iframe');
  video.src = src;

  slideDiv.appendChild(video);
  inTxt.value = "";

}*/

//--------------- function to Add a new slide
//  /!\ now div has no id 
function AddNewSlide(){
  let myNewDiv = document.createElement("div");
  myNewDiv.setAttribute( 'class', 'creationDiv' );

  listOfSlide.splice(numCurrentSlide + 1, 0, myNewDiv);

  updateSlideselector(listOfSlide.length-1);
  goToNextSlide();
  

}

function AddFirstSlide(){
  let myNewDiv = document.createElement("div");
  myNewDiv.setAttribute( 'class', 'creationDiv' );

  listOfSlide.push(myNewDiv);
  slideDiv.appendChild(myNewDiv);

  updateSlideselector(listOfSlide.length-1);

}

function DeleteCurrentSlide(){
  listOfSlide.splice(numCurrentSlide, 1);
  //if we delete the only slide
  if( listOfSlide.length === 0){
    slideDiv.removeChild(slideDiv.firstChild);
    AddFirstSlide();
  }
  //if you delete the first slide
  else if (numCurrentSlide === 0) {
    numCurrentSlide = -1;
    goToNextSlide();
  }

  else {
    goToPreviousSlide();
  }
  updateSlideselector(listOfSlide.length-1);
}

//-----------------------------------
/*
function goToLastSlide(){
    slideDiv.removeChild(slideDiv.firstChild);
    numCurrentSlide = listOfSlide.length - 1;
    slideDiv.appendChild(listOfSlide[numCurrentSlide]);

    displayNumberCurrentSlide();
    selectOptionInSelector(numCurrentSlide);
}
*/

//-------------------------------------
function goToNextSlide(){
  if (numCurrentSlide + 1 < listOfSlide.length){
    slideDiv.removeChild(slideDiv.firstChild)
    numCurrentSlide++;
    slideDiv.appendChild(listOfSlide[numCurrentSlide]);
  }
  else{
    console.log("Error : it's the last slide!");
  }
  displayNumberCurrentSlide();
  selectOptionInSelector(numCurrentSlide);
}

//-------------------------------------
function goToPreviousSlide(){
  if (numCurrentSlide  === 0){
    console.log("Error : it's the first slide!");
  }
  else{
    slideDiv.removeChild(slideDiv.firstChild);
    numCurrentSlide--;
    slideDiv.appendChild(listOfSlide[numCurrentSlide]);
  }
  displayNumberCurrentSlide();
  selectOptionInSelector(numCurrentSlide);
}


// displays slide by an index
function goToSlide(num) {
  slideDiv.removeChild(slideDiv.firstChild);
  numCurrentSlide = num;
  slideDiv.appendChild(listOfSlide[numCurrentSlide]);

  displayNumberCurrentSlide();
}

// updates the options in the slide selector

function updateSlideselector(num) {
    selectorSlide.innerHTML = "";
    selectorSlide.onchange = selectSlide;
    for (let slide in listOfSlide) {
       let option = document.createElement("option");
       let slideNumber = parseInt(slide, 10) + 1;
       option.innerHTML = `Slide ${slideNumber}`
       option.value = slide;
       selectorSlide.appendChild(option);
    }
}


//displays the current slide number in the selector
function selectOptionInSelector(num) {
    let number = num;
    selectorSlide.selectedIndex = num;
}

// handles the change of the slide selector
function selectSlide() {
    let selectedElement = selectorSlide.value;
    let slideID = parseInt(selectedElement, 10);

    goToSlide(slideID);
}

//--------------------- parameter = the id of the div
//--------------------- every child of the div will be draggable
function makeDivDraggable (nameDiv){
// thanks to https://www.kirupa.com/html5/drag.htm

  let container = nameDiv;
  let activeItem = null;

  let active = false;

  //div position

  let xLeftBox = container.offsetLeft;
  let xRightBox = xLeftBox + container.offsetWidth;
  let yTopBox = container.offsetTop;
  let yBottomBox = yTopBox + container.offsetHeight;

  //console.log(xLeftBox,xRightBox,yTopBox,yBottomBox);

  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("touchmove", drag, false);

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  container.addEventListener("mousemove", drag, false);


  function dragStart(e) {

    if (e.target !== e.currentTarget) {
      active = true;

      // this is the item we are interacting with
      activeItem = e.target;

      if (activeItem !== null) {
        if (!activeItem.xOffset) {
          activeItem.xOffset = 0;
        }

        if (!activeItem.yOffset) {
          activeItem.yOffset = 0;
        }

        if (e.type === "touchstart") {
          activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
          activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
        }
        else {
          activeItem.initialX = e.clientX - activeItem.xOffset;
          //console.log( e.clientX , activeItem.xOffset);
          activeItem.initialY = e.clientY - activeItem.yOffset;
          //console.log( e.clientY , activeItem.yOffset);
        }
      }
    }
  }

  function dragEnd(e) {
    console.log("end");
    if (activeItem !== null) {
      activeItem.initialX = activeItem.currentX;
      activeItem.initialY = activeItem.currentY;
    }

    active = false;
    activeItem = null;
  }

  function drag(e) {
    if (active) {
      if (e.type === "touchmove") {
        e.preventDefault();

        activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
        activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
      }

      else {
        activeItem.currentX = e.clientX - activeItem.initialX;
        activeItem.currentY = e.clientY - activeItem.initialY;
      }

      //check if text stay inside the box
      if ((activeItem.currentX + activeItem.offsetWidth)> xRightBox){
        activeItem.currentX = (container.offsetWidth - activeItem.offsetWidth) ;
      }

      if (activeItem.currentX < xLeftBox ){
        activeItem.currentX = 0;
      }

      if ((activeItem.currentY + activeItem.offsetHeight)> yBottomBox ){
        activeItem.currentY = (container.offsetHeight - activeItem.offsetHeight);
      }

      if (activeItem.currentY < yTopBox ){
        activeItem.currentY = 0;
      }


      activeItem.xOffset = activeItem.currentX;
      activeItem.yOffset = activeItem.currentY;

      setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}
 
 // this works
  function clickKeyArrows(event){

    if (event.key === "ArrowLeft"){
      console.log("gogogog");
        goToPreviousSlide();
    }
    if (event.key === "ArrowRight"){
        goToNextSlide();
    }
}



