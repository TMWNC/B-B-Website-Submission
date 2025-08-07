

// Created 14/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
////////// This route caters for all /api routes
////////////////////////////////////////////////////////


const express = require("express");
const router =  express.Router();
const hotelLogic = require("../Modules/HotelBusinessLogic")

/////////////////////////////////////////////////////////
////// Middle ware that will be needed for route/////////
// Check authorisation of express sessions for protected end points
const CheckAuth = require('../middleware/checkauth');
const validation = require('../middleware/Validation');
const { validationResult } = require('express-validator');


const mysqlModule = require('../Modules/mysqlmodule');
//////////////////////////////////////////////////////////
//////             Start of routes     ///////////////////
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//////             /api        ///////////////////
 router.get('/',  async(req, res) => {
  

    
 });

 router.post('/',  async(req, res) => {

  
});



//////////////////////////////////////////////////////////
//////             /api/listhotels        ///////////////////
// accepts the following 
// destinationID 
// numOfNights 
// numOfAdults
// numOfChildren
// Returns list of JSON hotels 
// Use validation to ensure input is safe
router.get('/listhotels',validation.ValidateGetHotels,  async(req, res) => {

   // check the validation
  const errors = validationResult(req);
  // if there is an error that is detected from the validation
  if (!errors.isEmpty()) {
    // get the first error
    const firstError = errors.array()[0].msg;
    // flash the first error
    req.flash('error_msg', firstError);
    // redirect out
    res.json(firstError);
  }

  
try{
  // encode the destination ID in destinationID constant
var destinationID = req.query.destinationID || null;
const numOfNights = req.query.numOfNights || 1;
const numOfAdults = req.query.numOfAdults || 1;
const numOfChildren = req.query.numOfChildren || 0;
const OriginID =  req.query.originID || null;
const dateitem = req.query.date

console.log("origin is " + OriginID)
console.log(dateitem)
if(destinationID =="null"){
  destinationID = null;
}
   // query the database
   const hotelList = await mysqlModule.getHotelList(destinationID);

   // find the total cost of the holiday
   await hotelLogic.calculateCostOfHoliday(hotelList,numOfAdults,numOfChildren,numOfNights,OriginID,dateitem)

   //output the result as JSON for use asyncronously
    res.json(hotelList);
  }
  catch (err){
    console.log(err)
    res.json("No Valid hotels for selection")
  }


});




//////////////////////////////////////////////////////////
//////             /api/hotel        ///////////////////
// accepts the following 
// destinationID 
// numOfNights 
// numOfAdults
// numOfChildren
// Returns list of JSON details for a specified hotel 
// Use validation to ensure input is safe
router.get('/hotel',validation.ValidateGetHotels,  async(req, res) => {

  // check the validation
 const errors = validationResult(req);
 // if there is an error that is detected from the validation
 if (!errors.isEmpty()) {
   // get the first error
   const firstError = errors.array()[0].msg;
   // flash the first error
   req.flash('error_msg', firstError);
   // redirect out
   res.json(firstError);
 }

 
try{
 // encode the hotel ID in hotelID 
var hotelID = req.query.hotelid || null;
const numOfNights = req.query.numOfNights || 1;
const numOfAdults = req.query.numOfAdults || 1;
const numOfChildren = req.query.numOfChildren || 0;
const OriginID =  req.query.originID || null;
const dateitem = req.query.date

console.log(dateitem)

console.log("origin is " + OriginID)


console.log("test" + OriginID)
// if the Hotel ID is null mark it as null
if(hotelID =="null"){
 hotelID = null;
}
  // query the database and get the hotels details
  const hotel = await mysqlModule.getHotelDetail(hotelID);
  // rip the room information to find its pricing
const roomJSON = JSON.parse(hotel[0].Rooms)
 // find the pricing for the rooms using the same business logic as the hotel search
  const hotelpricing = await hotelLogic.calculateCostOfHoliday(roomJSON,numOfAdults,numOfChildren,numOfNights,OriginID,dateitem,hotel)

  
  // set the rooms to be the new updated JSON
  hotel[0].Rooms = hotelpricing;
  //output the result as JSON for use asyncronously
   res.json(hotel);
 }
 catch (err){
   console.log(err)
   res.json("No Valid hotels for selection")
 }


});



//////////////////////////////////////////////////////////
//////             /api/listflights       ///////////////////
// Returns list of JSON flights
// include validation from ValidateGetFlights
router.get('/listflights', validation.ValidateGetFlights, async(req, res) => {
   // check the validation
   const errors = validationResult(req);
   // if there is an error that is detected from the validation
   if (!errors.isEmpty()) {
     // get the first error
     const firstError = errors.array()[0].msg;
     // flash the first error
     req.flash('error_msg', firstError);
     // redirect out
     res.json(firstError);
   }
 try{
   // encode the destination ID in destinationID constant
   const  departureID  = req.query.OutBound || null;
   const destinationID = req.query.InBound || null;
   const Flightdate = req.query.OutDate || null;
   const numOfNights = parseInt(req.query.numOfnights) || null;
 


let returndate = null;

if (Flightdate) {
 

  
  const [day, month, year] = Flightdate.split('/').map(Number);

  // Months in JavaScript are 0-based (0 = January, 11 = December)
  const dateObject = new Date(`${year}/${month}/ ${day}`);

dateObject.setDate(dateObject.getDate() + numOfNights);


const dayOut = String(dateObject.getDate()).padStart(2, '0');
const monthOut = String(dateObject.getMonth() + 1).padStart(2, '0');
const yearOut = dateObject.getFullYear();


 returndate = `${dayOut}/${monthOut}/${yearOut}`


}

   
    // query the database
    const outboundflightlist = await mysqlModule.getFlightList(Flightdate,departureID,destinationID);


   
    const inboundflightlist = await mysqlModule.getFlightList(returndate,destinationID,departureID)

    const flights = {outboundflightlist,inboundflightlist}
    //output the result as JSON for use asyncronously
     res.json(flights);
   }
   catch{
     res.json("No Valid hotels for selection")
   }
 



});





//////////////////////////////////////////////////////////
//////             /api/GetOutboundAirport        ///////////////////
// Returns list of JSON Airports within the UK for use in the search bar
router.get('/GetOutboundAirport',  async(req, res) => {

try{
  // query the database
  const OutAirports = await mysqlModule.getOutAirports();
  //output the result as JSON for use asyncronously
   res.json(OutAirports);
 }
 catch{
   res.json("No Valid Airports")
 }
});



//////////////////////////////////////////////////////////
//////             /api/GetDestinations        ///////////////////
// Returns list of countries that can be flown from, from a selected departure airport
router.get('/GetDestinations',validation.ValidateGetDestinations,  async(req, res) => {

   // check the validation
   const errors = validationResult(req);
   // if there is an error that is detected from the validation
   if (!errors.isEmpty()) {
     // get the first error
     const firstError = errors.array()[0].msg;
     // flash the first error
     req.flash('error_msg', firstError);
     // redirect out
     res.json(firstError);
   }
 
   
 try{
   // encode the OriginID in destinationID constant
   const  departureID  = req.query.OriginID ||  null;
    // query the database
    const Countries = await mysqlModule.getDestinationCountries(departureID);
    //output the result as JSON for use asyncronously
     res.json(Countries);
   }
   catch{
     res.json("No Valid countries")
   }
  });




//////////////////////////////////////////////////////////
//////             /api/getDestinationAirports        ///////////////////
// Returns list of 
router.get('/getDestinationAirports',validation.ValidateGetDestinations,  async(req, res) => {

  // check the validation
  const errors = validationResult(req);
  // if there is an error that is detected from the validation
  if (!errors.isEmpty()) {
    // get the first error
    const firstError = errors.array()[0].msg;
    // flash the first error
    req.flash('error_msg', firstError);
    // redirect out
    res.json(firstError);
  }

  
try{
  // encode the OriginID in destinationID constant
  const  departureID  = req.query.OriginID ||  null;
   // query the database
   const airports = await mysqlModule.getDestinationCountries(departureID);
   //output the result as JSON for use asyncronously
    res.json(airports);
  }
  catch{
    res.json("No Valid countries")
  }
 });



  
  module.exports = router