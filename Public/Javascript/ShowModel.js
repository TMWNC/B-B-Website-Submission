/// Created  — Tommy Mannix
////////////////////////////////////////////////////////////////////////
// This script displays the login modal box on the checkout page 
// if the user is not logged in. It provides functions to show 
// and hide the modal and attaches a close event handler.
////////////////////////////////////////////////////////////////////////


// Select the modal container and the close button
const modelbox = document.querySelector(".ModelBox");
const modelboxClose = document.querySelector(".ModelBox .close-modal");


////////////////////////////////////////////////////////////////////////
// Function: modelshow
// Shows the modal box if it is currently hidden.
////////////////////////////////////////////////////////////////////////
function modelshow() {
    if (modelbox.classList.contains("hidden")) {
        modelbox.classList.remove("hidden");
    }
}


////////////////////////////////////////////////////////////////////////
// Function: modelhide
// Hides the modal box if it is currently visible.
////////////////////////////////////////////////////////////////////////
function modelhide() {
    if (!modelbox.classList.contains("hidden")) {
        modelbox.classList.add("hidden");
    }
}


////////////////////////////////////////////////////////////////////////
// Event Listener
// Attaches the close button event to hide the modal when clicked.
////////////////////////////////////////////////////////////////////////
modelboxClose.addEventListener("click", modelhide);
