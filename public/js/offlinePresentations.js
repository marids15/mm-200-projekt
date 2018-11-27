/* Global variables --------------------------------*/
let myPresentation;

/* DOM variables --------------------------------------*/
let slideDiv = document.getElementById("slideDiv");
let indexOfSlide = document.getElementById("indexOfSlide");
let inNote = document.getElementById('inNote');
let divContainer = document.getElementById("divContainer");
let inFile = document.getElementById('inFile');
let btnPlayPresentation = document.getElementById('btnPlayPresentation');
let btnPlayPresenterMode = document.getElementById('btnPlayPresenterMode');

//--------------- eventhandlers
inFile.onchange = readFile;
btnPlayPresentation.onclick = displayInFullScreen;
btnPlayPresenterMode.onclick = displayPresenterMode;

// function that reads a file
function readFile(evt) {
  let reader = new FileReader();
  reader.onload = loadPresentation;
  reader.readAsText(evt.target.files[0]);
}

// function to display presentation from file
function loadPresentation(evt) {
  let txtPresentation = evt.target.result;
  let jsonPresentation = JSON.parse(txtPresentation);
  myPresentation = parseJSONToPresentation(jsonPresentation);
  goToSlide(0);
}

// ---------------- Updates the slide scrolling menu
function updateSlideMenu() {
  let slideMenu = document.getElementById("slideMenu");
  slideMenu.innerHTML = "";
  let listSlide = myPresentation.getSlides();

  // for every slide create a new mini div
  for (let i = 0; i < listSlide.length; i++){
    let newDiv = document.createElement("div");
    newDiv.className = "divSlideMenu";
    if (myPresentation.getCurrentSlideIndex() == i){
			newDiv.className += ' activeSlide';
		}
    let copy = listSlide[i].getSlideHTML().cloneNode(true);
    newDiv.appendChild(copy);
    newDiv.addEventListener('click', function() { // when clicked on mini div, go to that slide
      goToSlide(i);
    });
    slideMenu.appendChild(newDiv);
  }
}

// ------------------- load presentation from json to presentation
function parseJSONToPresentation(myJSON) {
	let myclass = myJSON;

	let myP = new Presentation(myclass.presentation.name, slideDiv);
	myP.setCurrentSlideIndex(0);
	myP.setTheme(myclass.presentation.theme);

  // for every slide in object create slide
	for(let i = 0; i < myclass.presentation.slides.length; i++){
		myP.setCurrentSlideIndex(i);
		myP.addSlide(i);

    // for every element in object create element in slide
		for(let j = 0; j < myclass.presentation.slides[i].elements.length; j++){
			if (myclass.presentation.slides[i].elements[j].typeElement === TEXT){
				myP.getCurrentSlide().addText(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === IMAGE){
				myP.getCurrentSlide().addImage(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === VIDEO){
				myP.getCurrentSlide().addVideo(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else { // sound element
				myP.getCurrentSlide().addSound(myclass.presentation.slides[i].elements[j].contentElement);
			}

      // set position
			myP.getSlides()[i].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[i].elements[j].leftPercent}%;
																																 top: ${myclass.presentation.slides[i].elements[j].topPercent}%`);
      myP.getSlides()[i].getElements()[j].className = `${myclass.presentation.slides[i].elements[j].classElement}` ;
    }

    // set note
		myP.getSlides()[i].setNote(myclass.presentation.slides[i].note);
	}
	return myP;
}

//--------------- full screen
async function displayInFullScreen(){
  goToSlide(0);
  divContainer.addEventListener("webkitfullscreenchange", onFullScreenChange, true);
  openFullscreen(divContainer);

  // check if timed transition is set to value
  let timedTransitions = document.getElementById("timedTransitions");
  let value = timedTransitions[timedTransitions.selectedIndex].value;
  if (value !== "noTimer") {  // timer is set
    let listSlide = myPresentation.getSlides();
    for (let i = 0; i < listSlide.length - 1; i++){
      await timeout(parseInt(value) * 1000);
      // check if still in presentation mode
      if (divContainer.FScreenTimer) {  // presentation mode
        goToNextSlide();
      }
    }
    await timeout(parseInt(value) * 1000);
  }
}

// function for simulating timeout / wait
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  elem.FScreenTimer = true;
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

// function to append eventlisteners to arrow keys, and removes them when not in presentation mode
function onFullScreenChange (e) {
  let element = e.target;
  if (element.FScreen){ // in presentation mode: add eventlisteners
    window.addEventListener("keydown", clickKeyArrows, true);
    element.FScreen = false;
    swipedetect(divContainer, 'presentation');
  }

  else {  // not in presentation mode: remove eventlisteners
    window.removeEventListener("keydown", clickKeyArrows, true);
    element.FScreenTimer = false;
  }
}

// function to switch slides in presentation mode with arrow keys
function clickKeyArrows(event){
  if (event.key === "ArrowLeft"){
    goToPreviousSlide();
  }
  if (event.key === "ArrowRight"){
    goToNextSlide();
  }
}

// function for detecting swipes on mobile devices on full screen mode
function swipedetect(el, mode){

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
					if(mode === "presentation"){
						(distX < 0)? goToPreviousSlide() : goToNextSlide();
					}
					else if (mode === 'presenter'){
						let presenter = document.getElementById('presenterDiv');
						if(distX < 0){
							goToPreviousSlide();
							removeChildPresenter(presenter);
							appendChildPresenter(presenter);
						}else{
							goToNextSlide();
							removeChildPresenter(presenter);
							appendChildPresenter(presenter);                }
						}
          }
          else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
            console.log("exit");
          }
      }
      e.preventDefault();
    }, false);
}

// function to update note from local presentation
function updateNote() {
  let noteText = myPresentation.getCurrentSlide().getNote();
  inNote.value = noteText;
}

// -------------- function to go to next slide
function goToNextSlide(){
  myPresentation.goToNextSlide();
  displayNumberCurrentSlide();
  updateNote();
  updateSlideMenu();
}

//--------------- function to go to previous slide
function goToPreviousSlide(){
  myPresentation.goToPreviousSlide();
  displayNumberCurrentSlide();
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

//-------------------- function to display the number and the total of slide
function displayNumberCurrentSlide() {
  	indexOfSlide.innerHTML = `Slide number ${myPresentation.getCurrentSlideIndex() + 1} (total: ${myPresentation.getSlides().length})`;
}

//--------------- function for removing every child of a container
function removeChildPresenter(presenter){
  while (presenter.firstChild) {
      presenter.removeChild(presenter.firstChild);
  }
}

// function to append eventlisteners to arrow keys, and removes them when not in presentermode
function onFullScreenChangePresenter (e) {
  let element = e.target;
  if (element.FScreen){ // append eventlisteners (now in presentermode)
    window.addEventListener("keydown", clickKeyArrowsPresenter, true);
    element.FScreen = false;
    swipedetect(element, 'presenter');
  }
  else{ // remove eventlisteners (not in presenter mode anymore)
    window.removeEventListener("keydown", clickKeyArrowsPresenter, true);
    document.body.removeChild(element);
  }
}

// function to switch slides in presentermode with arrow keys
function clickKeyArrowsPresenter(event){
  let presenter = document.getElementById("presenterDiv");
  if (event.key === "ArrowLeft"){
      goToPreviousSlide();
      removeChildPresenter(presenter);
      appendChildPresenter(presenter);
  }
  if (event.key === "ArrowRight"){
      goToNextSlide();
      removeChildPresenter(presenter);
      appendChildPresenter(presenter);
  }
}

//--------------- function for appending copy of display div / note to a container
function appendChildPresenter(presenter){
  copySlide = divContainer.cloneNode(true);
  copySlide.className = "displayDivContainerCopy";
  presenter.appendChild(copySlide);

  copyNote = inNote.cloneNode(true);
  copyNote.className = "noteDivContainer";
  presenter.appendChild(copyNote);
}


//---------------- function to display presentation in presenter mode
async function displayPresenterMode() {
	goToSlide(0);

	// creating temporary div
  let presenter = document.createElement('div');
  presenter.id = "presenterDiv";

	// appending copy of displaying slide and notes to container div
  appendChildPresenter(presenter);
  document.body.appendChild(presenter);

  presenter.addEventListener("webkitfullscreenchange", onFullScreenChangePresenter, true);

  openFullscreen(presenter);

	// checking if timed transition is set to a value
  let timedTransitions = document.getElementById("timedTransitions");
  let value = timedTransitions[timedTransitions.selectedIndex].value;
  if (value !== "noTimer"){ // a timer is set
    let listSlide = myPresentation.getSlides();
    for (let i = 0; i < listSlide.length - 1; i++){
      await timeout(parseInt(value) * 1000); // wait
			// check if we are still in presenter mode
      if(presenter.FScreenTimer){ // presenter mode
        goToNextSlide();	// change slide
        removeChildPresenter(presenter);
        appendChildPresenter(presenter);
      }
    }
    await timeout(parseInt(value) * 1000);
  }
}
