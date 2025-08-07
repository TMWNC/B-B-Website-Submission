
//////// Created 11/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
//// These unit tests are designed to test the Database module  for use getting The outbound
//airport list within the search bar 
//get mysql module
const mysqlmodule = require('../../Modules/mysqlmodule');


beforeAll(async () => {
  await mysqlmodule.initDbConnection();
});

afterAll(() => {
  mysqlmodule.closeConnection();
});


/////////// Test 1 ///////////////////////////////////////
//////////Get list of all airports in the UK 
//// should return list of all airports in the UK
// as a test the first UK airport should be heathrow
test('Get list of hotels airports within the UK when 1 is getOutAirports(1) ', async () => {
  const result = await mysqlmodule.getOutAirports(1);
  expect(result).toBeDefined();
 expect(result[0].AirportName).toBe('Heathrow');

});



/////////// Test 2 ///////////////////////////////////////
//////////Get list of hotels when country ID  is passed 
//// should return list of all hotels within the database within greece 
test('Get list of countries that can travelled to when 1 is passed (UK) to GetDestinations(1) ', async () => {
  const result = await mysqlmodule.getDestinationCountries(1);
  expect(result).toBeDefined();
  expect(result[0].CountryID).toBe(2);
});


