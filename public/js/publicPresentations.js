//------------------------- constants
PUBLIC_PRESENTATIONS_URL = "/api/public/presentations";

// ----------------------- DOM elements
let presentations = document.getElementById("presentations");

//-------------------------setup
loadPresentations();
let allPresentations = [];

//-------------------------functions
// loads all public presentations
async function loadPresentations() {
	// request for loading public presentations
	fetch(PUBLIC_PRESENTATIONS_URL, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json; charset=utf-8" // Don't need tokens here.
		}
	}).then(response => {
		if (response.status < 400) { // loading is done
			displayPresentations(response);
		} else if (response.status === 500) { // server error
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
		imageP.onclick = function() {
			downloadPresentation(i);
		}

		// display for name of presentation
		let nameDiv = document.createElement('div');
		let name = document.createElement('h2');
		nameDiv.className = "namePresentation";
		name.innerHTML = presentation.presentation_json.presentation.name;
		nameDiv.appendChild(name);

		// button for downloading presentation
		let buttonDownloadP = document.createElement("button");
		buttonDownloadP.type = "button";
		buttonDownloadP.innerHTML = '<i class="fas fa-file-download"></i>';
    buttonDownloadP.innerHTML += 'Download Presentation';
		buttonDownloadP.className = "buttonDownloadP";
		buttonDownloadP.id = i + 'downloadButton';
		buttonDownloadP.onclick = function() {
			downloadPresentation(i);
		}

		// appending all the elements in the container
		newP.appendChild(imageP);
		newP.appendChild(nameDiv);
		newP.appendChild(buttonDownloadP);

		// append the presentation container to the page
		presentations.appendChild(newP);
		// insert the slide image into the presentation
		myPresentation = parseJSONToPresentation(presentation.presentation_json, imageP);
		allPresentations.push(myPresentation);
		myPresentation.goToSlide(0);
	}
}

//----------------- Function for parsing presentation into JSON
function parsePresentationToJSON(id) {
	myPresentation = allPresentations[id];
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
		myPresentation.goToSlide(i);
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
			myElement.classElement = elementsArray[j].classList.value;
			mySlide.elements.push(myElement);
		}
		myData.presentation.slides.push(mySlide);
	}

	// create json from the objects
	let myJSON = JSON.stringify(myData);
	myPresentation.goToSlide(tempCurrentIndex);
  return myJSON;
}

//------------------ load presentation from JSON to presentation class
function parseJSONToPresentation(myJSON, container) {
	let myclass = myJSON;

	let myP = new Presentation(myclass.presentation.name, container);
	myP.setCurrentSlideIndex(0);
	myP.setTheme(myclass.presentation.theme);

	// for every slide in object create slide
	for(let i = 0; i < myclass.presentation.slides.length; i++){
		myP.setCurrentSlideIndex(i);
		myP.addSlide(i);
		myP.goToSlide(i);

		// for every element in object create element in slide
		for(let j = 0; j < myclass.presentation.slides[i].elements.length; j++){
			if (myclass.presentation.slides[i].elements[j].typeElement === TEXT){
				myP.getCurrentSlide().addText(myclass.presentation.slides[i].elements[j].contentElement);
				myP.getSlides()[i].getElements()[j].className = `${myclass.presentation.slides[i].elements[j].classElement}` ;
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === IMAGE){
				myP.getCurrentSlide().addImage(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[i].elements[j].typeElement === VIDEO){
				myP.getCurrentSlide().addVideo(myclass.presentation.slides[i].elements[j].contentElement);
			}
			else{ // sound element
				myP.getCurrentSlide().addSound(myclass.presentation.slides[i].elements[j].contentElement);
			}

			// set position
			myP.getSlides()[i].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[i].elements[j].leftPercent}%;
																																 top: ${myclass.presentation.slides[i].elements[j].topPercent}%`);
	   // myP.getSlides()[i].getElements()[j].className = `${myclass.presentation.slides[i].elements[j].classElement}` ;
		}

		// set note
		myP.getSlides()[i].setNote(myclass.presentation.slides[i].note);
	}
	return myP;
}

//------------------- Function for exporting presentation
function downloadPresentation (id) {
	let title = `${allPresentations[id].name}.json`;
	let content = parsePresentationToJSON(id); // get json
	saveData(content, title);	// save json as file
}

//------------------ Function for storing the notes into a file
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
