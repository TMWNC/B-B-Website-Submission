////////////////////////////////////////////////////////////////////////
// Created 18/07/2025 by Tommy Mannix
// This script validates passenger input on the checkout form. 
// It ensures all fields meet validation rules, packages the data into 
// a JSON object, and posts it to the server for further processing.
////////////////////////////////////////////////////////////////////////


// Identify the submit button used to proceed with passenger details
const submitButton = document.querySelector(".button-proceed");

// Add an event listener to the submit button to validate and then post passenger info
submitButton.addEventListener("click", async () =>  {
  if (checkValidation() == true) {
    PostToServer();
  } else {
    console.log(await checkValidation());
  }
});

////////////////////////////////////////////////////////////////////////
// Function: checkValidation
// Iterates through all input fields on the passenger form, 
// validates each one using CheckValidationOfValue, 
// and returns a boolean indicating if the form is valid.
////////////////////////////////////////////////////////////////////////
function checkValidation() {
  const inputitems = document.querySelectorAll(".input-wrapper");
  let validated = true;

  for (const input of inputitems) {
    const rowitems = input.querySelectorAll(".form-row");

    for (const row of rowitems) {
      const inputField = row.children[1]; // Identify input/select field
      const isValid = CheckValidationOfValue(inputField.value, inputField.type, inputField);

      if (!isValid) {
        validated = false;
      }
    }
  }

  return validated;
}

////////////////////////////////////////////////////////////////////////
// Function: PostToServer
// Builds a JSON object of all passenger details, 
// attaches lead passenger and adult/child status, 
// and sends the data to the server for processing. 
// If not logged in, prompts the user to log in or continue as guest.
////////////////////////////////////////////////////////////////////////
function PostToServer() {
  const passengers = document.querySelectorAll(".passenger-input-box");
  const passengersdata = [];

  // Loop through each passenger form
  passengers.forEach(passenger => {
    var leadPassengerStatus = false;
    if (passenger.classList.contains("lead-passenger")) {
      leadPassengerStatus = true;
    }

    var adultpassenger = true;
    if (passenger.classList.contains("childpassenger")) {
      adultpassenger = false;
    } else if (passenger.classList.contains("adultpassenger")) {
      adultpassenger = true;
    }

    const passengerdata = {
      leadpassenger: leadPassengerStatus,
      adultpassenger: adultpassenger
    };

    // Gather passenger input values
    const inputitems = passenger.querySelectorAll(".input-wrapper .form-row");
    inputitems.forEach(row => {
      const input = row.children[1]; 
      const name = input.name;
      const value = input.value;

      if (name) {
        passengerdata[name] = value;
      }
    });

    // Add to main passenger list
    passengersdata.push(passengerdata);
  });

  // Convert passenger details into JSON
  const jsonData = JSON.stringify(passengersdata);

  // Post to server for storage
  fetch('../../checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonData
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);

    if (result.success) {
      // Determine if user is logged in
      const statusEl = document.getElementById("user-status");
      const isLoggedIn = statusEl.dataset.loggedin === "true";

      if (!isLoggedIn) {
        // Show guest or login option
        modelshow();
        const modelitems = document.querySelector(".modalDetails");
        modelitems.classList.add("CreateForm");
        modelitems.innerHTML =`
          <button class="CreateAccountButton loginbut">Log in</button>
          <h1> OR </h1>
          <button class="CreateAccountButton guestbut">Continue as guest</button>
        `;

        const guestbut = document.querySelector(".guestbut");
        const loginbut = document.querySelector(".loginbut");

        // Redirect to login if chosen
        loginbut.addEventListener("click", () => {
          window.location.href = '/auth/login?redirect=/checkout/payment';
        });

        // Continue as guest if chosen
        guestbut.addEventListener("click", () => {
          window.location.href = '../../checkout/payment';
        });

      } else {
        // Already logged in — redirect to payment
        window.location.href = '../../checkout/payment';
      }

    } else {
      alert("Failed to save passenger details.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

////////////////////////////////////////////////////////////////////////
// Function: CheckValidationOfValue
// Validates a single input based on its type (email, tel, text, date, select).
// Displays an error if invalid and clears the field for correction.
////////////////////////////////////////////////////////////////////////
function CheckValidationOfValue(value, type, element) {
  value = value.trim();

  if (value === "") {
    showError(element, "This field is required.");
    return false;
  }

  switch (type) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(element, "Please enter a valid email address.");
        return false;
      }
      break;

    case "tel":
      if (!/^\+?[0-9\s\-]{7,15}$/.test(value)) {
        showError(element, "Enter a valid phone number.");
        return false;
      }
      break;

    case "text":
      if (value.length < 2) {
        showError(element, "Too short. Enter at least 2 characters.");
        return false;
      }
      break;

    case "date":
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        showError(element, "Please enter a valid date.");
        return false;
      }
      break;

    case "select-one":
      if (value === "") {
        showError(element, "Please select an option.");
        return false;
      }
      break;
  }

  clearError(element);
  return true;
}

////////////////////////////////////////////////////////////////////////
// Function: showError
// Highlights an input field and sets a placeholder message to indicate 
// the error. For select elements, updates the default option.
////////////////////////////////////////////////////////////////////////
function showError(inputElement, message) {
  inputElement.classList.add("input-error");

  if (inputElement.tagName === "SELECT") {
    const defaultOption = inputElement.querySelector('option[value=""]');
    if (defaultOption) {
      defaultOption.textContent = message;
      inputElement.value = "";
    }
  } else {
    inputElement.value = "";
    inputElement.placeholder = message;
  }
}

////////////////////////////////////////////////////////////////////////
// Function: clearError
// Removes error styling from an input field and restores its placeholder.
////////////////////////////////////////////////////////////////////////
function clearError(inputId) {
  inputId.classList.remove("input-error");
  inputId.placeholder = "";
}
