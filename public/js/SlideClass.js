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
      if (DRAGGABLE) {
        this.makeDraggable(imageHTML);
      }
    }
    catch {
      console.error("Could not add Image");
    }
  }

  // add text element to slide
  addText(text , listClass) {
    try {
      let myText = new Element(TEXT, text, this.idGenerator);
      let textHTML = myText.getHTMLElement();
      textHTML.className += ' ' + listClass;
      this.elements.push(textHTML);
      this.div.appendChild(textHTML);
      this.idGenerator++;
      if (DRAGGABLE) {
        this.makeDraggable(textHTML);
      }
    } catch(e) {
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
      if (DRAGGABLE) {
        this.makeDraggable(vidHTML);
      }
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
    if (DRAGGABLE) {
      this.makeDraggable(soundHTML);
    }
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
      if(document.getElementById('textToolTab').className.includes("active")){
        document.getElementById("inTxt").value = element.innerHTML;
      }
    }
    // when you click on the icon, which is a child of the video div:
    else if (element !== null && element.parentElement.className === "vidDiv") {
      this.currentElement = element.parentElement;
      this.setBorder();
    }
    else {
      this.currentElement = null;

      if(document.getElementById('textToolTab').className.includes("active")){
        document.getElementById("inTxt").value = "";
      }
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

    divOverlay.addEventListener('mousedown', dragStart, true);
    divOverlay.addEventListener('touchstart', dragStart, true);

    document.addEventListener('mousemove', dragMove, true);
    document.addEventListener('touchmove', dragMove, true);

    document.addEventListener('mouseup', dragEnd, true);
    document.addEventListener('touchend', dragEnd, true);

    function dragStart(e) {
      divOverlay.isDown = true;

      if(e.type === 'mousedown'){
        divOverlay.offset = [
            divOverlay.offsetLeft - e.clientX,
            divOverlay.offsetTop - e.clientY
        ];
      }else{
        divOverlay.offset = [
            divOverlay.offsetLeft - e.touches[0].clientX,
            divOverlay.offsetTop - e.touches[0].clientY
        ];
      }

    }

    function dragMove(e) {
      //e.preventDefault();
      if (divOverlay.isDown) {

        let leftPercent;
        let topPercent;
        let newClientX;
        let newClientY;

        if(e.type === 'mousemove'){
          newClientX = e.clientX;
          newClientY = e.clientY;
        }else{
          newClientX = e.touches[0].clientX;
          newClientY = e.touches[0].clientY;
        }

        if ((newClientX + divOverlay.offset[0] + divOverlay.offsetWidth) * 100 / container.offsetWidth > 100){
          //do nothing
        } else if ((newClientX + divOverlay.offset[0]) * 100 / container.offsetWidth < 0){
          //do nothing
        } else {
            leftPercent = ((newClientX + divOverlay.offset[0]) * 100 / container.offsetWidth);
        }

        if (((newClientY + divOverlay.offset[1] + divOverlay.offsetHeight) * 100 / container.offsetHeight)> 100 ){
          //do nothing
        } else if ((newClientY + divOverlay.offset[1]) * 100 / container.offsetHeight < 0 ){
          //do nothing
        }else {
          topPercent = ((newClientY + divOverlay.offset[1]) * 100 / container.offsetHeight);
        }

        divOverlay.style.left = leftPercent + '%';
        divOverlay.style.top  = topPercent + '%';
      }
    }

    function dragEnd() {
      divOverlay.isDown = false;
    }
  }
}
