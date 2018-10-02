class Presentation {
  constructor(name, containerDiv) {
    this.name = name;
    this.slides = [];
    this.currentSlideIndex = null;
    this.containerDiv = containerDiv;
  }

  function addSlide() {
    try {
      let slide = new Slide();
      let slideHTML = slide.getSlideHTML();
      this.slides.push(slide);
      this.containerDiv.appendChild(slideHTML);
    }
    catch {
      console.error("Could not add slide.");
    }
  }
/*
  function deleteSlide() {
    try {
      this.slides.splice(currentSlideIndex, 1);
      //if we delete the only slide
      if ( listOfSlide.length === 0){
        slideDiv.removeChild(slideDiv.firstChild);
        AddFirstSlide();
      }
      //if you delete the first slide
      else if (numCurrentSlide === 0) {
        numCurrentSlide = -1;
        goToNextSlide();
      }

      else {
        goToPreviousSlide();
      }
      updateSlideselector(listOfSlide.length-1);
    }
  }*/

  function goToNextSlide(){
    if (currentSlideIndex + 1 < this.slides.length){
      removeBorderStyle(this.slides[currentSlideIndex].children);
      slideDiv.removeChild(slideDiv.firstChild)
      currentSlideIndex++;
      slideDiv.appendChild(listOfSlide[currentSlideIndex]);
    }
    else{
      console.log("Error : it's the last slide!");
    }
    displayNumberCurrentSlide();
    selectOptionInSelector(currentSlideIndex);
  }
}
