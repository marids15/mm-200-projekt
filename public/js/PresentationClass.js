/* === Class for creating a  presentation ==================================*/
class Presentation {
  // initializing Presentation
  constructor(name, containerDiv) {
    this.name = name;
    this.slides = [];
    this.currentSlideIndex = null;
    this.containerDiv = containerDiv;
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

  // sets the current slide to a number
  setCurrentSlideIndex(num){
    this.currentSlideIndex = num;
  }

  // add a new slide at specific index
  addSlide(index) {
    try {
      let slide = new Slide();
      let slideHTML = slide.getSlideHTML();
      this.containerDiv.appendChild(slideHTML);
      this.slides.splice(index, 0, slide);
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

  // function to make elements in a div draggable
  makeDivDraggable() {
  // thanks to https://www.kirupa.com/html5/drag.html

    let container = this.slides[this.currentSlideIndex].getSlideHTML();
    let activeItem = null;
    let active = false;

    //div position
    let xLeftBox = container.offsetLeft;
    let xRightBox = xLeftBox + container.offsetWidth;
    let yTopBox = container.offsetTop;
    let yBottomBox = yTopBox + container.offsetHeight;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    // initialize for dragging
    function dragStart(e) {

      if (e.target !== e.currentTarget) {
        active = true;

        // this is the item we are interacting with
        activeItem = e.target;

        if (activeItem !== null) {
          if (!activeItem.xOffset) {
            activeItem.xOffset = 0;
          }

          if (!activeItem.yOffset) {
            activeItem.yOffset = 0;
          }

          if (e.type === "touchstart") {
            activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
            activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
          }
          else {
            activeItem.initialX = e.clientX - activeItem.xOffset;
            activeItem.initialY = e.clientY - activeItem.yOffset;
          }
        }
      }
    }

    // leaves the element at the place where the mouse went up
    function dragEnd(e) {
      if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;

        //convert left and top frompx to %
        let leftPercent = (activeItem.currentX * 100 / container.offsetWidth);
        let topPercent = (activeItem.currentY * 100 / container.offsetHeight);
        activeItem.setAttribute('style', `left: ${leftPercent}%; top: ${topPercent}%`);
      }
      active = false;
      activeItem = null;
    }

    //handles the dragging of elements
    function drag(e) {
      if (active) {
        if (e.type === "touchmove") {
          e.preventDefault();
          activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
          activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
        }
        else {
          activeItem.currentX = e.clientX - activeItem.initialX;
          activeItem.currentY = e.clientY - activeItem.initialY;
        }

        //check if text stay inside the box
        if ((activeItem.currentX + activeItem.offsetWidth)> xRightBox){
          activeItem.currentX = (container.offsetWidth - activeItem.offsetWidth) ;
        }

        if (activeItem.currentX < xLeftBox ){
          activeItem.currentX = 0;
        }

        if ((activeItem.currentY + activeItem.offsetHeight)> yBottomBox ){
          activeItem.currentY = (container.offsetHeight - activeItem.offsetHeight);
        }

        if (activeItem.currentY < yTopBox ){
          activeItem.currentY = 0;
        }

        activeItem.xOffset = activeItem.currentX;
        activeItem.yOffset = activeItem.currentY;
        setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
      }
    }

    // makes movement of elements visible
    function setTranslate(xPos, yPos, el) {
      let leftPercent = (activeItem.currentX * 100 / container.offsetWidth);
      let topPercent = (activeItem.currentY * 100 / container.offsetHeight);
      activeItem.setAttribute('style', `left: ${leftPercent}%; top: ${topPercent}%`);
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
        }
      }
    }
  }
}
