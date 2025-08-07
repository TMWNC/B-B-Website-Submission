/*
* Created 17/07/2025 by Tommy Mannix
* This script controls the showing and hiding of the 
* Filter menu on the search screen and fires when the DOM is loaded.
*/

document.addEventListener('DOMContentLoaded', () => {

  ////////////////////////////////////////////////////////////////////////
  // Variable Assignments
  // Find and store references for the open button, close button,
  // and the filter panel container.
  ////////////////////////////////////////////////////////////////////////
  const openBtn = document.getElementById('holiday-filter-Title');  // Button to open filter menu
  const closeBtn = document.getElementById('close-filters-btn');    // Button to close filter menu
  const filterPanel = document.getElementsByClassName('search-filters'); // Filter panel container

  ////////////////////////////////////////////////////////////////////////
  // Event: Open Filter Panel
  // Adds the 'active' class to the filter panel and prevents background
  // scrolling by applying the 'noscroll' class to the body.
  ////////////////////////////////////////////////////////////////////////
  openBtn.addEventListener('click', () => {
    filterPanel[0].classList.add('active');
    document.body.classList.add('noscroll');
  });

  ////////////////////////////////////////////////////////////////////////
  // Event: Close Filter Panel
  // Removes the 'active' class to hide the filter panel and restores
  // page scrolling by removing the 'noscroll' class from the body.
  ////////////////////////////////////////////////////////////////////////
  closeBtn.addEventListener('click', () => {
    filterPanel[0].classList.remove('active');
    document.body.classList.remove('noscroll');
  });

});
