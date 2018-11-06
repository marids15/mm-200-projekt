const NAME = "myP";


//---------------- document.getElementById variables
let indexOfSlide = document.getElementById("indexOfSlide");
let inTxt  = document.getElementById("inTxt");
let inNote = document.getElementById('inNote');
let slideDiv = document.getElementById("slideDiv");
let btnAddPicture = document.getElementById("btnAddPicture");
let btnAddText = document.getElementById("btnAddText");
let btnAddVideo = document.getElementById("btnAddVideo");
let btnAddSound = document.getElementById("btnAddSound");
let btnAddSlide = document.getElementById("btnAddSlide");
let btnNextSlide = document.getElementById("btnNextSlide");
let btnPreviousSlide = document.getElementById("btnPreviousSlide");
let selectorSlide = document.getElementById("selectSlide");
let btnDeleteSlide = document.getElementById("btnDeleteSlide");
let divContainer = document.getElementById("divContainer");


//----------------- presentation object
let myPresentation = new Presentation(NAME, slideDiv);
AddFirstSlide();

//--------------- eventhandlers
inNote.onchange = saveNote;
btnAddPicture.onclick = addImage;
btnAddText.onclick = btnAddTextClick;
btnAddVideo.onclick = addVideo;
btnAddSound.onclick = addSound;
btnDelete.onclick = deleteElement;
btnAddSlide.onclick = AddNewSlide;
btnNextSlide.onclick = goToNextSlide;
btnPreviousSlide.onclick = goToPreviousSlide;
btnDeleteSlide.onclick = DeleteCurrentSlide;
btnDisplayFullScreen.onclick = displayInFullScreen;


//--------------------------------
setInterval("myPresentation.makeDivDraggable()",100);
setInterval("myPresentation.makeDivSelectable()",1000);

// ------------------- function to save note
function saveNote() {
  let noteText = inNote.value;
  myPresentation.getCurrentSlide().setNote(noteText);
}

function updateNote() {
  let noteText = myPresentation.getCurrentSlide().getNote();
  inNote.value = noteText;
}


//-------------------- function to display the number and the total of slide
function displayNumberCurrentSlide() {
  	indexOfSlide.innerHTML = `Slide number ${myPresentation.getCurrentSlideIndex() + 1} (total: ${myPresentation.getSlides().length})`;
}

// updates the options in the slide selector
function updateSlideselector() {
    selectorSlide.innerHTML = "";
    selectorSlide.onchange = selectSlide;
    for (let slide in myPresentation.getSlides()) {
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

//--------------- function to Add text in a slide
function btnAddTextClick() {
  myPresentation.getCurrentSlide().addText(inTxt.value);
  inTxt.value = "";
}

//--------------- function to add image in a slide
function addImage() {
  myPresentation.getCurrentSlide().addImage(inTxt.value);
  inTxt.value = "";
}

// --------------- function to add video to a slide
function addVideo() {
  myPresentation.getCurrentSlide().addVideo(inTxt.value);
  inTxt.value = "";
}

// -------------- function to add sounds to a slide
function addSound() {
  myPresentation.getCurrentSlide().addSound(inTxt.value);
  inTxt.value = "";
}

//--------------- function to go to next slide
function goToNextSlide(){
  myPresentation.goToNextSlide();
  displayNumberCurrentSlide();
  selectOptionInSelector(myPresentation.getCurrentSlideIndex());
  updateNote();
  updateSlideMenu();
}

//--------------- function to go to previous slide
function goToPreviousSlide(){
  myPresentation.goToPreviousSlide();
  displayNumberCurrentSlide();
  selectOptionInSelector(myPresentation.getCurrentSlideIndex());
  updateNote();
  updateSlideMenu();
}

//------------- displays slide by an index
function goToSlide(num) {
  myPresentation.goToSlide(num);
  displayNumberCurrentSlide();
  updateNote();
  updateSlideMenu();
}

//--------------- function to Add a new slide
function AddNewSlide() {
  myPresentation.addSlide(myPresentation.getCurrentSlideIndex() + 1);
  //myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() + 1);
  updateSlideselector();
  goToNextSlide();
  updateSlideMenu();
}

// -------------- function to add the first slide
function AddFirstSlide() {
  myPresentation.setCurrentSlideIndex(0);
  myPresentation.addSlide(0);
  updateSlideselector();
  updateNote();
  updateSlideMenu();
}

//-------------- function to delete current slide
function DeleteCurrentSlide(){
  myPresentation.removeSlidesElement(myPresentation.getCurrentSlideIndex());
  //if we delete the only slide
  if( myPresentation.getSlides().length === 0){
  	myPresentation.cleanContainerDiv();
    AddFirstSlide();
  }
  //if you delete the first slide
  else if (myPresentation.getCurrentSlideIndex() === 0) {
    myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() -1);
    goToNextSlide();
  }

  else {
    goToPreviousSlide();
  }
  updateSlideselector();
  updateSlideMenu();
}

//-------------- function to delete an element
function deleteElement() {
  myPresentation.getCurrentSlide().deleteElement()
}

//--------------- full screen
function displayInFullScreen(){
  divContainer.addEventListener("webkitfullscreenchange", onFullScreenChange, true);
  openFullscreen(divContainer);
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  elem.FScreen = true;
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (elem.exitFullscreen) {
    elem.exitFullscreen();
  } else if (elem.mozCancelFullScreen) { /* Firefox */
    elem.mozCancelFullScreen();
  } else if (elem.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    console.log("ok");
    elem.webkitExitFullscreen();
  } else if (elem.msExitFullscreen) { /* IE/Edge */
    elem.msExitFullscreen();
  }
  console.log(" your browser doesn't support the Fullscreen API");
}

  function onFullScreenChange (e) {
    let element = e.target;
    if (element.FScreen){
      window.addEventListener("keydown", clickKeyArrows, true);
      element.FScreen = false;
      swipedetect(divContainer);
    }

    else{
      window.removeEventListener("keydown", clickKeyArrows, true);
    }
  }

   function clickKeyArrows(event){
    if (event.key === "ArrowLeft"){
        goToPreviousSlide();
    }
    if (event.key === "ArrowRight"){
        goToNextSlide();
    }
  }

  // credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
function swipedetect(el){

    var touchsurface = el,
    startX,
    startY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 1000, // maximum time allowed to travel that distance
    startTime;

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime(); // record time when finger first makes contact with surface
        e.preventDefault();
    }, false)

    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault(); // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        let distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
        let distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
        let elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                (distX < 0)? goToPreviousSlide() : goToNextSlide();
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                console.log("exit");
                closeFullscreen(divContainer);
            }
        }
        e.preventDefault();
    }, false);
}

function updateSlideMenu() {
  let slideMenu = document.getElementById("slideMenu");
  slideMenu.innerHTML = "";
  let listSlide = myPresentation.getSlides();
  for (let i = 0; i < listSlide.length; i++){
    let newDiv = document.createElement("div");
    newDiv.className = "divSlideMenu";
    let copy = listSlide[i].getSlideHTML().cloneNode(true);
    newDiv.appendChild(copy);
    newDiv.addEventListener('click', function() {
            goToSlide(i);
        });

    slideMenu.appendChild(newDiv);
  }
}
