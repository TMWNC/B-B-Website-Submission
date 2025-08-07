// Created 09/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////////////////////
// This module is designed to hold any SQL commands within the system 
// For security each query will be created separately in its on function 
// with IN parameters and a return of the outcome to the logic layer 
///////////////////////////////////////////////////////////////////////


//////// Set up mysql dependencies and dotenv for access to env variables
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var activeConnection = null

activeConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
  multipleStatements: true 
});


// DB connection using the env file, this will be used for all functions and control the active
// connection to the database
function initDbConnection() {
  if (activeConnection) {
    // Already connected — skip
    return Promise.resolve();
  }

  activeConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
  });

  return Promise.resolve();
 
}

function closeConnection() {
  if (activeConnection) {
    activeConnection.end();
    activeConnection = null;
  }
}


/////////////////// Get list of hotels if country is not passed, pass null to the function /////////////////////
async function getHotelList(countryid ){
    if (!activeConnection) await initDbConnection();
      const sql = "call GetHotelList(?)"
      const values = [
        countryid
      ];
      try{
      return new Promise((resolve, reject) => {
   
       // Use a parameterized query to prevent SQL injection
       activeConnection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {

            // by returning results 0 its only the row data
          resolve(results[0]); 
        }
      });
    });
      }
      catch{
        return "failed";
      }
    }
  

    module.exports = {

        getHotelList
    }






/////////////////// Get list of flights based on the origin airport and destination country  /////////////////////
async function getFlightList(FlightDate,OriginID,DestID ){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetFlightList(?,?,?)"
    const values = [
      FlightDate,OriginID,DestID 
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }



  


/////////////////// Get list of airports within the UK to go outbound  /////////////////////
async function getOutAirports(){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetOutAirports()"
    const values = [
    
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }


  
  


/////////////////// Get a detailed information on a selected hotel passed   /////////////////////
async function getHotelDetail(HotelID){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetHotelDetailsWithRooms(?)"
    const values = [
      HotelID
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }



/////////////////// Get list of airports the chosen Airport can fly to based on Timetable  /////////////////////
async function getDestinationCountries(OriginID){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetInAirports(?)"
    const values = [
      OriginID
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }




/////////////////// Get list of airports the chosen Airport can fly to based on Timetable  /////////////////////
async function getAirportsOrginFlysto(OriginID){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetAvailableDestinations(?)"
    const values = [
      OriginID
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }


/////////////////// Get list of airports the chosen Airport can fly to based on Timetable  /////////////////////
async function recommendflight(originAirport,destinationAirport,date){
  if (!activeConnection) await initDbConnection();
    const sql = "call GetNearestFlight(?,?,?)"
    const values = [
      originAirport,destinationAirport,date
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }


/////////////////// Get the details about a selected flight  /////////////////////
async function GetFlightDetail(flightID){
  if (!activeConnection) await initDbConnection();
    const sql = "call getFlightDetail(?)"
    const values = [
      flightID
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }




////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// User Management///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


  /////////////////// Get the details about a selected flight  /////////////////////
async function CreateUser(INCustomerFirstName,INCustomerSurname,INCustomerAdd1,INCustomerAdd2,INCustomerPostcode
,INEmail,INHashedPassword){
  if (!activeConnection) await initDbConnection();
    const sql = "call CreateUser(?,?,?,?,?,?,?)"
    const values = [
      INCustomerFirstName,INCustomerSurname,INCustomerAdd1,INCustomerAdd2,INCustomerPostcode
      ,INEmail,INHashedPassword
    ];
    try{
    return new Promise((resolve, reject) => {
 
     // Use a parameterized query to prevent SQL injection
     activeConnection.query(sql, values, (error, results, fields) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {

          // by returning results 0 its only the row data
        resolve(results[0]); 
      }
    });
  });
    }
    catch{
      return "failed";
    }
  }

  /////////////////// Retrieve a userss hashed password for authentication  /////////////////////
async function GetCustomerHashedPassword(INEmail){
    if (!activeConnection) await initDbConnection();
      const sql = "call GetCustomerHashedPassword(?)"
      const values = [
        INEmail
      ];
      try{
      return new Promise((resolve, reject) => {
   
       // Use a parameterized query to prevent SQL injection
       activeConnection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
  
            // by returning results 0 its only the row data
          resolve(results[0]); 
        }
      });
    });
      }
      catch{
        return "failed";
      }
    }
  

  /////////////////// Retrieve a logged in users details  /////////////////////
  async function GetCustomerNameByID(INCustomerID ){
    if (!activeConnection) await initDbConnection();
      const sql = "call GetCustomerNameByID(?)"
      const values = [
        INCustomerID 
      ];
      try{
      return new Promise((resolve, reject) => {
   
       // Use a parameterized query to prevent SQL injection
       activeConnection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
  
            // by returning results 0 its only the row data
          resolve(results[0]); 
        }
      });
    });
      }
      catch{
        return "failed";
      }
    }
  


    
  /////////////////// Creates a booking and inserts the passengers into the passenger table  /////////////////////
  async function CreateBooking(
     INCustomerID,
    INBookingTypeID,
    INDateOfBooking,
    INBillingStatus,
    INBillingName,
    INBillingAddress,
    INBillingPostcode,
    INPassengerJSON ){
    if (!activeConnection) await initDbConnection();
      const sql = "CALL CreateBookingWithPassengers(?, ?, ?, ?, ?, ?, ?, ?, @BookingID);"
      const values = [
        INCustomerID,
        INBookingTypeID,
        INDateOfBooking,
        INBillingStatus,
        INBillingName,
        INBillingAddress,
        INBillingPostcode,
        JSON.stringify(INPassengerJSON) 
      ];
      try {
        return new Promise((resolve, reject) => {
          // Call the procedure to insert the data and set @BookingID
          activeConnection.query(sql, values, (err) => {
            if (err) {
              console.error("Procedure execution error:", err);
              return reject(err);
            }
    
            // Fetch the OUT value from the session variable
            activeConnection.query("SELECT @BookingID AS BookingID;", (err, result) => {
              if (err) {
                console.error("Retrieving BookingID failed:", err);
                return reject(err);
              }
    
              resolve(result[0].BookingID); // Return the actual booking ID value
            });
          });
        });
      } catch (err) {
        console.error("Unexpected failure in CreateBookingWithPassengers:", err);
        return "failed";
      }
    }
  


    
  /////////////////// Creates a booking and inserts the passengers into the passenger table  /////////////////////
async function CreateFullBooking(
  customerID,
  bookingTypeID,
  payment,                // object: { CardName, address1, postcode }
  passengerArray,
  hotelRoomDetailID,
  numberOfRooms,
  checkInDate,
  numberOfNights,
  outboundFlightTimeID,
  outboundFlightDate,
  inboundFlightTimeID,
  inboundFlightDate
) {
  if (!activeConnection) await initDbConnection();

  const sql = `
    CALL CreateFullBooking(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @outID);
    SELECT @outID AS BookingID;
  `;

  const values = [
    customerID,
    bookingTypeID,
    new Date(),               // dateOfBooking
    "Paid",                   // billingStatus
    payment.CardName,
    payment.address1,
    payment.postcode,
    JSON.stringify(passengerArray),
    hotelRoomDetailID,
    numberOfRooms,
    checkInDate,
    numberOfNights,
    outboundFlightTimeID,
    outboundFlightDate,
    inboundFlightTimeID,
    inboundFlightDate
  ];

  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (err, results) => {
        if (err) {
          console.error("Procedure execution error:", err);
          return reject(err);
        }

        const bookingID = results[1][0].BookingID;
        resolve(bookingID);
      });
    });
  } catch (err) {
    console.error("Unexpected failure in CreateFullBooking:", err);
    return "failed";
  }
}

  
  
  /////////////////// Retrieve a list of all of a customers bookings /////////////////////
  async function GetCustomerBookingList(INCustomerID ){
    if (!activeConnection) await initDbConnection();
      const sql = "call GetCustomerBookings(?)"
      const values = [
        INCustomerID 
      ];
      try{
      return new Promise((resolve, reject) => {
   
       // Use a parameterized query to prevent SQL injection
       activeConnection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
  
            // by returning results 0 its only the row data
          resolve(results[0]); 
        }
      });
    });
      }
      catch{
        return "failed";
      }
    }
  
  module.exports = {
    getAirportsOrginFlysto,
    initDbConnection,
      getHotelList,
      getFlightList,
      closeConnection,
      getOutAirports,
      getDestinationCountries,
      getHotelDetail,
      recommendflight,
      GetFlightDetail,
      CreateUser,
      GetCustomerHashedPassword,
      GetCustomerNameByID,
      CreateBooking,
      CreateFullBooking,
      GetCustomerBookingList
  }