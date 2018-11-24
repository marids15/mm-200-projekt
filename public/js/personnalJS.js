//------------------------- constants
CREATE_PRESENTATION_URL = "/api/presentations/new";
PRESENTATIONS_URL = "/api/presentations";

// ----------------------- DOM elements
let formAddPresentation = document.getElementById("formCreatePresentation");
let presentations = document.getElementById("presentations");

//-------------------------button
formAddPresentation.onsubmit = addPresentation;

//-------------------------local storage variables
let token = localStorage.getItem('token');
let userid = localStorage.getItem('user_id');

//-------------------------setup
loadPresentations();


//-------------------------functions
// handles the creation of a new presentation
async function addPresentation(evt) {
	evt.preventDefault();
	let presentationName = document.getElementById('inPresentationName').value;
	let data = JSON.stringify({
		owner: localStorage.getItem('user_id'),
		name: presentationName
	});

	// create new presentation on server side
	fetch(CREATE_PRESENTATION_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		},
		body: data
	}).then(response => {
		if (response.status < 400) { // new presentation is created
			handleNewPresentation(response);
		} else if (response.status === 403) { 	// user not authorized
			showErrorPopup('You are not authorized for creating a presentation.');
		} else {
			showErrorPopup('A new presentation could not be created, please try again later.');
		}
	}).catch(err => console.error(err))
}

// stores response of server and redirects to edit page
async function handleNewPresentation(response) {
	let data = await response.json();
	localStorage.setItem('presentation_id', data[0].id);
	location.href = "./presentation.html";
}

// loads presentations of user
async function loadPresentations() {
	let userid = localStorage.getItem('user_id');
	fetch(PRESENTATIONS_URL + `/${userid}`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		}
	}).then(response => {
		if (response.status < 400) {
			displayPresentations(response);
		}
	}).catch(err => console.error(err))
}

// Create html elements for displaying presentations
async function displayPresentations(response) {
	let data = await response.json(); // loading data
	presentations.innerHTML = "";

	// create an object for every presentation
	for (let presentation of data) {
		// container div
		let newP = document.createElement("div");
		let id = presentation.id;
		newP.id = id;
		newP.className = "presentation";

		// small display of first slide
		let imageP = document.createElement("div");
		imageP.id = id+'image';
		imageP.className = "miniView";
		imageP.onclick = editPresentation;

		// button for deleting presentation
		let buttonDeleteP = document.createElement("button");
		buttonDeleteP.type = "button";
		buttonDeleteP.innerHTML = '<i class="fas fa-trash-alt"></i>';
		buttonDeleteP.className = "buttonDeleteP";
		buttonDeleteP.onclick = deletePresentation;

		// select for choosing sharing option
		let buttonShareP = document.createElement("select");
		buttonShareP.className = "buttonShareP";
		buttonShareP.id = "selectShare" + id;

		// private option
		let optionPrivate = document.createElement("option");
		optionPrivate.value = 0;
		optionPrivate.innerHTML = "Private";
		buttonShareP.appendChild(optionPrivate);

		// public option
		let optionPublic = document.createElement("option");
		optionPublic.value = 1;
		optionPublic.innerHTML = "Public";
		buttonShareP.appendChild(optionPublic);

		// individual option
		let optionIndividual = document.createElement("option");
		optionIndividual.value = 2;
		optionIndividual.innerHTML = "Individual";
		buttonShareP.appendChild(optionIndividual);
		buttonShareP.onchange = updateShareOptions;
		buttonShareP.selectedIndex = (presentation.share_option);

		// button for editing presentation
		let buttonEditP = document.createElement("button");
		buttonEditP.type = "button";
		buttonEditP.innerHTML = '<i class="fas fa-pencil-alt">';
		buttonEditP.className = "buttonEditP";
		buttonEditP.id = id + 'editButton';
		buttonEditP.onclick = editPresentation;

		let nameDiv = document.createElement('div');
		let name = document.createElement('h2');
		nameDiv.className = "namePresentation";
		name.innerHTML = presentation.presentation_json.presentation.name;
		nameDiv.appendChild(name);

		// appending all the elements in the container
		newP.appendChild(imageP);
		newP.appendChild(nameDiv);
		newP.appendChild(buttonDeleteP);
		newP.appendChild(buttonShareP);
		newP.appendChild(buttonEditP);

		// append the presentation container to the page
		presentations.appendChild(newP);
		// insert the slide image into the presentation
		getFirstSlideImage(presentation.presentation_json, imageP);

	}
}

// handles the editing of a presentation
function editPresentation (e) {
	let idText = e.currentTarget.id;
	if (!idText.includes('image') && !idText.includes('edit')) {
		idText = e.currentTarget.parentNode.id;
	}
	idNum = parseInt(idText);
	handlePresentation(idNum);
}

// redirects to edit page
function handlePresentation(presentationId) {
	localStorage.setItem('presentation_id', presentationId);
	location.href = "./presentation.html";
}

// function for deleting presentation
function deletePresentation (e) {
	let id = e.target.parentNode.id;
	let data = JSON.stringify({
		presentation_id: id,
		user_id: userid
	});

	// sending delete request to server
	fetch(PRESENTATIONS_URL + `/${id}`, {
		method: 'DELETE',
		body: data,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		}
	}).then(response => {
		if (response.status < 400) { // presentation is removed
			presentations.removeChild(document.getElementById(id));
			showConfirmPopup('Presentation is removed!');
		} else if (response.status === 403) { 	// user not authorized
			showErrorPopup('You are not authorized for deleting this presentation.');
		} else {
			showErrorPopup('This presentation could not be deleted, please try again later.');
		}
	}).catch(error => console.error(error));
}

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

// function for updating share options
function updateShareOptions(evt) {
	let presentationId = evt.target.parentNode.id;
	let shareOption = document.getElementById('selectShare' + presentationId).value;

	let data = JSON.stringify({
		presentation_id: presentationId,
		user_id: userid,
		share_option: shareOption
	});

	// sending request to server to change the share option
	fetch(PRESENTATIONS_URL + `/${presentationId}/sharing`, {
		method: 'POST',
		body: data,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		}
	}).then(response => {
		if (response.status < 400) { // option updated
			showConfirmPopup('The sharing option is updated to ' + getShareOption(shareOption));
		} else if (response.status === 403) { 	// user not authorized
			showErrorPopup('You are not authorized for setting this shareOption.');
		} else { // other (server) error
			showErrorPopup('The share option could not be set, please try again later.');
		}
	}).catch(error => console.error(error));
}

// function for getting the textual share option
function getShareOption(num) {
	switch (num) {
		case '0':
			return 'private';
			break;
		case '1':
			return 'public';
			break;
		case '2':
			return 'individual';
			break;
		default:
			return num;
	}
}
