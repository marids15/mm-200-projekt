//------------------------- constants
CREATE_PRESENTATION_URL = "/api/presentations/new";
PRESENTATIONS_URL = "/api/presentations";

let formAddPresentation = document.getElementById("formCreatePresentation");
let presentations = document.getElementById("presentations");

//-------------------------button
formAddPresentation.onsubmit = addPresentation;

//-------------------------local storage variables
let token = localStorage.getItem('token');
let userid = localStorage.getItem('user_id');

//-------------------------variable
let nbPresentation;


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

	fetch(CREATE_PRESENTATION_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		},
		body: data
	}).then(response => {
		if (response.status < 400) {
			handlePresentation(response);
		} else {
			// TODO: MESSAGE
			console.log('Did not create presentation :(');
		}
	}).catch(err => console.error(err))
}

// stores response of server and redirects to edit page
async function handlePresentation(response) {
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
		} else {
			// TODO: MESSAGE
			console.log('Did not load presentation :(');
		}
	}).catch(err => console.error(err))
}

async function displayPresentations(response) {
	let data = await response.json();
	presentations.innerHTML = "";
	for (let presentation of data) {
		console.log(presentation);
		let newP = document.createElement("div");
		let id = presentation.id;
		newP.id = id;
		newP.className = "presentation";
		nbPresentation++;

		let imageP = document.createElement("div");
		imageP.className = "miniView";
		imageP.onclick = editPresentation;


		let buttonDeleteP = document.createElement("button");
		buttonDeleteP.type = "button";
		buttonDeleteP.innerHTML = "Delete";
		buttonDeleteP.className = "buttonDeleteP";
		buttonDeleteP.onclick = deletePresentation;

		let buttonShareP = document.createElement("select");
		buttonShareP.className = "buttonShareP";
		buttonShareP.id = "selectShare" + id;

		let optionPrivate = document.createElement("option");
		optionPrivate.value = 0;
		optionPrivate.innerHTML = "Private";
		buttonShareP.appendChild(optionPrivate);

		let optionPublic = document.createElement("option");
		optionPublic.value = 1;
		optionPublic.innerHTML = "Public";
		buttonShareP.appendChild(optionPublic);

		let optionIndividual = document.createElement("option");
		optionIndividual.value = 2;
		optionIndividual.innerHTML = "Individual";
		buttonShareP.appendChild(optionIndividual);
		buttonShareP.onchange = updateShareOptions;
		buttonShareP.selectedIndex = (presentation.share_option);

		let buttonPresenterP = document.createElement("button");
		buttonPresenterP.type = "button";
		buttonPresenterP.innerHTML = "Presenter Mode";
		buttonPresenterP.className = "buttonPresenterP";

		let buttonEditP = document.createElement("button");
		buttonEditP.type = "button";
		buttonEditP.innerHTML = "EDIT PRESENTATION";
		buttonEditP.className = "buttonEditP";

		newP.appendChild(imageP);
		newP.appendChild(buttonDeleteP);
		newP.appendChild(buttonShareP);
		newP.appendChild(buttonPresenterP);
		newP.appendChild(buttonEditP);

		presentations.appendChild(newP);
		getFirstSlideImage(presentation.presentation_json, imageP);

	}
}


function editPresentation (e) {
	let id = e.target;
	console.log("editing... " + id );
}

function deletePresentation (e) {
	let id = e.target.parentNode.id;
	console.log(userid);
	let data = JSON.stringify({
		presentation_id: id,
		user_id: userid
	});

	fetch(PRESENTATIONS_URL + `/${id}`, {
		method: 'DELETE',
		body: data,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		}
	}).then(response => {
		if (response.status < 400) {
			presentations.removeChild(document.getElementById(id));
			console.log('Presentation is removed');
		} else {
			console.log('presentation not removed...');
		}
	}).catch(error => console.error(error));
}

function getFirstSlideImage(myJSON, container) {
	let myclass = myJSON;
	console.log(myclass);

	let myP = new Presentation(myclass.presentation.name, container);
	myP.setCurrentSlideIndex(0);
	myP.addSlide(0);
	myP.setTheme(myclass.presentation.theme);

	if (myclass.presentation.slides.length == 0) {
		console.log('empty presentation');
	} else {
		for(let j = 0; j < myclass.presentation.slides[0].elements.length; j++){
			if (myclass.presentation.slides[0].elements[j].typeElement === TEXT){
				myP.getCurrentSlide().addText(myclass.presentation.slides[0].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[0].elements[j].typeElement === IMAGE){
				myP.getCurrentSlide().addImage(myclass.presentation.slides[0].elements[j].contentElement);
			}
			else if(myclass.presentation.slides[0].elements[j].typeElement === VIDEO){
				myP.getCurrentSlide().addVideo(myclass.presentation.slides[0].elements[j].contentElement);
			}
			else{
				myP.getCurrentSlide().addSound(myclass.presentation.slides[0].elements[j].contentElement);
			}
			myP.getSlides()[0].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[0].elements[j].leftPercent}%;
																																 top: ${myclass.presentation.slides[0].elements[j].topPercent}%`);

		}

	}
}

function updateShareOptions(evt) {
	let presentationId = evt.target.parentNode.id;
	let shareId = document.getElementById('selectShare' + presentationId).value;

	let data = JSON.stringify({
		presentation_id: presentationId,
		user_id: userid,
		share_option: shareId
	});

	fetch(PRESENTATIONS_URL + `/${presentationId}/sharing`, {
		method: 'POST',
		body: data,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
	    "Authorization": token
		}
	}).then(response => {
		if (response.status < 400) {
			console.log('Option is updated to: '+ shareId);
			// TODO: MESSAGE
		} else {
			console.log('presentation updated...');
			// TODO: MESSAGE
		}
	}).catch(error => console.error(error));

}
