const TEXT = "text";
const IMAGE = "image";
const VIDEO = "video";
const SOUND = "sound";

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

  getType(){
    return this.type;
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
    else if (this.type === SOUND) {
      return this.createHTMLSound();
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
    myText.type = this.type;
    myText.content = this.content;
    return myText;
  }

  // gets HTML for image
  createHTMLImage() {
    let myImage = document.createElement('img');
    myImage.src = this.content;
    myImage.draggable = false;
    myImage.setAttribute('id', this.id);
    myImage.className = 'image';
    myImage.type = this.type;
    myImage.content = this.content;
    return myImage;
  }

  // gets HTML for video
  createHTMLVideo() {
    let myVidFrame = document.createElement('iframe');
    let vidDiv = document.createElement('div');
    let dragIcon = document.createElement('icon');
    vidDiv.className = "vidDiv"
    dragIcon.className = "fas fa-arrows-alt";

    myVidFrame.src = this.content;
    myVidFrame.frameborder = "0";
    myVidFrame.className = "vidElement";
    myVidFrame.allow = 'encrypted-media, autoplay';
    myVidFrame.setAttribute('allowFullScreen', '');

    vidDiv.appendChild(myVidFrame);
    vidDiv.appendChild(dragIcon);
    vidDiv.type = this.type;
    vidDiv.content = this.content;
    return vidDiv;

    //https://www.youtube.com/embed/xbhCPt6PZIU works
    //https://www.youtube.com/embed/dmKeIlJq4gM doesn't
  }

  // gets HTML for sound
  createHTMLSound() {
    let audioElement = document.createElement('audio');
    let audioSource = document.createElement('source');
    audioElement.className = "soundElement";
    audioElement.setAttribute('controls', '');
    audioSource.src = this.content;
    audioElement.appendChild(audioSource);
    audioElement.type = this.type;
    audioElement.content = this.content;
    return audioElement;
  }

}
