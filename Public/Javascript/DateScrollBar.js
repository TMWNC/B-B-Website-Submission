////////////////////////////////////////////////////////////////////////
// Created 17/07/2025 by Tommy Mannix 
// This script controls the horizontal scrolling of the date bar on the UI
// It calculates the width of multiple list items and scrolls the bar
// by that width when left or right buttons are clicked
////////////////////////////////////////////////////////////////////////


// Run when the DOM has finished loading
document.addEventListener('DOMContentLoaded', () => {

  console.log("firing dates");

  /*
  * scrollAmount()
  * Finds the width of a single <li> item inside the date bar
  * Multiplies by 5 to determine the scroll distance for five items
  */
  const scrollAmount = () => {
      const li = document.querySelector('.date-bar li');
      // Return offset width × 5 (or 0 if no <li> found)
      return li ? li.offsetWidth * 5 : 0;
  };

  /*
  * Event listener for right scroll button
  * Scrolls the date bar right by the calculated scrollAmount
  */
  document.querySelector('.scroll-btn.DateScrollright').addEventListener('click', () => {
      document.querySelector('.date-bar').scrollBy({
          left: scrollAmount(),
          behavior: 'smooth'
      });
  });

  /*
  * Event listener for left scroll button
  * Scrolls the date bar left by the calculated scrollAmount
  */
  document.querySelector('.scroll-btn.Date-Scroll-Left').addEventListener('click', () => {
      document.querySelector('.date-bar').scrollBy({
          left: -scrollAmount(),
          behavior: 'smooth'
      });
  });

});
