////////////////////////////////////////////////////////////////////////
//    Created 20/07/2025 by Tommy Mannix ///////////////////////////////
// This module allows the user to find out the closest airport to a hotel
// by using the Haversine Formula. It uses latitude and longitude values
// to calculate distances, drawing overlapping circles to find the closest
// airport. Concept support adapted from Rossiter (2020).
////////////////////////////////////////////////////////////////////////

//////////////////////// DISTANCE CALCULATION ///////////////////////////
// GetDistanceBetweenHotelAndAirport
// Purpose: Calculates the distance between a hotel and an airport using
//          latitude and longitude values.
// Parameters:
//    HotelLat     - Latitude of the hotel
//    HotelLong    - Longitude of the hotel
//    AirportLat   - Latitude of the airport
//    AirportLong  - Longitude of the airport
// Returns: 
//    Distance in kilometers (KM) between the hotel and airport
////////////////////////////////////////////////////////////////////////
function GetDistanceBetweenHotelAndAirport(HotelLat, HotelLong, AirportLat, AirportLong) {
  // Earth's radius in kilometers for accurate measurement
  const EarthRadius = 6378;

  // Convert latitude values to radians
  const AirportLatradians = AirportLat * Math.PI / 180;
  const HotelLatradians   = HotelLat   * Math.PI / 180;

  // Find the difference in longitude and convert into radians
  const DifferenceInLongitude = AirportLong - HotelLong;
  const deltaLambda = (DifferenceInLongitude * Math.PI) / 180;

  // Calculate the distance using the spherical law of cosines
  const distanceinKM = Math.acos(
      Math.sin(AirportLatradians) * Math.sin(HotelLatradians) +
      Math.cos(AirportLatradians) * Math.cos(HotelLatradians) * Math.cos(deltaLambda)
  ) * EarthRadius;

  return distanceinKM;
}

//////////////////////// MODULE EXPORTS ////////////////////////////////
module.exports = { 
  GetDistanceBetweenHotelAndAirport 
};
