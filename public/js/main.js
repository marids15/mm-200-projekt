const NAME = "myP";


//---------------- document.getElementById variables
let indexOfSlide = document.getElementById("indexOfSlide");
//let inTxt  = document.getElementById("inTxt");
let inNote = document.getElementById('inNote');
let slideDiv = document.getElementById("slideDiv");
//let btnAddPicture = document.getElementById("btnAddPicture");
//let btnAddText = document.getElementById("btnAddText");
//let btnAddVideo = document.getElementById("btnAddVideo");
//let btnAddSound = document.getElementById("btnAddSound");
let btnAddSlide = document.getElementById("btnAddSlide");
let btnDeleteSlide = document.getElementById("btnDeleteSlide");
let divContainer = document.getElementById("divContainer");
let tabContent = document.getElementById('tabContent');


//----------------- presentation object
let myPresentation = new Presentation(NAME, slideDiv);
AddFirstSlide();

//--------------- eventhandlers
inNote.onchange = saveNote;
//btnAddPicture.onclick = addImage;
//btnAddText.onclick = btnAddTextClick;
//btnAddVideo.onclick = addVideo;
//btnAddSound.onclick = addSound;
//btnDelete.onclick = deleteElement;
btnAddSlide.onclick = AddNewSlide;
btnDeleteSlide.onclick = DeleteCurrentSlide;
//btnDisplayFullScreen.onclick = displayInFullScreen;


//--------------------------------
requestAnimationFrame(draggable);
requestAnimationFrame(selectable);

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
function AddNewSlide() {
  myPresentation.addSlide(myPresentation.getCurrentSlideIndex() + 1);
  //myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() + 1);
  goToNextSlide();
  updateSlideMenu();
}

// -------------- function to add the first slide
function AddFirstSlide() {
  myPresentation.setCurrentSlideIndex(0);
  myPresentation.addSlide(0);
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

function activeDeleteElement(){
	let btnDelete = document.getElementById("btnDelete");
	btnDelete.onclick = deleteElement;
}

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

function showPresenterTool() {
  let presenterToolTemplate = document.getElementById('presenterContent');
  let presenterToolClone = presenterToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(presenterToolClone);
  let presenterTab = document.getElementById('presenterToolTab');
  makeToolActive(presenterTab);
  let btnDisplayFullScreen = document.getElementById('btnDisplayFullScreen');
  btnDisplayFullScreen.onclick = displayInFullScreen;
}

function showExportTool() {
  let exportToolTemplate = document.getElementById('exportContent');
  let exportToolClone = exportToolTemplate.content.cloneNode(true);
  tabContent.innerHTML = "";
  tabContent.appendChild(exportToolClone);
  let exportTab = document.getElementById('exportToolTab');
  makeToolActive(exportTab);
  let btnExportNotes = document.getElementById('btnExportNotes');
  btnExportNotes.onclick = exportNote;
}

function makeToolActive(elem) {
  let oldActiveElement = document.getElementsByClassName('activeTab')[0];
  if (oldActiveElement) {
      oldActiveElement.classList.remove('activeTab');
  }
  elem.classList.add('activeTab');
}

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
