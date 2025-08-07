

// Created 25/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////
////////// This route caters for all /checkout routes
////////////////////////////////////////////////////////


const express = require("express");
const router =  express.Router();

const mysqlModule = require('../Modules/mysqlmodule');
const basketBuilder = require('../Modules/buildBasket');
//////////////////////////////////////////////////////////
//////             Start of routes     ///////////////////
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
//////             /home        ///////////////////
 router.get('/',  async(req, res) => {
   if(  req.session.booking == null  )
   {
      res.redirect("/home")
   }




var hoteinformation,flightoutinfo,flightIninfo,hotelcosts,airtravelprice,holidaytotal

console.log("type is " + req.session.booking.typeOfBooking)

// hotel only
if(req.session.booking.typeOfBooking == 1){
    hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
   hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
    holidaytotal = Number(hotelcosts.costoverall)

// add all information to the booking JSON
req.session.booking.hotelinformation = hoteinformation
req.session.booking.hotelcosts = hotelcosts
req.session.booking.holidaytotal = holidaytotal


    res.render("../views/~booking/basket",{
    
    
      bookinginfo: req.session.booking  ,  
      hotelinformation: hoteinformation  || null,       // any object or array
      hotelcosts:hotelcosts,
      holidaytotal:holidaytotal
    });
}
// air travel only
else if(req.session.booking.typeOfBooking == 2)
{
    flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
    flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
     airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
      holidaytotal =  (airtravelprice.totalcost)

      // add all information to the booking JSON

req.session.booking.flightoutinfo = flightoutinfo
req.session.booking.flightIninfo = flightIninfo
req.session.booking.airtravelprice = airtravelprice
req.session.booking.holidaytotal = holidaytotal
req.session.booking.outbound = req.session.outbound 
req.session.booking.inbound = req.session.Inbound 

      console.log(req.session.booking)
      res.render("../views/~booking/basket",{
         outbound:req.session.outbound || null,
         inbound:req.session.Inbound  || null,
         bookinginfo: req.session.booking  ,  
         flightoutinfo: flightoutinfo  || null,   // session data
         flightIninfo: flightIninfo  || null,
         airtravelprice:airtravelprice  || null,
         holidaytotal:holidaytotal
       });

}
else if(req.session.booking.typeOfBooking == 3){
   hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
   hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
   flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
   flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
    airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
     holidaytotal = Number(hotelcosts.costoverall) + (airtravelprice.totalcost)

// add all information to the booking JSON
req.session.booking.hotelinformation = hoteinformation
req.session.booking.hotelcosts = hotelcosts
req.session.booking.flightoutinfo = flightoutinfo
req.session.booking.flightIninfo = flightIninfo
req.session.booking.airtravelprice = airtravelprice
req.session.booking.holidaytotal = holidaytotal
req.session.booking.outbound = req.session.outbound 
req.session.booking.inbound = req.session.Inbound 
     res.render("../views/~booking/basket",{
      outbound:req.session.outbound || null,
      inbound:req.session.Inbound  || null,
      bookinginfo: req.session.booking  ,  
      hotelinformation: hoteinformation  || null,       // any object or array
      flightoutinfo: flightoutinfo  || null,   // session data
      flightIninfo: flightIninfo  || null,
      airtravelprice:airtravelprice  || null,
      hotelcosts:hotelcosts,
      holidaytotal:holidaytotal
    });
}
 

  
    
 });


//////////////////////////////////////////////////////////
//////             /payment        ///////////////////
router.get('/payment',  async(req, res) => {
  if(  req.session.booking == null  )
  {
     res.redirect("/home")
  }

console.log(req.session.booking)
  var hoteinformation,flightoutinfo,flightIninfo,hotelcosts,airtravelprice,holidaytotal

  console.log("type is " + req.session.booking.typeOfBooking)
  
  // hotel only
  if(req.session.booking.typeOfBooking == 1){
      hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
     hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
      holidaytotal = Number(hotelcosts.costoverall)
  


      res.render("../views/~booking/payment",{
      
      
        bookinginfo: req.session.booking  ,  
        hotelinformation: hoteinformation  || null,       // any object or array
        hotelcosts:hotelcosts,
        holidaytotal:holidaytotal,
     
      });
  }
  // air travel only
  else if(req.session.booking.typeOfBooking == 2)
  {
      flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
      flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
       airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
        holidaytotal =  (airtravelprice.totalcost)
  

  
   
        res.render("../views/~booking/payment",{
           outbound:req.session.outbound || null,
           inbound:req.session.Inbound  || null,
           bookinginfo: req.session.booking  ,  
           flightoutinfo: flightoutinfo  || null,   // session data
           flightIninfo: flightIninfo  || null,
           airtravelprice:airtravelprice  || null,
           holidaytotal:holidaytotal,
         
         });
  
  }
  else if(req.session.booking.typeOfBooking == 3){
     hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
     hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
     flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
     flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
      airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
       holidaytotal = Number(hotelcosts.costoverall) + (airtravelprice.totalcost)
  



       res.render("../views/~booking/payment",{
        outbound:req.session.outbound || null,
        inbound:req.session.Inbound  || null,
        bookinginfo: req.session.booking  ,  
        hotelinformation: hoteinformation  || null,       // any object or array
        flightoutinfo: flightoutinfo  || null,   // session data
        flightIninfo: flightIninfo  || null,
        airtravelprice:airtravelprice  || null,
        hotelcosts:hotelcosts,
        holidaytotal:holidaytotal,
    
      });
  }
   
  
});



router.post('/',  async(req, res) => {


  const passengerdetails = req.body;

  console.log("post sent")
  console.log(passengerdetails)
  // store the information in the session


  req.session.booking.passengers = passengerdetails
  res.json({ success: true,message: "passenger details saved to session" });

});

router.post('/payment', async (req, res) => {
  const payment = req.body;
  console.log("post sent", payment);

  const hotelInfo = req.session.booking.hotelinformation[0];
  const roomsArray = JSON.parse(hotelInfo.Rooms);

  const convertToMySQLDateFormat = (dateStr) => {
    if (!dateStr) return null;
  
    // If already in YYYY-MM-DD format, just return it
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
  
    // If in DD/MM/YYYY format, convert
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
  
    throw new Error(`Unsupported date format: ${dateStr}`);
  };
  

  const date =
    req.session.booking.typeOfBooking == 1
      ? convertToMySQLDateFormat(req.session.booking.date)
      : convertToMySQLDateFormat(req.session.booking.inbound.dateOfTravel);

  const normalisedPassengers = req.session.booking.passengers.map((p) => {
    const passenger = {};
    Object.entries(p).forEach(([key, value]) => {
      const normalKey = key.replace(/-\d+$/, '');
      passenger[normalKey] = value;
    });
    return passenger;
  });

  req.session.booking.payment = payment;
  const user = req.session.userID || null;
  const outboundFlightTimeID = req.session.booking.flightoutinfo?.[0]?.FlightTimeID || null;
  const outboundFlightDate = convertToMySQLDateFormat(req.session.booking.outbound?.dateOfTravel) || null;
  const inboundFlightTimeID = req.session.booking.flightIninfo?.[0]?.FlightTimeID || null;
  const inboundFlightDate = convertToMySQLDateFormat(req.session.booking.inbound?.dateOfTravel) || null;
  
  const booking = await mysqlModule.CreateFullBooking(
    user,
    req.session.booking.typeOfBooking,
    payment,
    normalisedPassengers,
    roomsArray?.[0]?.RoomDetailID || null,
    req.session.booking.hotelcosts?.numberofRooms || null,
    date,
    req.session.booking.numOfNights || null,
    outboundFlightTimeID,
    outboundFlightDate,
    inboundFlightTimeID,
    inboundFlightDate
  );
  

 req.session.bookingid = booking

  res.json({ success: true, message: "Booking and passengers stored", bookingID: booking });
});



//////////////////////////////////////////////////////////
//////             /confirmation        ///////////////////
router.get('/confirmation',  async(req, res) => {
  if(  req.session.booking == null  )
  {
     res.redirect("/home")
  }


  var hoteinformation,flightoutinfo,flightIninfo,hotelcosts,airtravelprice,holidaytotal

  console.log("type is " + req.session.booking.typeOfBooking)
  
  // hotel only
  if(req.session.booking.typeOfBooking == 1){
      hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
     hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
      holidaytotal = Number(hotelcosts.costoverall)
  


      res.render("../views/~booking/BookingConfirmation",{
      
      
        bookinginfo: req.session.booking  ,  
        hotelinformation: hoteinformation  || null,       // any object or array
        hotelcosts:hotelcosts,
        holidaytotal:holidaytotal,
     bookingID:req.session.bookingid 
      });
  }
  // air travel only
  else if(req.session.booking.typeOfBooking == 2)
  {
      flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
      flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
       airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
        holidaytotal =  (airtravelprice.totalcost)
  

  
   
        res.render("../views/~booking/BookingConfirmation",{
           outbound:req.session.outbound || null,
           inbound:req.session.Inbound  || null,
           bookinginfo: req.session.booking  ,  
           flightoutinfo: flightoutinfo  || null,   // session data
           flightIninfo: flightIninfo  || null,
           airtravelprice:airtravelprice  || null,
           holidaytotal:holidaytotal,
           bookingID:req.session.bookingid 
         
         });
  
  }
  else if(req.session.booking.typeOfBooking == 3){
     hoteinformation = await mysqlModule.getHotelDetail(req.session.booking.hotel)
     hotelcosts = await basketBuilder.hotelcosts(hoteinformation,req.session.booking.numOfAdults,req.session.booking.numOfChildren,req.session.booking.numOfNights)
     flightoutinfo = await mysqlModule.GetFlightDetail(req.session.outbound.FlightID)
     flightIninfo = await mysqlModule.GetFlightDetail(req.session.Inbound.FlightID) 
      airtravelprice = await basketBuilder.buildAirCosts(flightIninfo,flightoutinfo,req.session.booking.numOfAdults,req.session.booking.numOfChildren)
       holidaytotal = Number(hotelcosts.costoverall) + (airtravelprice.totalcost)
  



       res.render("../views/~booking/BookingConfirmation",{
        outbound:req.session.outbound || null,
        inbound:req.session.Inbound  || null,
        bookinginfo: req.session.booking  ,  
        hotelinformation: hoteinformation  || null,       // any object or array
        flightoutinfo: flightoutinfo  || null,   // session data
        flightIninfo: flightIninfo  || null,
        airtravelprice:airtravelprice  || null,
        hotelcosts:hotelcosts,
        holidaytotal:holidaytotal,
        bookingID:req.session.bookingid 
    
      });
  }
   
  
});

  module.exports = router