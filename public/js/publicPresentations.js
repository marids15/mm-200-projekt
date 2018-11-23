//------------------------- constants
PUBLIC_PRESENTATIONS_URL = "/api/public/presentations";

// ----------------------- DOM elements
let presentations = document.getElementById("presentations");

//-------------------------setup
loadPresentations();
let allPresentations = [];

//-------------------------functions
// loads presentations of user
async function loadPresentations() {
	let userid = localStorage.getItem('user_id');
	fetch(PUBLIC_PRESENTATIONS_URL, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json; charset=utf-8" // Don't need tokens here.
		}
	}).then(response => {
		if (response.status < 400) {
			displayPresentations(response);
		} else if (response.status === 500) {
      showErrorPopup('Could not load public presentations, please try again later.');
    }
	}).catch(err => console.error(err))
}

// Create html elements for displaying presentations
async function displayPresentations(response) {
	let data = await response.json(); // loading data
	presentations.innerHTML = "";

	// create an object for every presentation
	for (let i = 0; i < data.length; i++) {
    let presentation = data[i];
		// container div
		let newP = document.createElement("div");
		newP.id = i;
		newP.className = "presentation";

		// small display of first slide
		let imageP = document.createElement("div");
		imageP.id = i+'image';
		imageP.className = "miniView";
		//imageP.onclick = downloadPresentation;

		// button for downloading presentation
		let buttonDownloadP = document.createElement("button");
		buttonDownloadP.type = "button";
		buttonDownloadP.innerHTML = '<i class="fas fa-file-download"></i>';
    buttonDownloadP.innerHTML += 'Download Presentation';
		buttonDownloadP.className = "buttonDownloadP";
		buttonDownloadP.id = i + 'downloadButton';
		//buttonDownloadP.onclick = downloadPresentation;

		// appending all the elements in the container
		newP.appendChild(imageP);
		newP.appendChild(buttonDownloadP);

		// append the presentation container to the page
		presentations.appendChild(newP);
		// insert the slide image into the presentation
    //getFirstSlideImage(presentation.presentation_json, imageP);
  //let presentations =
    allPresentations.push(parseJSONToPresentation(presentation.presentation_json, imageP));
	}
}
/*
// function for creating image first slide from json
function getFirstSlideImage(myJSON, container) {
	// creating new presentation (only for this displaying)
	let myP = new Presentation(myJSON.presentation.name, container);
	myP.setCurrentSlideIndex(0);
	myP.addSlide(0);
	myP.setTheme(myJSON.presentation.theme);

	// check for empty presentation
	if (myJSON.presentation.slides.length == 0) { // empty presentation
		console.log('empty presentation');
	} else {	// non empty presentation
		// append every element (text, image, video, sound) to presentation
		for (let j = 0; j < myJSON.presentation.slides[0].elements.length; j++){
			if (myJSON.presentation.slides[0].elements[j].typeElement === TEXT){
				myP.getCurrentSlide().addText(myJSON.presentation.slides[0].elements[j].contentElement);
			}
			else if(myJSON.presentation.slides[0].elements[j].typeElement === IMAGE){
				myP.getCurrentSlide().addImage(myJSON.presentation.slides[0].elements[j].contentElement);
			}
			else if(myJSON.presentation.slides[0].elements[j].typeElement === VIDEO){
				myP.getCurrentSlide().addVideo(myJSON.presentation.slides[0].elements[j].contentElement);
			}
			else { // sound
				myP.getCurrentSlide().addSound(myJSON.presentation.slides[0].elements[j].contentElement);
			}

			// set correct position of element
			myP.getSlides()[0].getElements()[j].setAttribute('style', `left: ${myJSON.presentation.slides[0].elements[j].leftPercent}%;
																																 top: ${myJSON.presentation.slides[0].elements[j].topPercent}%`);
		}
	}
}
*/
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

	for (let i = 0; i < slidesArray.length; i++){
		goToSlide(i);
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
	goToSlide(tempCurrentIndex);
  return myJSON;
}

//------------------ load presentation from JSON to presentation class
function parseJSONToPresentation(myJSON, container) {
	//let myclass = JSON.parse(myJSON);
	let myclass = myJSON;

	let myP = new Presentation(myclass.presentation.name, container);
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
    /*
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }*/
    container.innerHTML= "";
    myP.goToSlide(0);
	}
	return myP;
}
