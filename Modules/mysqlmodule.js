// Created 09/07/2025 by Tommy Mannix
////////////////////////////////////////////////////////////////////////
// This module is designed to hold any SQL commands within the system.
// For security each query is created separately in its own function 
// with IN parameters and a return of the outcome to the logic layer.
// Connection details are drawn from environment variables for security.
////////////////////////////////////////////////////////////////////////

///////////////////////// Dependencies /////////////////////////////////
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

///////////////////////// Active Connection ////////////////////////////
var activeConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
  multipleStatements: true 
});

////////////////////////////////////////////////////////////////////////
// Database Connection Controls
////////////////////////////////////////////////////////////////////////

// Initialise DB connection if not already open
function initDbConnection() {
  if (activeConnection) return Promise.resolve();
  activeConnection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE
  });
  return Promise.resolve();
}

// Close the DB connection pool
function closeConnection() {
  if (activeConnection) {
    activeConnection.end();
    activeConnection = null;
  }
}

////////////////////////////////////////////////////////////////////////
// Hotel Queries
////////////////////////////////////////////////////////////////////////

// Get list of hotels by country (pass null for all hotels)
async function getHotelList(countryid) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetHotelList(?)";
  const values = [countryid];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get detailed hotel info including available rooms
async function getHotelDetail(HotelID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetHotelDetailsWithRooms(?)";
  const values = [HotelID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

////////////////////////////////////////////////////////////////////////
// Flight Queries
////////////////////////////////////////////////////////////////////////

// Get list of flights based on date, origin, and destination
async function getFlightList(FlightDate, OriginID, DestID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetFlightList(?,?,?)";
  const values = [FlightDate, OriginID, DestID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get list of outbound UK airports
async function getOutAirports() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetOutAirports()";
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, [], (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get list of inbound destinations for a given origin
async function getDestinationCountries(OriginID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetInAirports(?)";
  const values = [OriginID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get list of airports an origin can fly to (based on timetable)
async function getAirportsOrginFlysto(OriginID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetAvailableDestinations(?)";
  const values = [OriginID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get nearest available flight for given origin, destination, and date
async function recommendflight(originAirport, destinationAirport, date) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetNearestFlight(?,?,?)";
  const values = [originAirport, destinationAirport, date];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Get flight detail by ID
async function GetFlightDetail(flightID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL getFlightDetail(?)";
  const values = [flightID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

////////////////////////////////////////////////////////////////////////
// User Management
////////////////////////////////////////////////////////////////////////

// Create a new user account
async function CreateUser(
  INCustomerFirstName,
  INCustomerSurname,
  INCustomerAdd1,
  INCustomerAdd2,
  INCustomerPostcode,
  INEmail,
  INHashedPassword
) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL CreateUser(?,?,?,?,?,?,?)";
  const values = [
    INCustomerFirstName,
    INCustomerSurname,
    INCustomerAdd1,
    INCustomerAdd2,
    INCustomerPostcode,
    INEmail,
    INHashedPassword
  ];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Retrieve a user's hashed password by email for login
async function GetCustomerHashedPassword(INEmail) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetCustomerHashedPassword(?)";
  const values = [INEmail];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

// Retrieve a customer's name by ID
async function GetCustomerNameByID(INCustomerID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetCustomerNameByID(?)";
  const values = [INCustomerID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}

////////////////////////////////////////////////////////////////////////
// Booking Management
////////////////////////////////////////////////////////////////////////

// Create a booking and insert passengers
async function CreateBooking(
  INCustomerID,
  INBookingTypeID,
  INDateOfBooking,
  INBillingStatus,
  INBillingName,
  INBillingAddress,
  INBillingPostcode,
  INPassengerJSON
) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL CreateBookingWithPassengers(?, ?, ?, ?, ?, ?, ?, ?, @BookingID);";
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
      activeConnection.query(sql, values, (err) => {
        if (err) return reject(err);
        activeConnection.query("SELECT @BookingID AS BookingID;", (err, result) => {
          if (err) return reject(err);
          resolve(result[0].BookingID);
        });
      });
    });
  } catch (err) {
    return "failed";
  }
}

// Create a full booking (hotel + flights + passengers)
async function CreateFullBooking(
  customerID,
  bookingTypeID,
  payment,
  passengerArray,
  hotelRoomDetailID,
  numberOfRooms,
  checkInDate,
  numberOfNights,
  outboundFlightTimeID,
  outboundFlightDate,
  inboundFlightTimeID,
  inboundFlightDate,
  InStaffID
) {
  if (!activeConnection) await initDbConnection();
  const sql = `
    CALL CreateFullBooking(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, @outID);
    SELECT @outID AS BookingID;
  `;
  const values = [
    customerID,
    bookingTypeID,
    new Date(),
    "Paid",
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
    inboundFlightDate,
    InStaffID
  ];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        const bookingID = results[1][0].BookingID;
        resolve(bookingID);
      });
    });
  } catch (err) {
    return "failed";
  }
}

// Retrieve a list of all bookings for a given customer
async function GetCustomerBookingList(INCustomerID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetCustomerBookings(?)";
  const values = [INCustomerID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}
 

////////////////////////////////////////////////////////////////////////
///////////////////// Sales My SQL commands ///////////////////////////
/// Created 30/07/2025/////////////////////////////////////////////////



// Retrieve the sales stats for the previous month 
async function GetMontlySales() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetMontlySales()";
  const values = [];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}



// Retrieve the sales stats for the previous year 
async function GetYearlySales() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetYearlySales()";
  const values = [];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}



// Retrieve the sales stats for the branches per month 
async function GetBranchSalesLast30Days() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetBranchSalesByTypeComparison()";
  const values = [];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}


// Retrieve a  staff user's hashed password by email for login
async function GetStaffHashedPassword(INEmail) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetStaffHashedPassword(?)";
  const values = [INEmail];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}




// Retrieve a customer's name by ID
async function GetStaffNameByID(INCustomerID) {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetStaffNameAndAccessByID(?)";
  const values = [INCustomerID];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}




// Retrieve a list of top selling Hotels
async function GetTopAndBottomHotelsByBranch() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetTopAndBottomHotelsByBranch()";
  const values = [];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}




// Retrieve a list of top selling Hotels
async function GetTrendingDestinations() {
  if (!activeConnection) await initDbConnection();
  const sql = "CALL GetTrendingDestinations()";
  const values = [];
  try {
    return new Promise((resolve, reject) => {
      activeConnection.query(sql, values, (error, results) => {
        if (error) return reject(error);
        resolve(results[0]);
      });
    });
  } catch {
    return "failed";
  }
}
////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////
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
  GetCustomerBookingList,
  GetMontlySales,
  GetYearlySales,
  GetStaffHashedPassword,
  GetStaffNameByID,
  GetBranchSalesLast30Days,
  GetTopAndBottomHotelsByBranch,
  GetTrendingDestinations
};
