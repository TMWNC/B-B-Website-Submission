
// Created 09/07/2025 by Tommy Mannix

//////////////////////////////////////////////////////////////////////////////////
//// This middleware the use of validation on End points to secure them from 
//// invalid inputs and SQL injection 
//// This system operates on Express validator and is separated by function for
//// each end point
/////////////////////////////////////////////////////////////////////////////////
const { body,query } = require('express-validator');


/// Validation for Registration page for new users  For all ensure iti s trimmed and escaped
// to protect from SQL injection
const validateRegister = [
    // email input
body('email').notEmpty().withMessage("Email is required")
.isEmail().withMessage("Please enter a valid Email")
.normalizeEmail().escape().trim(),
 // password input
body('Password').notEmpty().withMessage("Password is required")
.escape().trim(),

//Fore name input
body('FName').notEmpty().withMessage("Please enter a First Name")
.escape().trim(),


// surname input
body('SName').notEmpty().withMessage("Please enter a Surname")
.escape().trim()

];




////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// Validation for login page for existing users it is  trimmed and escaped
// to protect from SQL injection
const validateLogin = [
    // Email input
    body('email').notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid Email")
    .normalizeEmail().escape().trim(),
    // Password in plain text input
    body('password').notEmpty().withMessage("Password is required")
    .escape().trim(),
    
    ];
    

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// validation for /api/listhotels 
// checks the destination ID is a number and is escaped and trimmed before usage
const ValidateGetHotels = [
    query('destinationID')
    .escape().trim(),
    
    query('numOfNights')
  
    .escape().trim(),

    query('numOfAdults')
   
    .escape().trim(),

    query('numOfChildren')

    .escape().trim(),
    
    query('originID')
    .escape().trim(),

    query('date')
    .escape().trim(),
    
    
    ];


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

/// validation for /api/hotel 
// checks the destination ID is a number and is escaped and trimmed before usage
const ValidateGetHotelDetail = [
  query('hotelid')
  .escape().trim(),
  
  query('numOfNights')

  .escape().trim(),

  query('numOfAdults')
 
  .escape().trim(),

  query('numOfChildren')

  .escape().trim(),
  
  ];


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



/// validation for /api/GetDestinations 
// checks the destination ID is a number and is escaped and trimmed before usage
const ValidateGetDestinations = [
  query('OriginID')
  .escape().trim(),
  
  
  ];


/// validation for /api/listhotels 
// checks the destination ID is a number and is escaped and trimmed before usage
const ValidateGetFlights = [
    query('OutBound').notEmpty().withMessage("Needs an outbound ID")
    .isNumeric().withMessage("Please enter a valid number")
    .escape().trim(),
   
    query('InBound').notEmpty().withMessage("Needs an Inbound ID")
    .isNumeric().withMessage("Please enter a valid number")
    .escape().trim(),
  
    query('numOfnights').notEmpty().withMessage("Needs a number of nights")
    .isNumeric().withMessage("Please enter a valid number")
    .escape().trim(),


    query('OutDate')
    .notEmpty().withMessage("Flight date is required")
    .matches(/^([0-2]\d|3[01])\/(0\d|1[0-2])\/\d{4}$/).withMessage("Must be in DD/MM/YYYY format")
    .custom((value) => {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }).withMessage("Invalid calendar date").escape().trim(),
    ];

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////



module.exports = {
    validateRegister,
    validateLogin,
    ValidateGetHotels,
    ValidateGetFlights,
    ValidateGetDestinations,
    ValidateGetHotelDetail
  };