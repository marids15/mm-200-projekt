/* === Class for creating Slide =============================================*/
class Slide {
  // initializing slide
  constructor(){
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'creationDiv');
    this.elements = [];
    this.currentElement = null;
    this.idGenerator = 0;
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

  // add image element to slide
  addImage(src) {
    try {
      let myImage = new Element(IMAGE, src, this.idGenerator);
      let imageHTML = myImage.getHTMLElement();
      this.elements.push(imageHTML);
      this.div.appendChild(imageHTML);
      this.idGenerator ++;
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
      this.idGenerator ++;
    }
    catch {
      console.error("Could not add Text");
    }
  }

  // add video element to slide
  addVideo(src) {
    //TODO!
  }

  // deletes element from slide
  deleteElement() {
    try {
      if (this.elements.includes(this.currentElement)) {
        this.div.removeChild(this.currentElement);
        this.elements.splice(this.elements.indexOf(this.currentElement), 1);
        this.currentElement = null;//????
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
      this.div.children[i].style.borderStyle = "none";
    }
  }
}
