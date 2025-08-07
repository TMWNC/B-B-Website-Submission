////////////////////////////////////////////////////////////////////////
// This module handles the conversion of dates and times for the system 
// It provides helper functions for formatting dates and manipulating times
// Created 20/07/2025 by Tommy Mannix
////////////////////////////////////////////////////////////////////////

/*
* ConvertDate(rawDate)
* Converts a raw UTC date into DD/MM/YYYY format
*/
function ConvertDate(rawDate){

  // Parse the raw date into a JavaScript Date object
  const dateObj = new Date(rawDate);

  // Extract and format day, month, and year with zero padding
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = dateObj.getFullYear();

  // Construct the formatted date string
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}


/*
* addMinutesToTime(timeStr, minutesToAdd)
* Adds a specified number of minutes to a given HH:MM time string
* Returns the updated time in HH:MM format
*/
function addMinutesToTime(timeStr, minutesToAdd) {
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a date object using today's date and set provided time
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // Add the specified minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Format the updated time as HH:MM
  const newHours = String(date.getHours()).padStart(2, '0');
  const newMinutes = String(date.getMinutes()).padStart(2, '0');

  return `${newHours}:${newMinutes}`;
}


/*
* convertminstoHour(minutes)
* Converts a given number of minutes into hours (decimal value)
*/
function convertminstoHour(minutes){
  const hours = minutes / 60;
  return hours;
}


/*
* standardisetime(time)
* Standardises a time string to HH:MM format by trimming seconds if present
*/
function standardisetime(time){
  const formatted = time.slice(0, 5); // Example: "08:00"
  return formatted;
}
