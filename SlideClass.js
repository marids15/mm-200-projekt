import ElementClass.js;

const TEXT = "text";
const IMAGE = "image";
const VIDEO = "video";

class Slide {
  constructor(){
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'creationDiv');
    this.elements = [];
    this.currentElement = null;
  }

  function getSlideHTML() {
    return this.div;
  }

  function addImage(src) {
    try {
      let myImage = new Element(IMAGE, src);
      let imageHTML = myImage.getHTMLElement();
      this.elements.push(imageHTML);
      this.div.appendChild(imageHTML);
    }
    catch {
      console.error("Could not add Image");
    }
  }

  function addText(text) {
    try {
      let myText = new Element(TEXT, text);
      let textHTML = myText.getHTMLElement();
      this.elements.push(textHTML);
      this.div.appendChild(textHTML);
    }
    catch {
      console.error("Could not add Text");
    }
  }

  function addVideo(src) {
    //TODO!
  }

  function deleteElement() {
    try {
      this.elements.splice(this.elements.indexOf(this.currentElement), 1);
      this.div.removeChild(this.currentElement);
    }
    catch {
      console.error("Could not remove element");
    }
  }

  function selectElement(element) {
    if (this.elements.contains(element)) {
      this.currentElement = element;
      setBorder();
    } else {
      this.currentElement = null;
    }
  }

  function setBorder() {
    removeBorder();
    this.currentElement.style.border = "1.5px solid blue";
  }

  function removeBorder() {
    for (let i in this.elements) {
      i.style.borderStyle = "none"
    }
  }
}
