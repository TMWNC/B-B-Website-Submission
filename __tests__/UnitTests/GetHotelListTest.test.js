
//////// Created 11/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
//// These unit tests are designed to test the Database module  for use getting hotel lists
//get mysql module
const mysqlmodule = require('../../Modules/mysqlmodule');


beforeAll(async () => {
  await mysqlmodule.initDbConnection();
});

afterAll(() => {
  mysqlmodule.closeConnection();
});


/////////// Test 1 ///////////////////////////////////////
//////////Get list of hotels when null is passed 
//// should return list of all hotels within the database 
test('Get list of hotels when null is passed  to getHotelList(null) ', async () => {
  const result = await mysqlmodule.getHotelList(null);
  expect(result).toBeDefined();
 expect(result[0].HotelName).toBe('Hilton Athens');

});



/////////// Test 2 ///////////////////////////////////////
//////////Get list of hotels when country ID  is passed 
//// should return list of all hotels within the database within greece 
test('Get list of hotels when null is passed  to getHotelList(3) ', async () => {
  const result = await mysqlmodule.getHotelList(3);
  expect(result).toBeDefined();
  expect(result[0].CountryName).toBe("Spain");
});


