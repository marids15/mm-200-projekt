//--------------- Constants
const GET_PRESENTATION_URL = "/api/presentations";
const SAVE_PRESENTATION_URL = "/api/presentations/save";

//---------------- variables from localStorage
let token = localStorage.getItem('token');
let userID = localStorage.getItem('user_id');

//---------------- DOM  variables
let indexOfSlide = document.getElementById("indexOfSlide");
let inNote = document.getElementById('inNote');
let slideDiv = document.getElementById("slideDiv");
let btnAddSlide = document.getElementById("btnAddSlide");
let btnDeleteSlide = document.getElementById("btnDeleteSlide");
let divContainer = document.getElementById("divContainer");
let tabContent = document.getElementById('tabContent');

//--------------- eventhandlers
inNote.onchange = saveNote;
btnAddSlide.onclick = addNewSlide;
btnDeleteSlide.onclick = deleteCurrentSlide;

// --------------- Global variables
let myPresentation;

//---------------- Functions
// retrieving data from db
let data = JSON.stringify({
	presentation_id: localStorage.getItem('presentation_id'),
	user_id: userID
});

// request to server for getting presentation
fetch(GET_PRESENTATION_URL, {
	method: 'POST',
	headers: {
		"Content-Type": "application/json; charset=utf-8",
    "Authorization": token
	},
	body: data
}).then(response => { // retrieved presentation
	if (response.status < 400) {
		loadPresentation(response);
	} else { // presentation could not be loaded
		showErrorPopup('Could not load presentation, please try again later.');
	}
}).catch(err => console.error(err));

// loading presentation from response
async function loadPresentation(response) {
	let data = await response.json();
	let presentationJSON = data[0].presentation_json;
	myPresentation = parseJSONToPresentation(presentationJSON);
	// check if presentation has slides
	if (myPresentation.getSlides().length === 0) { // has no slides
		addFirstSlide();
	} else { // has slides
		goToSlide(0);
	}

	// make elements selectable
	requestAnimationFrame(selectable);
}

// function to make elements selectable
function selectable(evt){
	myPresentation.makeDivSelectable();
	requestAnimationFrame(selectable);
}

// function to save note into local presentation
function saveNote() {
  let noteText = inNote.value;
  myPresentation.getCurrentSlide().setNote(noteText);
}

// function to update note from local presentation
function updateNote() {
  let noteText = myPresentation.getCurrentSlide().getNote();
  inNote.value = noteText;
}

//-------------------- function to display the number and the total of slide
function displayNumberCurrentSlide() {
  	indexOfSlide.innerHTML = `Slide number ${myPresentation.getCurrentSlideIndex() + 1} (total: ${myPresentation.getSlides().length})`;
}

//--------------- function to Add text in a slide
function btnAddTextClick(evt) {
  evt.preventDefault();
  let inTxt = document.getElementById('inTxt');
  myPresentation.getCurrentSlide().addText(inTxt.value);
  inTxt.value = "";
}

//--------------- function to add image in a slide
function addImage(evt) {
  evt.preventDefault();
  let inImgSrc = document.getElementById("inImgSrc");
  myPresentation.getCurrentSlide().addImage(inImgSrc.value);
  inImgSrc.value = "";
}

// --------------- function to add video to a slide
function addVideo(evt) {
  evt.preventDefault();
  let inVidSrc = document.getElementById("inVidSrc");
  myPresentation.getCurrentSlide().addVideo(inVidSrc.value);
  inVidSrc.value = "";
}

// -------------- function to add sounds to a slide
function addSound(evt) {
  evt.preventDefault();
  let inSoundSrc = document.getElementById("inSoundSrc");
  myPresentation.getCurrentSlide().addSound(inSoundSrc.value);
  inSoundSrc.value = "";
}

//--------------- function to go to next slide
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

//--------------- function to Add a new slide
function addNewSlide() {
  myPresentation.addSlide(myPresentation.getCurrentSlideIndex() + 1);
  goToNextSlide();
  updateSlideMenu();
}

// -------------- function to add the first slide
function addFirstSlide() {
  myPresentation.setCurrentSlideIndex(0);
  myPresentation.addSlide(0);
  updateNote();
  updateSlideMenu();
}

//-------------- function to delete current slide
function deleteCurrentSlide(){
  myPresentation.removeSlidesElement(myPresentation.getCurrentSlideIndex());
  //if we delete the only slide
  if( myPresentation.getSlides().length === 0){
  	myPresentation.cleanContainerDiv();
    addFirstSlide();
  }
  //if you delete the first slide
  else if (myPresentation.getCurrentSlideIndex() === 0) {
    myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() -1);
    goToNextSlide();
  }
	// if any other slide is deleted
  else {
    goToPreviousSlide();
  }
  updateSlideMenu();
}

//-------------- function to delete an element
function deleteElement() {
  myPresentation.getCurrentSlide().deleteElement();
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

//--------------- function for appending copy of display div / note to a container
function appendChildPresenter(presenter){
  copySlide = divContainer.cloneNode(true);
  copySlide.className = "displayDivContainerCopy";
  presenter.appendChild(copySlide);

  copyNote = inNote.cloneNode(true);
  copyNote.className = "noteDivContainer";
  presenter.appendChild(copyNote);
}

//--------------- function for removing every child of a container
function removeChildPresenter(presenter){
  while (presenter.firstChild) {
      presenter.removeChild(presenter.firstChild);
  }
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

//--------------- display full screen
async function displayInFullScreen(){
  goToSlide(0);
  divContainer.addEventListener("webkitfullscreenchange", onFullScreenChange, true);
  openFullscreen(divContainer);

	// check if timed transition is set to value
  let timedTransitions = document.getElementById("timedTransitions");
  let value = timedTransitions[timedTransitions.selectedIndex].value;
  if (value !== "noTimer") { // timer is set
    let listSlide = myPresentation.getSlides();
    for (let i = 0; i < listSlide.length - 1; i++){
      await timeout(parseInt(value) * 1000);
			// check if still in presentation mode
			if(divContainer.FScreenTimer){ // presentation mode
      	goToNextSlide();
			}
    }
    await timeout(parseInt(value) * 1000); // wait
  }
}

// function for simulating timeout / wait
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function to switch an element to fullscreen */
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
  else { // not in presentation mode: remove eventlisteners
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

// ---------------- Updates the slide scrolling menu
function updateSlideMenu() {
  let slideMenu = document.getElementById("slideMenu");
  slideMenu.innerHTML = "";
  let listSlide = myPresentation.getSlides();

	// for every slide create a new mini div
  for (let i = 0; i < listSlide.length; i++){
    let newDiv = document.createElement("div");
    newDiv.className = "divSlideMenu";
    let copy = listSlide[i].getSlideHTML().cloneNode(true);
    newDiv.appendChild(copy);
    newDiv.addEventListener('click', function() { // when clicked on mini div, go to that slide
      goToSlide(i);
    });
    slideMenu.appendChild(newDiv);
  }
}

//---------------- Links eventhandler on delete button for deleting elements
function activeDeleteElement(){
	let btnDelete = document.getElementById("btnDelete");
	btnDelete.onclick = deleteElement;
}

//----------------- Shows the text tool in the menu
function showTextTool() {
	// get text tool from template to html
  let textToolTemplate = document.getElementById('textContent');
  let textToolClone = textToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(textToolClone);

  let textTab = document.getElementById('textToolTab');
  makeToolActive(textTab); 	// highlight correct tab

	// add eventhandler to form
  let formEditingText = document.getElementById("formEditingText");
  formEditingText.onsubmit = btnAddTextClick;
  activeDeleteElement();
}

//------------------ Shows the image tool in the menu
function showImageTool() {
	// get image tool from template to html
  let imageToolTemplate = document.getElementById('imageContent');
  let imageToolClone = imageToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(imageToolClone);

  let imageTab = document.getElementById('imageToolTab');
  makeToolActive(imageTab);	// highlight correct tab

	// add eventhandler to form
  let formEditingImage = document.getElementById("formEditingImage");
  formEditingImage.onsubmit = addImage;
  activeDeleteElement();
}

//------------------ Shows the video tool in the menu
function showVideoTool() {
	// get video tool from template to html
  let videoToolTemplate = document.getElementById('videoContent');
  let videoToolClone = videoToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(videoToolClone);

  let videoTab = document.getElementById('videoToolTab');
  makeToolActive(videoTab);	// highlight correct tab

	// add eventhandler to form
  let formEditingVideo = document.getElementById("formEditingVideo");
  formEditingVideo.onsubmit = addVideo;
  activeDeleteElement();
}

//------------------- Shows the sound tool in the menu
function showSoundTool() {
	// get sound tool from template to html
  let soundToolTemplate = document.getElementById('soundContent');
  let soundToolClone = soundToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(soundToolClone);

  let soundTab = document.getElementById('soundToolTab');
  makeToolActive(soundTab);	// highlight correct tab

	// add eventhandler to form
  let formEditingSound = document.getElementById("formEditingSound");
  formEditingSound.onsubmit = addSound;
  activeDeleteElement();
}

//------------------- Shows the template tool in the menu
function showTemplateTool() {
	let templateToolTemplate = document.getElementById('templateContent');
	let templateToolClone = templateToolTemplate.content.cloneNode(true);
	tabContent.innerHTML = "";
	tabContent.appendChild(templateToolClone);
	let templateTab = document.getElementById('templateToolTab');
	makeToolActive(templateTab);
	let formTitleTemplate = document.getElementById("formTitleTemplate");
	let formImageTemplate = document.getElementById("formImageTemplate");
	formTitleTemplate.onsubmit = addTitleTemplate;
	formImageTemplate.onsubmit = addImageTemplate;
	activeDeleteElement();
}

//------------------- Shows the presenter tool in the menu
function showPresenterTool() {
	// get presenter tool from template to html
  let presenterToolTemplate = document.getElementById('presenterContent');
  let presenterToolClone = presenterToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(presenterToolClone);

  let presenterTab = document.getElementById('presenterToolTab');
  makeToolActive(presenterTab);	// highlight correct tab

	// add eventhandlers to inputs
  let btnDisplayFullScreen = document.getElementById('btnDisplayFullScreen');
	let btnDisplayPresenterMode = document.getElementById('btnDisplayPresenterMode');
	let selectTheme = document.getElementById('selectTheme');
  btnDisplayFullScreen.onclick = displayInFullScreen;
	btnDisplayPresenterMode.onclick = displayPresenterMode;
	selectTheme.onchange = changeTheme;
	selectTheme.value = myPresentation.getTheme;
}

//------------------- Shows the exporting tool in the menu
function showExportTool() {
	// get export tool from template to html
  let exportToolTemplate = document.getElementById('exportContent');
  let exportToolClone = exportToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(exportToolClone);

  let exportTab = document.getElementById('exportToolTab');
  makeToolActive(exportTab);	// highlight correct tab

	// add eventhandlers to inputs
  let btnSavePresentation = document.getElementById('btnSavePresentation');
  let btnExportNotes = document.getElementById('btnExportNotes');
	let btnExportPresentation = document.getElementById('btnExportPresentation');
  btnSavePresentation.onclick = storePresentation;
  btnExportNotes.onclick = exportNote;
	btnExportPresentation.onclick = exportPresentation;
}

//------------------ Highlights the active tab in the tab bar
function makeToolActive(elem) {
  let oldActiveElement = document.getElementsByClassName('activeTab')[0];
  if (oldActiveElement) { // remove previous highlight
      oldActiveElement.classList.remove('activeTab');
  }
  elem.classList.add('activeTab'); // hightlight correct tab
}

//------------------ Function for inserting title slide template
function addTitleTemplate(evt) {
	// TODO
}

//------------------ Function for inserting image slide template
function addImageTemplate(evt) {
	// TODO
}

//------------------ Changing the theme of the Presentation
function changeTheme(evt) {
	let theme = document.getElementById('selectTheme').value;
	myPresentation.setTheme(theme);
	updateSlideMenu();
}

//------------------ Function for creating text out of notes
function exportNote(){
  let title = `${myPresentation.getName()}_Note.txt`;
  let note = "";
  let listSlide = myPresentation.getSlides();
  for (let i = 0; i < listSlide.length; i++){ // get the notes of every slide
    note += `Slide ${i+1}`;
    note += '\n\n';

		// filter out the standard note
    if (listSlide[i].getNote() !== "Write your notes here"){
      note += listSlide[i].getNote();
      note += '\n\n\n';
    }
  }

	// create a file out of this data
  saveData(note,title);
}

//------------------- Function for exporting presentation
function exportPresentation () {
	let title = `${myPresentation.name}.json`;
	let content = parsePresentationToJSON();

	// create a file out of this data
	saveData(content, title);
}
//------------------ Function for storing data into a file
function saveData(data, filename) {
	// create a temporary element
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = "display: none";

	// create a file
  let blob = new Blob([data], {type: "octet/stream"});
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
	// simulate click on temporary element to download file
  a.click();

	// remove temporary element
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

//----------------- Function for storing presentation into DB
async function storePresentation() {
	// get json from presentation
  let presentationData = parsePresentationToJSON();
  let data = JSON.stringify({
		presentation_id: localStorage.getItem('presentation_id'),
		owner: localStorage.getItem('user_id'),
		presentation: parsePresentationToJSON()
  });

	// request for saving presentation
	fetch(SAVE_PRESENTATION_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		},
		body: data
	}).then(response => {
		if (response.status < 400) { // presentation stored
			showConfirmPopup('Presentation is saved!');
		} else if (response.status === 403) { // user not authorized
			showErrorPopup('You are not authorized to save this presentation.');
		} else {	// something else is wrong (server)
			showErrorPopup('Presentation could not be stored, please try again later.');
		}
	}).catch(err => console.error(err));
}

//----------------- Function for parsing presentation into JSON
function parsePresentationToJSON() {
	let tempCurrentIndex = myPresentation.getCurrentSlideIndex();
	let myData = {};
	myData.presentation = {
		name : myPresentation.name,
		currentSlideIndex : myPresentation.currentSlideIndex,
		theme: myPresentation.theme
	};
	myData.presentation.slides = [];

	let slidesArray = myPresentation.getSlides();

	// for every slide create object
	for (let i = 0; i < slidesArray.length; i++){
		goToSlide(i);
		let mySlide = {};
		mySlide.note = slidesArray[i].getNote();
		mySlide.elements = [];
		let elementsArray = slidesArray[i].getElements();

		// for every element create object
		for(let j = 0; j < elementsArray.length; j++){
			let myElement = {};
			let container = slidesArray[i].getSlideHTML();

			// set coordinates
      myElement.topPercent = elementsArray[j].offsetTop * 100 / container.offsetHeight;
      myElement.leftPercent = elementsArray[j].offsetLeft * 100 / container.offsetWidth;

			// set type and content
			myElement.typeElement = elementsArray[j].typeElement;
			myElement.contentElement = elementsArray[j].contentElement;

			mySlide.elements.push(myElement);
		}
		myData.presentation.slides.push(mySlide);
	}

	// create json from the objects
	let myJSON = JSON.stringify(myData);
	goToSlide(tempCurrentIndex);
  return myJSON;
}

//------------------ load presentation from JSON to presentation class
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
			if (myclass.presentation.slides[i].elements[j].typeElement === TEXT){ // is text element
				myP.getCurrentSlide().addText(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === IMAGE){ // is image element
				myP.getCurrentSlide().addImage(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === VIDEO){ // is video element
				myP.getCurrentSlide().addVideo(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else{ // is sound element
				myP.getCurrentSlide().addSound(myclass.presentation.slides[i].elements[j].contentElement);
			}

			// set position
			myP.getSlides()[i].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[i].elements[j].leftPercent}%;
																																 top: ${myclass.presentation.slides[i].elements[j].topPercent}%`);
		}

		// set note
		myP.getSlides()[i].setNote(myclass.presentation.slides[i].note);
	}
	return myP;
}
