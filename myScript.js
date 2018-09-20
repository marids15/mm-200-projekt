//--------------- usefull variable
let numCurrentSlide = 0;

//---------------- my array of every div
let listOfSlide = [];

//---------------- document.getElementById variable
let indexOfSlide = document.getElementById("indexOfSlide");

let inTxt  = document.getElementById("inTxt");

let slideDiv = document.getElementById("slideDiv");

let btnAddText    = document.getElementById("btnAddText");
let btnAddSlide = document.getElementById("btnAddSlide"); 
let btnNextSlide = document.getElementById("btnNextSlide");
let btnPreviousSlide = document.getElementById("btnPreviousSlide");

//--------------- add onclik function to button   
btnAddText.onclick = btnAddTextClick;
btnAddSlide.onclick = AddNewSlide;
btnNextSlide.onclick = goToNextSlide;
btnPreviousSlide.onclick = goToPreviousSlide;

//------------ first slide
AddNewSlide();

// UGLY ==> need to change that
//------------ lance fct makeDivDraggable every 100ms
//------------  to adapt the size of the div if there is a changing

//setInterval("makeDivDraggable(listOfSlide[numCurrentSlide].id)",100);


//-------------------- function to display the number and the total of slide
function displayNumberCurrentSlide(){
  indexOfSlide.innerHTML = `Slide number ${numCurrentSlide + 1} (total = ${listOfSlide.length})`;
}
    
//--------------- function to Add text in a slide
function btnAddTextClick() {
  let cont = document.getElementById("creationDiv_" + numCurrentSlide);
  let myText = document.createElement("div");
  //myText.innerHTML = `<p contentEditable=true>${inTxt.value}</p>`;
  myText.innerHTML = inTxt.value;
  myText.setAttribute( 'class', 'AddingElement');
  myText.id = `text${cont.childElementCount}ofDiv${numCurrentSlide}`;

  cont.appendChild(myText);

  inTxt.value = "";
}

//--------------- function to Add a new slide
function AddNewSlide(){
  let myNewDiv = document.createElement("div");
  myNewDiv.id = "creationDiv_" + listOfSlide.length;
  myNewDiv.setAttribute( 'class', 'creationDiv' );

  slideDiv.appendChild(myNewDiv);
  listOfSlide.push(myNewDiv);

  makeDivDraggable(myNewDiv.id);

  goToLastSlide();
}

//-----------------------------------
function goToLastSlide(){
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "none";
    numCurrentSlide = listOfSlide.length - 1;
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "block";

    displayNumberCurrentSlide();
}

//-------------------------------------
function goToNextSlide(){
  if (numCurrentSlide + 1 < listOfSlide.length){
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "none";
    numCurrentSlide++;
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "block";
  }
  else{
    console.log("Error : it's the last slide!");
  }
  displayNumberCurrentSlide();
}

//-------------------------------------
function goToPreviousSlide(){
  if (numCurrentSlide  === 0){
    console.log("Error : it's the first slide!");
  }
  else{
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "none";
    numCurrentSlide--;
    document.getElementById("creationDiv_" + numCurrentSlide).style.display = "block";
  }
  displayNumberCurrentSlide();
}


//--------------------- parameter = the id of the div 
//--------------------- every child of the div will be draggable
function makeDivDraggable (nameDiv){
// thanks to https://www.kirupa.com/html5/drag.htm

  let container = document.getElementById(nameDiv);
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