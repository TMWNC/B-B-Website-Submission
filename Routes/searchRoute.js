// Created 17/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////////////////////
// This route caters for all /search routes
////////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();

////////////////////////////////////////////////////////////////////////
//                     Start of /search routes
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// GET /search/hotel
// - Renders the hotel search page
////////////////////////////////////////////////////////////////////////
router.get('/hotel', async (req, res) => {
  res.render("../views/~searchHotel/search");
});


////////////////////////////////////////////////////////////////////////
// POST /search (currently unused)
// - Placeholder for future functionality
////////////////////////////////////////////////////////////////////////
router.post('/', async (req, res) => {
  // Reserved for future POST logic
});


////////////////////////////////////////////////////////////////////////
// GET /search/hotel/hoteldetail
// - Renders the hotel detail page
////////////////////////////////////////////////////////////////////////
router.get('/hotel/hoteldetail', async (req, res) => {
  res.render("../views/~hotelDetail/hotelDetail");
});


////////////////////////////////////////////////////////////////////////
// POST /search/hotel/hoteldetail
// - Saves selected hotel details into session
////////////////////////////////////////////////////////////////////////
router.post('/hotel/hoteldetail', async (req, res) => {
  console.log(req.body);

  req.session.booking = {
    hotel: req.body.hotelid || null,
    numOfAdults: req.body.adult,
    numOfChildren: req.body.child || null,
    numOfNights: req.body.numOfNights,
    typeOfBooking: req.body.typeOfBooking,
    date: req.body.Date,
  };

  res.json({ success: true, message: "Hotel saved to session" });
});


////////////////////////////////////////////////////////////////////////
// GET /search/flights/inbound
// - Renders inbound flight selection page
////////////////////////////////////////////////////////////////////////
router.get('/flights/inbound', async (req, res) => {
  res.render("../views/~flights/flightsIN");
});


////////////////////////////////////////////////////////////////////////
// GET /search/flights/outbound
// - Renders outbound flight selection page
////////////////////////////////////////////////////////////////////////
router.get('/flights/outbound', async (req, res) => {
  res.render("../views/~flights/flightsOUT");
});


////////////////////////////////////////////////////////////////////////
// POST /search/flights/outbound
// - Stores outbound flight details in session
////////////////////////////////////////////////////////////////////////
router.post('/flights/outbound', async (req, res) => {
  const flightid = req.body.flightID;
  const date = req.body.date;

  req.session.outbound = {
    FlightID: flightid,
    dateOfTravel: date,
  };

  res.json({ success: true, message: "Outbound flight saved to session" });
});


////////////////////////////////////////////////////////////////////////
// POST /search/flights/inbound
// - Stores inbound flight details in session
////////////////////////////////////////////////////////////////////////
router.post('/flights/inbound', async (req, res) => {
  console.log(req.body);

  const flightid = req.body.flightID;
  const date = req.body.date;

  req.session.Inbound = {
    FlightID: flightid,
    dateOfTravel: date,
  };

  req.session.booking = {
    hotel: req.body.hotel || null,
    numOfAdults: req.body.adults,
    numOfChildren: req.body.child || null,
    numOfNights: req.body.numOfNights,
    typeOfBooking: req.body.type || null,
  };

  res.json({ success: true, message: "Inbound flight saved to session" });
});


////////////////////////////////////////////////////////////////////////
// Export router module
////////////////////////////////////////////////////////////////////////
module.exports = router;
