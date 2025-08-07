// Created 28/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
//          This route caters for all /account routes
////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const MySqlModule = require('../Modules/mysqlmodule');

/////////////////////////////////////////////////////////
// Middleware required for this route
// Includes authorisation check for protected endpoints
/////////////////////////////////////////////////////////
const CheckAuth = require('../middleware/checkauth');

//////////////////////////////////////////////////////////
//                Start of /account Routes
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// GET /account/bookings
// Returns a list of the logged-in user's bookings
// Retrieves the bookings using the customer ID stored 
// in the current session and passes them to the EJS view.
// check the user is authorised before allowing access
//////////////////////////////////////////////////////////
router.get('/bookings',CheckAuth.requireAuth, async (req, res) => {

  const customerbookings = await MySqlModule.GetCustomerBookingList(req.session.userID);

  console.log(customerbookings);

  res.render("../views/~account/ViewBookings", { customerbookings: customerbookings });
});

//////////////////////////////////////////////////////////
// POST /account/
// Placeholder for handling POST requests to /account
// Currently unused — reserved for future functionality.
//////////////////////////////////////////////////////////
router.post('/', async (req, res) => {

});

//////////////////////////////////////////////////////////
// Export the router for use in the main server file
//////////////////////////////////////////////////////////
module.exports = router;
