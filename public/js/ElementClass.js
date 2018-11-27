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

  // gets type of element
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
    if (EDITABLE) {
      myText.contentEditable = true;
    }
    myText.innerHTML = this.content;
    myText.setAttribute( 'class', 'textElementSlide');
    myText.setAttribute('spellcheck', "false");
    myText.setAttribute('id', this.id);
    myText.typeElement = this.type;
    myText.contentElement = this.content;
    return myText;
  }

  // gets HTML for image
  createHTMLImage() {
    let myImage = document.createElement('img');
    myImage.src = this.content;
    myImage.draggable = false;
    myImage.setAttribute('id', this.id);
    myImage.className = 'image';
    myImage.typeElement = this.type;
    myImage.contentElement = this.content;
    return myImage;
  }

  // gets HTML for video
  createHTMLVideo() {
    let myVidFrame = document.createElement('iframe');
    let vidDiv = document.createElement('div');
    let dragIcon = document.createElement('img');
    vidDiv.className = "vidDiv"
    dragIcon.setAttribute("src", "images/dragging.png");

    myVidFrame.src = this.content;
    myVidFrame.frameborder = "0";
    myVidFrame.className = "vidElement";
    myVidFrame.allow = 'encrypted-media, autoplay';
    myVidFrame.setAttribute('allowFullScreen', '');

    vidDiv.appendChild(myVidFrame);
    vidDiv.appendChild(dragIcon);
    vidDiv.typeElement = this.type;
    vidDiv.contentElement = this.content;
    return vidDiv;
  }

  // gets HTML for sound
  createHTMLSound() {
    let audioSource = document.createElement('audio');
    let audioElement = document.createElement('div');
    let playButton = document.createElement('img');
    audioSource.id = `sound_${this.id}`;
    playButton.className ="soundLeft";
    playButton.setAttribute("src", "images/play.svg");
    playButton.onclick = function(){
      audioSource.play();
    }
    let stopButton = document.createElement('img');
    stopButton.className="soundRight";
    stopButton.setAttribute("src", "images/pause.svg");
    stopButton.onclick = function(){
      audioSource.pause();
    }
    audioElement.className = "soundElement";
    audioSource.src = this.content;
    let audioDrag = document.createElement('div');
    audioDrag.className = "soundDrag";

    let dragIcon = document.createElement('img');
    dragIcon.setAttribute("src", "images/dragging.png");

    audioElement.appendChild(audioSource);
    audioElement.appendChild(playButton);
    audioElement.appendChild(stopButton);
    audioDrag.appendChild(dragIcon);
    audioElement.appendChild(audioDrag);

    audioElement.typeElement = this.type;
    audioElement.contentElement = this.content;

    return audioElement;
  }
}
