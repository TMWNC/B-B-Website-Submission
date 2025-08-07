////////////////////////////////////////////////////////////////////////
// Created 04/07/2025 by Tommy Mannix 
// This script controls an image slideshow with left and right navigation
// It cycles through slides by adding/removing a 'visible' CSS class
////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  
  ///////////////////////// Setup & Initialization /////////////////////////
  
  // Get all the image slides
  const imageslides = document.querySelectorAll('.imageSlide');

  // Counter to track the current slide (arrays start at 0)
  var currentslide = 0;

  // Get the number of slides, adjust by -1 to align with array index
  const NumOfSlides = imageslides.length - 1;

  // On load, make the first image visible (if slides exist)
  if (imageslides.length > 0) {
    imageslides[0].classList.add('visible');
  }

  // Get the left and right navigation buttons
  const leftbutton = document.querySelector('.left');
  const rightbutton = document.querySelector('.right');


  ///////////////////////// Event Listeners ////////////////////////////////

  /*
  * Left button event listener
  * Moves to the previous slide. Wraps around to the last slide if 
  * currently on the first slide.
  */
  leftbutton.addEventListener("click", () => {
    imageslides[currentslide].classList.remove('visible');
    currentslide--;
    if (currentslide < 0) {
      currentslide = NumOfSlides; // Wrap to last slide
    }
    imageslides[currentslide].classList.add('visible');
  });

  /*
  * Right button event listener
  * Moves to the next slide. Wraps around to the first slide if 
  * currently on the last slide.
  */
  rightbutton.addEventListener("click", () => {
    imageslides[currentslide].classList.remove('visible');
    currentslide++;
    if (currentslide > NumOfSlides) {
      currentslide = 0; // Wrap to first slide
    }
    imageslides[currentslide].classList.add('visible');
  });

});
