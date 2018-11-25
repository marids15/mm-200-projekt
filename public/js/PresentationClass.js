/* === Class for creating a  presentation ==================================*/
class Presentation {
  // initializing Presentation
  constructor(name, containerDiv) {
    this.name = name;
    this.slides = [];
    this.currentSlideIndex = null;
    this.containerDiv = containerDiv;
    this.theme = "Default";
  }

  // get name of presentation
  getName() {
    return this.name;
  }

  // get array of slides (instances of class Slide)
  getSlides(){
    return this.slides;
  }

  // get current slide index
  getCurrentSlideIndex(){
    return this.currentSlideIndex;
  }

  // get current slide (instance of class Slide)
  getCurrentSlide(){
    return this.slides[this.currentSlideIndex];
  }

  // get theme
  getTheme() {
    return this.theme;
  }

  // sets the current slide to a number
  setCurrentSlideIndex(num){
    this.currentSlideIndex = num;
  }

  // set theme
  setTheme(theme) {
    console.log("setting theme: " + theme);
    this.theme = theme;

    for (let slide of this.slides) {
      slide.setSlideTheme("theme" + theme);
    }
  }

  // add a new slide at specific index
  addSlide(index) {
    try {
      let slide = new Slide();
      let slideHTML = slide.getSlideHTML();
      this.containerDiv.appendChild(slideHTML);
      this.slides.splice(index, 0, slide);
      slide.setSlideTheme("theme" + this.theme);
    }
    catch {
      console.error("Could not add slide.");
    }
  }

  // cleans the containerdiv for displaying slide
  cleanContainerDiv(){
    try {
      this.containerDiv.removeChild(this.containerDiv.firstChild);
    }
    catch{
      console.error("Could not clean ContainerDiv.");
    }
  }

  // removes slide from slides array
  removeSlidesElement(num){
    try {
      this.slides.splice(num, 1);
    }
    catch{
      console.error("Could not remove this element.");
    }
  }

  // handles everything to go to next slide
  goToNextSlide(){
    if (this.currentSlideIndex + 1 < this.slides.length){
      if (this.currentSlideIndex !== -1){
        this.slides[this.currentSlideIndex].removeBorder();
      }
      this.containerDiv.removeChild(this.containerDiv.firstChild)
      this.currentSlideIndex++;
      this.containerDiv.appendChild(this.slides[this.currentSlideIndex].getSlideHTML());
    }
    else{
      console.log("Error : it's the last slide!");
    }
  }

  // handles everything to go to previous slide
  goToPreviousSlide(){
    if (this.currentSlideIndex  === 0){
      console.log("Error : it's the first slide!");
    }
    else{
      if (this.currentSlideIndex < this.slides.length){
        this.slides[this.currentSlideIndex].removeBorder();
      }
      this.containerDiv.removeChild(this.containerDiv.firstChild)
      this.currentSlideIndex--;
      this.containerDiv.appendChild(this.slides[this.currentSlideIndex].getSlideHTML());
    }
  }

  // handles everything to go to a specific slide (with num)
  goToSlide(num) {
    if (num >= 0 &&  num < this.slides.length){
      this.slides[this.currentSlideIndex].removeBorder();
      this.containerDiv.removeChild(this.containerDiv.firstChild)
      this.currentSlideIndex = num;
      this.containerDiv.appendChild(this.slides[this.currentSlideIndex].getSlideHTML());
    }
    else{
      console.log("Error : this slide dosen't exist!");
    }
  }

  // function to make elements in a div selectable
  makeDivSelectable() {
    let myCurrentSlideHTML = this.slides[this.currentSlideIndex].getSlideHTML();
    let myCurrentSlide = this.slides[this.currentSlideIndex];

    myCurrentSlideHTML.addEventListener("click", selectElement, false);

    // handles the selecting of an element
    function selectElement(evt) {
      let activeElement = evt.target;
      if (activeElement !== null){
        myCurrentSlide.removeBorder();
        myCurrentSlide.selectElement(null);
        if (activeElement !== myCurrentSlideHTML){
          myCurrentSlide.selectElement(activeElement);
          myCurrentSlide.setBorder();
          switch (activeElement.typeElement) {
            case TEXT:
              showTextTool();
              updateTools();
              break;
            case IMAGE:
              showImageTool();
              break;
            case VIDEO:
              showVideoTool();
              break;
            case SOUND:
              showSoundTool();
              break;
            default:
              //
              break;
          }


        }
      }
    }
  }
}
