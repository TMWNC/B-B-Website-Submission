/* Created 15/07/2025 by Tommy Mannix
*  This script controls the showing and hiding of the 
*  search menu on mobile devices and runs when the DOM first loads.
*/

////////////////////////////////////////////////////////////////////////
// DOMContentLoaded Event
// Ensures the script only runs once the DOM has fully loaded.
////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {

  ////////////////////////////////////////////////////////////////////////
  // Variable Assignments
  // Get references for the search bar container, the toggle button, 
  // and the close button.
  ////////////////////////////////////////////////////////////////////////
  const searchBar = document.querySelector('.SearchBar');              // The mobile search bar element
  const toggleButton = document.getElementById('search-toggle-btn');   // Button to open the search bar
  const closeButton = document.getElementById('search-close-btn');     // Button to close the search bar

  ////////////////////////////////////////////////////////////////////////
  // Event: Toggle Button Click
  // Displays the search bar by adding the 'visible' class and 
  // prevents the background page from scrolling.
  ////////////////////////////////////////////////////////////////////////
  toggleButton?.addEventListener('click', () => {
    searchBar.classList.add('visible');
    document.body.classList.add('noscroll');
  });

  ////////////////////////////////////////////////////////////////////////
  // Event: Close Button Click
  // Hides the search bar by removing the 'visible' class and 
  // restores scrolling on the main page.
  ////////////////////////////////////////////////////////////////////////
  closeButton?.addEventListener('click', () => {
    searchBar.classList.remove('visible');
    document.body.classList.remove('noscroll');
  });

});
