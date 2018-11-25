function showConfirmPopup(message){
  let body = document.body;

  let messageBox = document.createElement('div');
  messageBox.classList.add('confirmMessage');
  let messageText = document.createElement('p');
  messageText.innerHTML = message;
  let closeIcon = document.createElement('button');
  closeIcon.innerHTML = '<i class="fas fa-times"></i>';
  closeIcon.onclick = removePopup;
  messageBox.appendChild(messageText);
  messageBox.appendChild(closeIcon);

  body.appendChild(messageBox);
}

function showErrorPopup(message){
  let body = document.body;

  let messageBox = document.createElement('div');
  messageBox.classList.add('errorMessage');
  let messageText = document.createElement('p');
  messageText.innerHTML = message;
  let closeIcon = document.createElement('button');
  closeIcon.innerHTML = '<i class="fas fa-times"></i>';
  closeIcon.onclick = removePopup;
  messageBox.appendChild(messageText);
  messageBox.appendChild(closeIcon);

  body.appendChild(messageBox);
}

function removePopup(evt) {
  let body = document.body;
  body.removeChild(evt.currentTarget.parentElement);
}
