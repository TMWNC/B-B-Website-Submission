/*
* Created 20/07/2025 
* Unit test for the haversine formula /modules/Haversine Formulas
*/

const Haversine = require("../../Modules/HaversineFomula")
/////////// Test 1 ///////////////////////////////////////
//////////Test the accuracy of the formula inputted using 2 known values and distance
// use 2 known locations london Gatwick and Heathrow which are around 40km away
// a postive test is if the output is within 5km 
test('distance between Heathrow and gatwick 40KM +- 5km ', async () => {

// pass the lat and long for heathrow and gatwick
    const distance = await Haversine.GetDistanceBetweenHotelAndAirport(51.4700,-0.4543, 51.1537, -0.1821);

// check if the value is greater than 34 but less than 46 
    const result = (distance > 34 && distance < 46);


    expect(result).toBeDefined();
   expect(result).toBe(True);
  
  });
  