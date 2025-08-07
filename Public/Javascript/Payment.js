////////////////////////////////////////////////////////////////////////
// Created 27/07/2025 by Tommy Mannix
// This script handles the payment form validation and submission 
// process. It checks input values (card details, CVV, expiry dates, etc.)
// and if valid, posts the payment details to the server. 
// On success, the user is redirected to the booking confirmation page.
////////////////////////////////////////////////////////////////////////


// Identify the payment submission button
const paymentButton = document.querySelector(".button-proceed");

// Add event listener to process payment when the button is clicked
paymentButton.addEventListener("click", () => {
  if (checkValidation() == true) {
    PostToServer();
  } else {
    console.log(checkValidation());
  }
});

////////////////////////////////////////////////////////////////////////
// Function: checkValidation
// Iterates through all input fields in the payment form. 
// Uses CheckValidationOfValue to ensure each input meets 
// the defined rules (e.g., correct CVV, expiry date format).
////////////////////////////////////////////////////////////////////////
function checkValidation() {
  const inputitems = document.querySelectorAll(".input-wrapper");
  let validated = true;

  for (const input of inputitems) {
    const rowitems = input.querySelectorAll(".form-row");

    for (const row of rowitems) {
      const inputField = row.children[1]; // Identify the form input
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
// Collects payment form data, builds a JSON object, 
// and sends it to the server endpoint. On successful 
// response, redirects to the confirmation page.
////////////////////////////////////////////////////////////////////////
function PostToServer() {
  const paymentData = {};

  // Gather payment form inputs
  const inputitems = document.querySelectorAll(".input-wrapper .form-row");
  inputitems.forEach(row => {
    const input = row.children[1]; 
    const name = input.name;
    const value = input.value;

    if (name) {
      paymentData[name] = value;
    }
  });

  // Convert payment data into JSON
  const jsonData = JSON.stringify(paymentData);

  // Post payment data to server
  fetch('../../checkout/payment', {
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
      // On success, redirect to confirmation
      window.location.href = "../../checkout/confirmation";
      alert("working");
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
// Validates each payment input field depending on its type.
// Handles checks for required fields, email, phone number, 
// card number, CVV, and expiry date formats.
////////////////////////////////////////////////////////////////////////
function CheckValidationOfValue(value, type, element) {
  value = value.trim();

  // Required check
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
      if (element.name === "cvv" && !/^\d{3,4}$/.test(value)) {
        showError(element, "CVV must be 3 or 4 digits.");
        return false;
      }

      if ((element.name === "issueDate" || element.name === "ExpiryDate") && 
          !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        showError(element, "Enter date in MM/YY format.");
        return false;
      }

      if (element.name === "cardNumber" && !/^\d{13,19}$/.test(value)) {
        showError(element, "Enter a valid card number.");
        return false;
      }

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
// Adds error styling to invalid input fields. 
// Displays error message in placeholder text or updates 
// default select option text.
////////////////////////////////////////////////////////////////////////
function showError(inputElement, message) {
  inputElement.classList.add("input-error");

  if (inputElement.tagName === "SELECT") {
    const defaultOption = inputElement.querySelector('option[value=""]');
    if (defaultOption) {
      defaultOption.textContent = message;
      inputElement.value = ""; // reset selection
    }
  } else {
    if (inputElement.value.trim() === "") {
      inputElement.placeholder = message;
      inputElement.value = "";
    } else {
      inputElement.value = message;
    }
  }
}

////////////////////////////////////////////////////////////////////////
// Function: clearError
// Removes error styling and restores placeholder text 
// for corrected input fields.
////////////////////////////////////////////////////////////////////////
function clearError(inputId) {
  inputId.classList.remove("input-error");
  inputId.placeholder = "";
}
