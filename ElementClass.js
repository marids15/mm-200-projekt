const TEXT = "text";
const IMAGE = "image";
const VIDEO = "video";

class Element {
  constructor(type, content){
    this.type = type;
    this.content = content;
  }

  function getHTMLElement() {
    if (this.type === TEXT) {
      createHTMLText();
    }
    else if (this.type === IMAGE) {
      createHTMLImage();
    }
    else if (this.type === VIDEO) {
      createHTMLVideo();
    }
    else {
      console.error("This is not a correct element");
    }
  }

  function createHTMLText(){
    let myText = document.createElement("text");
    myText.contentEditable = true;
    myText.innerHTML = this.content;
    myText.setAttribute( 'class', 'textElementSlide');
    myText.setAttribute('spellcheck', "false");
    return myText;
  }

  function createHTMLImage() {
    let myImage = document.createElement('img');
    myImage.src = this.content;
    myImage.draggable = false;
    return myImage;
  }

  function createHTMLVideo() {
    return null;    //TODO!
  }

}
