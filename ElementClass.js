const TEXT = "text";
const IMAGE = "image";
const VIDEO = "video";

/* === Class for creating elements =========================================*/
class Element {
  // initializing element
  constructor(type, content, id){
    this.type = type;
    this.content = content;
    this.id = id;
  }

  // gets id of element
  getID(){
    return this.id;
  }

  // gets HTML of element
  getHTMLElement() {
    if (this.type === TEXT) {
      return this.createHTMLText();
    }
    else if (this.type === IMAGE) {
      return this.createHTMLImage();
    }
    else if (this.type === VIDEO) {
      return this.createHTMLVideo();
    }
    else {
      console.error("This is not a correct element");
    }
  }

  // gets HTML for text
  createHTMLText(){
    let myText = document.createElement("text");
    myText.contentEditable = true;
    myText.innerHTML = this.content;
    myText.setAttribute( 'class', 'textElementSlide');
    myText.setAttribute('spellcheck', "false");
    myText.setAttribute('id', this.id);
    return myText;
  }

  // gets HTML for image
  createHTMLImage() {
    let myImage = document.createElement('img');
    myImage.src = this.content;
    myImage.draggable = false;
    myImage.setAttribute('id', this.id);
    return myImage;
  }

  // gets HTML for video
  createHTMLVideo() {
    //let myDiv = document.createElement('div');
    let myVidFrame = document.createElement('iframe');
    //let myHeader = document.createElement('h1');

    myVidFrame.src = this.content;
    myVidFrame.frameborder = "0";
    myVidFrame.className = "vidElement";
    myVidFrame.allow = 'encrypted-media, autoplay';
    myVidFrame.setAttribute('allowFullScreen', '');

    //myDiv.className = "vidElement";
    //myHeader.innerHTML = "movie title";
    //myHeader.className = "vidHeader";
    //myDiv.appendChild(myHeader);
    //myDiv.appendChild(myVidFrame);
    //return myDiv;
    return myVidFrame;

    //https://www.youtube.com/embed/xbhCPt6PZIU works
    //https://www.youtube.com/embed/dmKeIlJq4gM doesn't
  }

}
