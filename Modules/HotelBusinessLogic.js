////////////////////////////////////////////////////////////////////////
//    Created 19/07/2025 by Tommy Mannix ///////////////////////////////
// This module is the business logic for /search/hotels. It allows the 
// system to calculate the estimated cost of a holiday based on the 
// cheapest available room at a hotel and optional flight details.
// Costings take into account rooms, board type, length of stay, and 
// flight availability near the chosen hotel.
////////////////////////////////////////////////////////////////////////

const Haversine = require("./HaversineFomula");
const mysqlModule = require("./mysqlmodule");

//////////////////////// MAIN HOLIDAY CALCULATOR ////////////////////////
// calculateCostOfHoliday
// Purpose: Calculate estimated holiday costs for each hotel in a list.
// Parameters:
//    holidayitems  - Array of hotel search results
//    numOfAdults   - Number of adult passengers
//    numOfChildren - Number of child passengers
//    numOfNights   - Length of stay in nights
//    originID      - Origin airport ID (or "null" if hotel only)
//    date          - Desired date of travel
//    HotelDetail   - Detailed hotel info if for a single hotel view
// Returns:
//    JSON list of hotels with cost estimates, flight info, and details
////////////////////////////////////////////////////////////////////////
async function calculateCostOfHoliday(
  holidayitems,
  numOfAdults,
  numOfChildren,
  numOfNights,
  originID,
  date,
  HotelDetail,
  
) {
  try {
    console.log(originID);

    // Find a list of airports the origin can fly to
    var airports;
    if (originID != "null") {
      airports = await mysqlModule.getAirportsOrginFlysto(originID);
    }

    // For each hotel in the results
    for (const hotel of holidayitems) {
      var airport = null;
      var recommendedflight = null;

      if (originID !== "null") {
        // For detailed view (single hotel)
        if (HotelDetail) {
          airport = await findNearestAirport(HotelDetail[0], airports);
        } else {
          console.log("Calculating nearest airport...");
          airport = await findNearestAirport(hotel, airports);
        }

        // Find a recommended flight near chosen date
        recommendedflight = await recommendflight(
          airport.OriginAirportID,
          airport.DestinationAirportID,
          date
        );
      }

      // Calculate number of rooms required
      const numberOfRoomsrequired = await numOfRooms(
        numOfAdults,
        numOfChildren,
        hotel.AdultCapacity,
        hotel.ChildCapacity,
        numOfNights
      );

      // Calculate hotel cost estimate
      const priceEstimate = await calculateHolidayCostEstimate(
        hotel.PricePerPerson || hotel.PricePerNight,
        numberOfRoomsrequired,
        numOfNights
      );

      // Add flight cost if flights included
      var finalprice;
      if (originID != "null") {
        const flightcost =
          numOfAdults * recommendedflight[0].AdultPrice +
          numOfChildren * recommendedflight[0].ChildPrice;

        hotel["FlightEtimate"] = flightcost;
        finalprice = priceEstimate + flightcost;
        hotel["airport"] = airport;
      } else {
        finalprice = priceEstimate;
      }

      ////// Encode data into hotel JSON //////

      hotel["recommendFlight"] = recommendedflight;
      hotel["numberOfRoomsrequired"] = numberOfRoomsrequired;
      hotel["priceEstimate"] = finalprice;
      hotel["HotelEstimate"] = priceEstimate;
      hotel["NumberOfNights"] = numOfNights;

      const numofpeople = Number(numOfAdults) + Number(numOfChildren);
      hotel["HolidayPricePerPerson"] = Number(
        (priceEstimate / numofpeople).toFixed(2)
      );
    }

    return holidayitems;
  } catch (err) {
    console.log(err);
  }
}

/////////////////////// SUPPORTING FUNCTIONS ////////////////////////////

// numOfRooms
// Calculates required number of rooms given adult/child counts and capacities
function numOfRooms(numOfAdults, numOfChildren, RoomAdultCapacity, RoomChildCapacity) {
  const adultRoomCount = Math.ceil(numOfAdults / RoomAdultCapacity);
  const childRoomCount =
    RoomChildCapacity > 0 ? Math.ceil(numOfChildren / RoomChildCapacity) : 0;

  // One room can serve both adults and children — take the maximum
  return Math.max(adultRoomCount, childRoomCount);
}

// calculateHolidayCostEstimate
// Returns hotel cost estimate based on price, rooms, and nights
function calculateHolidayCostEstimate(pricepernight, numberOfRooms, numOfNights) {
  return (pricepernight * numberOfRooms) * numOfNights;
}

// findNearestAirport
// Returns the nearest airport to the hotel from a list of airports
function findNearestAirport(hotel, airports) {
  let nearestAirport = null;
  let minDistance = Infinity;

  for (const airport of airports) {
    const distance = Haversine.GetDistanceBetweenHotelAndAirport(
      hotel.HotelLat,
      hotel.HotelLong,
      airport.DestinationLat,
      airport.DestinationLong
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestAirport = { ...airport, distance };
    }
  }

  return nearestAirport;
}

// recommendflight
// Queries the DB for a recommended flight based on origin, destination, and date
async function recommendflight(airportid, Originid, dateOfTravel) {
  return await mysqlModule.recommendflight(Originid, airportid, dateOfTravel);
}

/////////////////////// EXPORTS /////////////////////////////////////////
module.exports = { calculateCostOfHoliday };
