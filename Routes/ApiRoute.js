// Created 14/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////////////////////
// This route caters for all /api routes and handles hotel, flight,
// and destination-related endpoints for the travel application.
////////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const hotelLogic = require("../Modules/HotelBusinessLogic");
const mysqlModule = require('../Modules/mysqlmodule');

////////////////////////////////////////////////////////////////////////
// Required middleware for validation and authentication
////////////////////////////////////////////////////////////////////////
const CheckAuth = require('../middleware/checkauth');
const validation = require('../middleware/Validation');
const { validationResult } = require('express-validator');

////////////////////////////////////////////////////////////////////////
//                     Start of /api routes
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// Default /api route
// Handles root GET and POST requests
////////////////////////////////////////////////////////////////////////
router.get('/', async (req, res) => {
  // Placeholder root GET
});

router.post('/', async (req, res) => {
  // Placeholder root POST
});


////////////////////////////////////////////////////////////////////////
// /api/listhotels
// - Accepts: destinationID, numOfNights, numOfAdults, numOfChildren
// - Returns: List of available hotels with calculated costs
// - Includes input validation for security
////////////////////////////////////////////////////////////////////////
router.get('/listhotels', validation.ValidateGetHotels, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {

    
    var destinationID = req.query.destinationID || null;
    const numOfNights = req.query.numOfNights || 1;
    const numOfAdults = req.query.numOfAdults || 1;
    const numOfChildren = req.query.numOfChildren || 0;
    const OriginID = req.query.originID || null;
    const dateitem = req.query.date;

    if (destinationID == "null") destinationID = null;

    const hotelList = await mysqlModule.getHotelList(destinationID);
    await hotelLogic.calculateCostOfHoliday(
      hotelList,
      numOfAdults,
      numOfChildren,
      numOfNights,
      OriginID,
      dateitem
    );

    res.json(hotelList);
  } catch (err) {
    console.log(err);
    res.json("No Valid hotels for selection");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/hotel
// - Accepts: hotelid, numOfNights, numOfAdults, numOfChildren
// - Returns: JSON detail for the specified hotel with calculated pricing
// - Includes input validation for security
////////////////////////////////////////////////////////////////////////
router.get('/hotel', validation.ValidateGetHotels, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    var hotelID = req.query.hotelid || null;
    const numOfNights = req.query.numOfNights || 1;
    const numOfAdults = req.query.numOfAdults || 1;
    const numOfChildren = req.query.numOfChildren || 0;
    const OriginID = req.query.originID || null;
    const dateitem = req.query.date;

    if (hotelID == "null") hotelID = null;

    const hotel = await mysqlModule.getHotelDetail(hotelID);
    const roomJSON = JSON.parse(hotel[0].Rooms);

    const hotelpricing = await hotelLogic.calculateCostOfHoliday(
      roomJSON,
      numOfAdults,
      numOfChildren,
      numOfNights,
      OriginID,
      dateitem,
      hotel
    );

    hotel[0].Rooms = hotelpricing;
    res.json(hotel);
  } catch (err) {
    console.log(err);
    res.json("No Valid hotels for selection");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/listflights
// - Accepts: OutBound, InBound, OutDate, numOfnights
// - Returns: Outbound and inbound flight options
// - Includes date calculation for return flights
////////////////////////////////////////////////////////////////////////
router.get('/listflights', validation.ValidateGetFlights, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    const departureID = req.query.OutBound || null;
    const destinationID = req.query.InBound || null;
    const Flightdate = req.query.OutDate || null;
    const numOfNights = parseInt(req.query.numOfnights) || null;

    let returndate = null;
    if (Flightdate) {
      const [day, month, year] = Flightdate.split('/').map(Number);
      const dateObject = new Date(`${year}/${month}/${day}`);
      dateObject.setDate(dateObject.getDate() + numOfNights);

      const dayOut = String(dateObject.getDate()).padStart(2, '0');
      const monthOut = String(dateObject.getMonth() + 1).padStart(2, '0');
      const yearOut = dateObject.getFullYear();

      returndate = `${dayOut}/${monthOut}/${yearOut}`;
    }

    const outboundflightlist = await mysqlModule.getFlightList(
      Flightdate,
      departureID,
      destinationID
    );

    const inboundflightlist = await mysqlModule.getFlightList(
      returndate,
      destinationID,
      departureID
    );

    res.json({ outboundflightlist, inboundflightlist });
  } catch {
    res.json("No Valid flights for selection");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/GetOutboundAirport
// - Returns: List of all UK outbound airports
////////////////////////////////////////////////////////////////////////
router.get('/GetOutboundAirport', async (req, res) => {
  try {
    const OutAirports = await mysqlModule.getOutAirports();
    res.json(OutAirports);
  } catch {
    res.json("No Valid Airports");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/GetDestinations
// - Accepts: OriginID
// - Returns: List of countries available from the selected origin airport
////////////////////////////////////////////////////////////////////////
router.get('/GetDestinations', validation.ValidateGetDestinations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    const departureID = req.query.OriginID || null;
    const Countries = await mysqlModule.getDestinationCountries(departureID);
    res.json(Countries);
  } catch {
    res.json("No Valid countries");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/getDestinationAirports
// - Accepts: OriginID
// - Returns: List of airports available for the selected origin
////////////////////////////////////////////////////////////////////////
router.get('/getDestinationAirports', validation.ValidateGetDestinations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    const departureID = req.query.OriginID || null;
    const airports = await mysqlModule.getDestinationCountries(departureID);
    res.json(airports);
  } catch {
    res.json("No Valid airports");
  }
});





////////////////////////////////////////////////////////////////////////
// /api/Admin/GetMontlySales
//
// - Returns: the sales stats for the current month
////////////////////////////////////////////////////////////////////////
router.get('/admin/GetMonthlySales', validation.ValidateGetDestinations, CheckAuth.requireStaffAuth ,/*validation.requireAdminAuth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    
    const salesdata = await mysqlModule.GetMontlySales();
    res.json(salesdata);
  } catch {
    res.json("No Valid airports");
  }
});




////////////////////////////////////////////////////////////////////////
// /api/Admin/GetYearlySales
//
// - Returns: the sales stats for the last year month
////////////////////////////////////////////////////////////////////////
router.get('/admin/GetYearlySales', validation.ValidateGetDestinations, CheckAuth.requireStaffAuth, /*validation.requireAdminAuth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    
    const salesdata = await mysqlModule.GetYearlySales();
    res.json(salesdata);
  } catch {
    res.json("No Valid airports");
  }
});





////////////////////////////////////////////////////////////////////////
// /api/Admin/branchGetMonthlySales
//
// - Returns: the sales stats for the last year month
////////////////////////////////////////////////////////////////////////
router.get('/admin/branchGetMonthlySales', validation.ValidateGetDestinations,CheckAuth.requireStaffAuth , /*validation.requireAdminAuth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    
    const salesdata = await mysqlModule.GetBranchSalesLast30Days();
    res.json(salesdata);
  } catch {
    res.json("No Valid airports");
  }
});



////////////////////////////////////////////////////////////////////////
// /api/Admin/hotelTopSellers
//
// - Returns: the Hotel Sales stats for the last 12 months
////////////////////////////////////////////////////////////////////////
router.get('/admin/hotelTopSellers', validation.ValidateGetDestinations,CheckAuth.requireStaffAuth , /*validation.requireAdminAuth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    
    const salesdata = await mysqlModule.GetTopAndBottomHotelsByBranch();
    res.json(salesdata);
  } catch {
    res.json("No Valid airports");
  }
});


////////////////////////////////////////////////////////////////////////
// /api/Admin/GetTrending
//
// - Returns: A list of Trending destinations in the last 30 days based 
// o data in the last 60 days
////////////////////////////////////////////////////////////////////////
router.get('/admin/GetTrending', validation.ValidateGetDestinations,CheckAuth.requireStaffAuth , /*validation.requireAdminAuth,*/ async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.json(firstError);
  }

  try {
    
    const salesdata = await mysqlModule.GetTrendingDestinations();
    res.json(salesdata);
  } catch {
    res.json("No Valid airports");
  }
});

////////////////////////////////////////////////////////////////////////
// Export router module for use in main server
////////////////////////////////////////////////////////////////////////
module.exports = router;
