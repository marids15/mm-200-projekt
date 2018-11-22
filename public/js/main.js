const GET_PRESENTATION_URL = "/api/presentations";
const SAVE_PRESENTATION_URL = "/api/presentations/save";

//---------------- variables from localStorage
let token = localStorage.getItem('token');
let userID = localStorage.getItem('user_id');

//---------------- document.getElementById variables
let indexOfSlide = document.getElementById("indexOfSlide");
let inNote = document.getElementById('inNote');
let slideDiv = document.getElementById("slideDiv");
let btnAddSlide = document.getElementById("btnAddSlide");
let btnDeleteSlide = document.getElementById("btnDeleteSlide");
let divContainer = document.getElementById("divContainer");
let tabContent = document.getElementById('tabContent');

//----------------- retrieving data from db
let data = JSON.stringify({
	presentation_id: localStorage.getItem('presentation_id'),
	user_id: userID
});

let myPresentation;

fetch(GET_PRESENTATION_URL, {
	method: 'POST',
	headers: {
		"Content-Type": "application/json; charset=utf-8",
    "Authorization": token
	},
	body: data
}).then(response => {
	if (response.status < 400) {
		loadPresentation(response);
	} else {
		// TODO: MESSAGE
		console.log('Did not load presentation :(');
	}
}).catch(err => console.error(err));

async function loadPresentation(response) {
	let data = await response.json();
	let presentationJSON = data[0].presentation_json;
	console.log(presentationJSON);
	myPresentation = parseJSONToPresentation(presentationJSON);
	console.log(myPresentation.getSlides().length);
	if (myPresentation.getSlides().length === 0) {
			addFirstSlide();
			console.log("length : " + myPresentation.getSlides().length);
			console.log('Adding first slide...');
	} else {
		console.log('no first slide');
		console.log("length : " + myPresentation.getSlides());
		goToSlide(0);
	}

	//requestAnimationFrame(draggable);
	requestAnimationFrame(selectable);
}
//----------------- presentation object
//let myPresentation = new Presentation(NAME, slideDiv);


//--------------- eventhandlers
inNote.onchange = saveNote;
btnAddSlide.onclick = addNewSlide;
btnDeleteSlide.onclick = deleteCurrentSlide;

//--------------------------------


function draggable(){
	myPresentation.makeDivDraggable();
	requestAnimationFrame(draggable);
}

function selectable(evt){
	myPresentation.makeDivSelectable();
	requestAnimationFrame(selectable);
}

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
  //myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() + 1);
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

  else {
    goToPreviousSlide();
  }
  updateSlideMenu();
}

//-------------- function to delete an element
function deleteElement() {
  myPresentation.getCurrentSlide().deleteElement()
}

//--------------- full screen
async function displayInFullScreen(){
  goToSlide(0);
  divContainer.addEventListener("webkitfullscreenchange", onFullScreenChange, true);
  openFullscreen(divContainer);

  let timedTransitions = document.getElementById("timedTransitions");
  let value = timedTransitions[timedTransitions.selectedIndex].value;
  if(value !== "noTimer"){
    let listSlide = myPresentation.getSlides();
    for (let i = 0; i < listSlide.length - 1; i++){
      await timeout(parseInt(value) * 1000);
      goToNextSlide();
    }
    await timeout(parseInt(value) * 1000);
  }
}

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

// ---------------- Updates the slide scrolling menu
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

//---------------- Links eventhandler on delete button
function activeDeleteElement(){
	let btnDelete = document.getElementById("btnDelete");
	btnDelete.onclick = deleteElement;
}

//----------------- Shows the text tool in the menu
function showTextTool() {
  let textToolTemplate = document.getElementById('textContent');
  let textToolClone = textToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(textToolClone);
  let textTab = document.getElementById('textToolTab');
  makeToolActive(textTab);
  let formEditingText = document.getElementById("formEditingText");
  formEditingText.onsubmit = btnAddTextClick;
  activeDeleteElement();
}

//------------------ Shows the image tool in the menu
function showImageTool() {
  let imageToolTemplate = document.getElementById('imageContent');
  let imageToolClone = imageToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(imageToolClone);
  let imageTab = document.getElementById('imageToolTab');
  makeToolActive(imageTab);
  let formEditingImage = document.getElementById("formEditingImage");
  formEditingImage.onsubmit = addImage;
  activeDeleteElement();
}

//------------------ Shows the video tool in the menu
function showVideoTool() {
  let videoToolTemplate = document.getElementById('videoContent');
  let videoToolClone = videoToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(videoToolClone);
  let videoTab = document.getElementById('videoToolTab');
  makeToolActive(videoTab);
  let formEditingVideo = document.getElementById("formEditingVideo");
  formEditingVideo.onsubmit = addVideo;
  activeDeleteElement();
}

//------------------- Shows the sound tool in the menu
function showSoundTool() {
  let soundToolTemplate = document.getElementById('soundContent');
  let soundToolClone = soundToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(soundToolClone);
  let soundTab = document.getElementById('soundToolTab');
  makeToolActive(soundTab);
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
  let presenterToolTemplate = document.getElementById('presenterContent');
  let presenterToolClone = presenterToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(presenterToolClone);
  let presenterTab = document.getElementById('presenterToolTab');
  makeToolActive(presenterTab);
  let btnDisplayFullScreen = document.getElementById('btnDisplayFullScreen');
	let selectTheme = document.getElementById('selectTheme');
  btnDisplayFullScreen.onclick = displayInFullScreen;
	selectTheme.onchange = changeTheme;
	selectTheme.value = myPresentation.getTheme;
}

//------------------- Shows the exporting tool in the menu
function showExportTool() {
  let exportToolTemplate = document.getElementById('exportContent');
  let exportToolClone = exportToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(exportToolClone);
  let exportTab = document.getElementById('exportToolTab');
  makeToolActive(exportTab);
  let btnSavePresentation = document.getElementById('btnSavePresentation');
  let btnExportNotes = document.getElementById('btnExportNotes');
  btnSavePresentation.onclick = storePresentation;
  btnExportNotes.onclick = exportNote;
}

//------------------ Highlights the active tab in the tab bar
function makeToolActive(elem) {
  let oldActiveElement = document.getElementsByClassName('activeTab')[0];
  if (oldActiveElement) {
      oldActiveElement.classList.remove('activeTab');
  }
  elem.classList.add('activeTab');
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
	console.log(theme);
	myPresentation.setTheme(theme);
	updateSlideMenu();
}

//------------------ Function for creating text out of notes
function exportNote(){
  let title = `${myPresentation.getName()}_Note.txt`;
  let note = "";
  let listSlide = myPresentation.getSlides();
  for (let i = 0; i < listSlide.length; i++){
    note += `Slide ${i+1}`;
    note += '\n\n';
    if (listSlide[i].getNote() !== "Write your notes here"){
      note += listSlide[i].getNote();
      note += '\n\n\n';
    }
  }
  saveData(note,title);
}

//------------------ Function for storing the notes into a file
function saveData(data, filename) {
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = "display: none";
    let blob = new Blob([data], {type: "octet/stream"});
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

//----------------- Function for storing presentation into DB
async function storePresentation() {
  let presentationData = parsePresentationToJSON();
  let data = JSON.stringify({
		presentation_id: localStorage.getItem('presentation_id'),
		owner: localStorage.getItem('user_id'),
		presentation: parsePresentationToJSON()
  });

	fetch(SAVE_PRESENTATION_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		},
		body: data
	}).then(response => {
	if (response.status < 400) {
		console.log('Stored presentation! :D');
		// TODO: MESSAGE
	} else {
		// TODO: MESSAGE
		console.log('Did not store presentation :(');
	}
	}).catch(err => console.error(err));

}

//----------------- Function for parsing presentation into JSON
function parsePresentationToJSON() {
	let myData = {};
	myData.presentation = {
		name : myPresentation.name,
		currentSlideIndex : myPresentation.currentSlideIndex,
		theme: myPresentation.theme
	};
	myData.presentation.slides = [];

	let slidesArray = myPresentation.getSlides();

	for (let i = 0; i < slidesArray.length; i++){
		let mySlide = {};
		mySlide.note = slidesArray[i].getNote();
		mySlide.elements = [];
		let elementsArray = slidesArray[i].getElements();


		for(let j = 0; j < elementsArray.length; j++){
			let myElement = {};
			let container = slidesArray[i].getSlideHTML();

      myElement.topPercent = elementsArray[j].offsetTop * 100 / container.offsetHeight;
      myElement.leftPercent = elementsArray[j].offsetLeft * 100 / container.offsetWidth;
			myElement.typeElement = elementsArray[j].typeElement;
			myElement.contentElement = elementsArray[j].contentElement;

			mySlide.elements.push(myElement);
		}
		myData.presentation.slides.push(mySlide);
	}
	//let myJSON = JSON.stringify(myPresentation);
	let myJSON = JSON.stringify(myData);
  return myJSON;
}

//------------------ load presentation from JSON to presentation class
function parseJSONToPresentation(myJSON) {
	//let myclass = JSON.parse(myJSON);
	let myclass = myJSON;

	let myP = new Presentation(myclass.presentation.name, slideDiv);
	myP.setCurrentSlideIndex(0);
	//myP.addSlide(0);
	myP.setTheme(myclass.presentation.theme);

	for(let i = 0; i < myclass.presentation.slides.length; i++){
		myP.setCurrentSlideIndex(i);
		myP.addSlide(i);
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
			else{
				myP.getCurrentSlide().addSound(myclass.presentation.slides[i].elements[j].contentElement);
			}



			myP.getSlides()[i].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[i].elements[j].leftPercent}%;
																																 top: ${myclass.presentation.slides[i].elements[j].topPercent}%`);

		}
		myP.getSlides()[i].setNote(myclass.presentation.slides[i].note);
	/*	if(i+1 < myclass.presentation.slides.length){
			myP.addSlide(myP.getCurrentSlideIndex()+1);
			myP.goToNextSlide();
		}*/
	}
	return myP;
}
