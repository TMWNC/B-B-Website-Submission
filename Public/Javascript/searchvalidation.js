/// Created 18/07/2025 by Tommy Mannix
////////////////////////////////////////////////////////////////////////
// This script validates the input on the input form and checks to make 
// sure it meets validation rules. If valid, the data can be packaged 
// into a JSON string ready to be posted to the server.
////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
// Function: checkSearchValidation
// Runs validation checks on all inputs inside the given form block.
// Returns true if all inputs pass validation, otherwise false.
////////////////////////////////////////////////////////////////////////
function checkSearchValidation(block) {

  console.log(block);

  // Get all input wrapper divs from the provided block
  const inputitems = block.querySelectorAll("div");

  // Assume validation will pass unless proven otherwise
  var validated = true;

  // Iterate through each wrapper and validate its input field
  for (const row of inputitems) {
    const input = row.children[1];  // The input/select element
    validated = CheckValidationOfValue(input.value, input.type, input);
    console.log(validated);

    if (!validated) {
      // Stop checking further if one field fails
      break;
    }
  }

  console.log("fire");

  // Return validation outcome
  if (validated) {
    return true;
  } else {
    return false;
  }
}



////////////////////////////////////////////////////////////////////////
// Function: CheckValidationOfValue
// Validates a single input field based on its type
// Supported types: email, tel, text, date, select-one
////////////////////////////////////////////////////////////////////////
function CheckValidationOfValue(value, type, element) {
  // Trim whitespace for consistent validation
  value = value.trim();

  // Required check — all inputs must have a value
  if (value === "") {
    showError(element, "This field is required.");
    return false;
  }

  // Type-specific checks
  switch (type) {

    // Validate email format
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(element, "Please enter a valid email address.");
        return false;
      }
      break;

    // Validate phone number (7 to 15 digits, optional +)
    case "tel":
      if (!/^\+?[0-9\s\-]{7,15}$/.test(value)) {
        showError(element, "Enter a valid phone number.");
        return false;
      }
      break;

    // Validate text (minimum 2 characters)
    case "text":
      if (value.length < 2) {
        showError(element, "Too short. Enter at least 2 characters.");
        return false;
      }
      break;

    // Validate date (must be a valid Date object)
    case "date":
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        showError(element, "Please enter a valid date.");
        return false;
      }
      break;

    // Validate select-one dropdown (must have a value selected)
    case "select-one":
      if (value === "") {
        showError(element, "Please select an option.");
        return false;
      }
      break;
  }

  // If all checks pass, clear errors and return true
  clearError(element);
  return true;
}



////////////////////////////////////////////////////////////////////////
// Function: showError
// Adds error styling and a helpful message to the given input field.
////////////////////////////////////////////////////////////////////////
function showError(inputElement, message) {
  inputElement.classList.add("input-error");

  if (inputElement.tagName === "SELECT") {
    // For dropdowns, update placeholder option
    const defaultOption = inputElement.querySelector('option[value=""]');
    if (defaultOption) {
      defaultOption.textContent = message;
      inputElement.value = ""; // Force reselection
    }
  } else {
    // For input fields, clear value and show message as placeholder
    inputElement.value = "";
    inputElement.placeholder = message;
  }
}



////////////////////////////////////////////////////////////////////////
// Function: clearError
// Removes error styling and resets placeholder text on an input field.
////////////////////////////////////////////////////////////////////////
function clearError(inputId) {
  inputId.classList.remove("input-error");
  inputId.placeholder = ""; // Restore default placeholder
}
