const NAME = "myP";


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


//----------------- presentation object
let myPresentation = new Presentation(NAME, slideDiv);
AddFirstSlide();

//--------------- eventhandlers
btnAddPicture.onclick = addImage;
btnAddText.onclick = btnAddTextClick;
//btnAddVideo.onclick = addVideo;
btnDelete.onclick = deleteElement;
btnAddSlide.onclick = AddNewSlide;
btnNextSlide.onclick = goToNextSlide;
btnPreviousSlide.onclick = goToPreviousSlide;
btnDeleteSlide.onclick = DeleteCurrentSlide;


//--------------------------------
setInterval("myPresentation.makeDivDraggable()",100);
setInterval("myPresentation.makeDivSelectable()",1000);

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

//--------------- function to go to next slide
function goToNextSlide(){
  myPresentation.goToNextSlide();
  displayNumberCurrentSlide();
  selectOptionInSelector(myPresentation.getCurrentSlideIndex());
}

//--------------- function to go to previous slide
function goToPreviousSlide(){
  myPresentation.goToPreviousSlide();
  displayNumberCurrentSlide();
  selectOptionInSelector(myPresentation.getCurrentSlideIndex());
}

//------------- displays slide by an index
function goToSlide(num) {
  myPresentation.goToSlide(num);
  displayNumberCurrentSlide();
}

//--------------- function to Add a new slide
function AddNewSlide() {
  myPresentation.addSlide(myPresentation.getCurrentSlideIndex() + 1);
  //myPresentation.setCurrentSlideIndex(myPresentation.getCurrentSlideIndex() + 1);
  updateSlideselector();
  goToNextSlide();
}

// -------------- function to add the first slide
function AddFirstSlide() {
  myPresentation.setCurrentSlideIndex(0);
  myPresentation.addSlide(0);
  updateSlideselector();
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
}

//-------------- function to delete an element
function deleteElement() {
  myPresentation.getCurrentSlide().deleteElement()
}
