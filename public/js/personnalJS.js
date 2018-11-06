let buttonAddPresentation = document.getElementById("buttonAddPresentation");
let presentations = document.getElementById("presentations");

//-------------------------button

buttonAddPresentation.onclick = addPresentation;


//-------------------------variable
let nbPresentation = 0;

//-------------------------functions

function addPresentation() {
	let newP = document.createElement("div");
	let id = "presentation" + nbPresentation;
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