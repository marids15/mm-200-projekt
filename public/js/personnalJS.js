//------------------------- constants
CREATE_PRESENTATION_URL = "/api/presentations/new";
GET_USER_PRESENTATIONS_URL = "/api/presentations";

let formAddPresentation = document.getElementById("formCreatePresentation");
let presentations = document.getElementById("presentations");

//-------------------------button
formAddPresentation.onsubmit = addPresentation;


//-------------------------variable
let nbPresentation;


//-------------------------setup
loadPresentations();


//-------------------------functions
async function addPresentation(evt) {
	evt.preventDefault();

	let name = document.getElementById('inPresentationName').value;
	let data = JSON.stringify({
		//name: name,
		owner: localStorage.getItem('user_id')
	})

	fetch(CREATE_PRESENTATION_URL, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		},
		body: data
	}).then(response => {
		if (response.status < 400) {
			console.log('Created presentation! :D');
			console.log(response);
			handlePresentation(response);
		} else {
			console.log('Did not create presentation :(');
		}
	}).catch(err => console.error(err))
}

async function handlePresentation(response) {
	let data = await response.json();
	console.log(data);
	localStorage.setItem('presentation_id', data[0].id);
	location.href = "./presentation.html";
}
/*
	async function handleLogin(response) {
	  let data = await response.json();
	  localStorage.setItem('id', data[0].id);
	  localStorage.setItem('username', data[0].username);
	  localStorage.setItem('email', data[0].email);
	  localStorage.setItem('password', data[0].password);
	  localStorage.setItem('role', data[0].role);
	  location.href = "./personnal.html";
	}
}
*/

async function loadPresentations() {
	let userid = localStorage.getItem('user_id');
	fetch(GET_USER_PRESENTATIONS_URL + `/${userid}`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		}
	}).then(response => {
		if (response.status < 400) {
			console.log('Loaded presentations! :D');
			console.log(response);
			displayPresentations(response);
		} else {
			console.log('Did not load presentation :(');
		}
	}).catch(err => console.error(err))
}

async function displayPresentations(response) {
	let data = await response.json();
	console.log(data);
	presentations.innerHTML = "";
	for (let presentation of data) {
		console.log(presentation);
		let newP = document.createElement("div");
		let id = presentation.id;
		newP.id = id;
		newP.className = "presentation";
		nbPresentation++;

		//let imageP = getFirstSlideImage(data);

		let imageP = document.createElement("div");
		imageP.className = "miniView";
		imageP.onclick = editPresentation;


		let buttonDeleteP = document.createElement("button");
		buttonDeleteP.type = "button";
		buttonDeleteP.innerHTML = "Delete";
		buttonDeleteP.className = "buttonDeleteP";
		buttonDeleteP.onclick = deletePresentation;

		let buttonStatusP = document.createElement("select");
		buttonStatusP.className = "buttonStatusP";

		let optionPublic = document.createElement("option");
		optionPublic.value = "public";
		optionPublic.innerHTML = "Public";
		buttonStatusP.appendChild(optionPublic);

		let optionPrivate = document.createElement("option");
		optionPrivate.value = "private";
		optionPrivate.innerHTML = "Private";
		buttonStatusP.appendChild(optionPrivate);

		let optionIndividual = document.createElement("option");
		optionIndividual.value = "individual";
		optionIndividual.innerHTML = "Individual";
		buttonStatusP.appendChild(optionIndividual);

		let buttonPresenterP = document.createElement("button");
		buttonPresenterP.type = "button";
		buttonPresenterP.innerHTML = "Presenter Mode";
		buttonPresenterP.className = "buttonPresenterP";


		newP.appendChild(imageP);
		newP.appendChild(buttonDeleteP);
		newP.appendChild(buttonStatusP);
		newP.appendChild(buttonPresenterP);

		presentations.appendChild(newP);
		getFirstSlideImage(presentation.presentation_json, imageP);
	}


	//add onclik proprieties
	//imageP.setAttribute('onclick',"editPresentation(document.getElementById(id).id)");
}


function editPresentation (e) {
	let id = e.target;
	console.log("editing... " + id );
}

function deletePresentation (e) {
	let id = e.target.parentNode.id;
	presentations.removeChild(document.getElementById(id));
	console.log("deleting... " + id );
}

function getFirstSlideImage(myJSON, container) {
	//let myclass = JSON.parse(myJSON);
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
			//console.log(myclass.presentation.slides[i].elements[j]);
			console.log(myP.getSlides()[0].getElements()[j]);
			myP.getSlides()[0].getElements()[j].xOffset = myclass.presentation.slides[0].elements[j].xOffset;
			myP.getSlides()[0].getElements()[j].yOffset = myclass.presentation.slides[0].elements[j].yOffset;
			//myP.getSlides()[i].getElements()[j].initialX = myclass.presentation.slides[i].elements[j].initialX;
			//myP.getSlides()[i].getElements()[j].initialY = myclass.presentation.slides[i].elements[j].initialY;
			myP.getSlides()[0].getElements()[j].currentX = myclass.presentation.slides[0].elements[j].currentX;
			myP.getSlides()[0].getElements()[j].currentY = myclass.presentation.slides[0].elements[j].currentY;


			let container = myP.slides[0].getSlideHTML();
			let leftPercent = (myP.getSlides()[0].getElements()[j].currentX * 100 / container.offsetWidth);
			let topPercent = (myP.getSlides()[0].getElements()[j].currentY * 100 / container.offsetHeight);
			//myP.getSlides()[0].getElements()[j].setAttribute('style', `left: ${myclass.presentation.slides[0].elements[j].leftPercent}%;top: ${myclass.presentation.slides[0].elements[j].topPercent}%`);
		  myP.getSlides()[0].getElements()[j].setAttribute('style', `left: ${leftPercent}%;top: ${topPercent}%`);

		}

	}
	/*
	let imageP = document.createElement("div");
	imageP.className = "viewFirstSlide";
	imageP.onclick = editPresentation;
	let copy = myP.getSlides()[0].getSlideHTML().cloneNode(true);
	imageP.appendChild(copy);
	*/

	//return imageP;
}
