let themes = ["themeDefault", "themeDark"];

/* === Class for creating Slide =============================================*/
class Slide {
  // initializing slide
  constructor(){
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'creationDiv');
    this.elements = [];
    this.currentElement = null;
    this.idGenerator = 0;
    this.note = "Write your notes here";
  }

  // get HTML of slide
  getSlideHTML() {
    return this.div;
  }

  // get elements in slide
  getElements(){
    return this.elements;
  }

  // get selected element (null if none selected)
  getCurrentElement(){
    return this.currentElement;
  }

  // gets note
  getNote() {
    return this.note;
  }

  // sets note
  setNote(noteText) {
    this.note = noteText;
  }

  // sets theme of slide
  setSlideTheme(theme) {
    this.div.classList.remove(...themes);
    this.div.classList.add(theme);
  }

  // add image element to slide
  addImage(src) {
    try {
      let myImage = new Element(IMAGE, src, this.idGenerator);
      let imageHTML = myImage.getHTMLElement();
      this.elements.push(imageHTML);
      this.div.appendChild(imageHTML);
      this.idGenerator ++;
      this.makeDraggable(imageHTML);
    }
    catch {
      console.error("Could not add Image");
    }
  }

  // add text element to slide
  addText(text) {
    try {
      let myText = new Element(TEXT, text, this.idGenerator);
      let textHTML = myText.getHTMLElement();
      this.elements.push(textHTML);
      this.div.appendChild(textHTML);
      this.idGenerator++;
      this.makeDraggable(textHTML);
    }
    catch(e) {
      console.error("Could not add Text: " + e);
    }
  }

  // add video element to slide
  addVideo(src) {
    try {
      let myVideo = new Element(VIDEO, src, this.idGenerator);
      let vidHTML = myVideo.getHTMLElement();
      this.elements.push(vidHTML);
      this.div.appendChild(vidHTML);
      this.idGenerator++;
      this.makeDraggable(vidHTML);
    }
    catch {
      console.error("Could not add video");
    }
  }

  addSound(src) {
    let mySound = new Element(SOUND, src, this.idGenerator);
    let soundHTML = mySound.getHTMLElement();
    this.elements.push(soundHTML);
    this.div.appendChild(soundHTML);
    this.idGenerator++;
    this.makeDraggable(soundHTML);
  }

  // deletes element from slide
  deleteElement() {
    try {
      if (this.elements.includes(this.currentElement)) {
        this.div.removeChild(this.currentElement);
        this.elements.splice(this.elements.indexOf(this.currentElement), 1);
        this.currentElement = null;
      }
    }
    catch {
      console.error("Could not remove element");
    }
  }

  // selects element in slide
  selectElement(element) {
    if (this.elements.includes(element)) {
      this.currentElement = element;
      this.setBorder();
      document.getElementById("updateTextDiv").innerHTML= 'Now editing element:<p class="emlNR" id="emlNR">'+element.id+'</p>';
      document.getElementById("inTxt").value = element.innerHTML;
      //  doChange(element);
    }
    // when you click on the icon, which is a child of the video div:
    else if (element !== null && element.parentElement.className === "vidDiv") {
      this.currentElement = element.parentElement;
      this.setBorder();
    }
    else {
      this.currentElement = null;
    }
  }

  // sets border of element in slide
  setBorder() {
    this.removeBorder();
    if (this.currentElement !== null){
      this.currentElement.style.border = "1.5px solid blue";
    }
  }

  // removes all borders from elements in slide
  removeBorder() {

    for (let i in this.elements) {
      //if (this.div.children[i].className == "vidDiv") {
      //  this.div.children[i].style.border = "5px solid darkgrey";
      //} else {
        this.div.children[i].style.borderStyle = "none";
      //}
    }
  }

  makeDraggable(divOverlay){
    //var divOverlay = document.getElementById ("overlay");
    //var container = document.getElementById("slideDiv");
    let container = this.div;
    divOverlay.isDown = false;

    divOverlay.addEventListener('mousedown', function(e) {
        divOverlay.isDown = true;
        divOverlay.offset = [
            divOverlay.offsetLeft - e.clientX,
            divOverlay.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener('mouseup', function() {
        divOverlay.isDown = false;
    }, true);

    document.addEventListener('mousemove', function(e) {
        event.preventDefault();
        if (divOverlay.isDown) {

          let leftPercent;
          let topPercent;

          if ((e.clientX + divOverlay.offset[0] + divOverlay.offsetWidth) * 100 / container.offsetWidth > 100){
            //do nothing
          } else if ((e.clientX + divOverlay.offset[0]) * 100 / container.offsetWidth < 0){
            //do nothing
          } else {
              leftPercent = ((e.clientX + divOverlay.offset[0]) * 100 / container.offsetWidth);
          }

          if (((e.clientY + divOverlay.offset[1] + divOverlay.offsetHeight) * 100 / container.offsetHeight)> 100 ){
            //do nothing
          } else if ((e.clientY + divOverlay.offset[1]) * 100 / container.offsetHeight < 0 ){
            //do nothing
          }else {
            topPercent = ((e.clientY + divOverlay.offset[1]) * 100 / container.offsetHeight);
          }

          divOverlay.style.left = leftPercent + '%';
          divOverlay.style.top  = topPercent + '%';
        }
    }, true);
  }
}
