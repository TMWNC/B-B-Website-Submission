
//////// Created 09/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite test the authentication of users within the system


const request = require('supertest');
const app = require('../../index'); // your Express app must export `app`



describe('INTEGRATION TESTS - List API tests', () => {
  test('GET /api/ListHotel - no parameters - returns all hotels', async () => {

    // Send request to server with no parameters 
    const response = await request(app).get('/api/ListHotels');

    // For it to be successful, the server should respond with a 200 OK message
    expect(response.statusCode).toBe(200);
    // check for JSON
    expect(response.headers['content-type']).toMatch(/json/);
    // show it in array format
    expect(response.body).toBeInstanceOf(Array);
    // must be more than 1 returned item
    expect(response.body.length).toBeGreaterThan(0);

    // Check expected values in the first result
    expect(response.body[0].HotelName).toBe("Hilton Athens");
  });


  test('GET /api/ListHotel?destinationID = 2 - country parameter - returns all hotels in Greece', async () => {
    // Send request to server with no parameters 
    const response = await request(app).get('/api/listhotels?destinationID=2');

    // For it to be successful, the server should respond with a 200 OK message
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Check expected values in the first result
    expect(response.body[0].CountryName).toBe("Greece");
  });


  
  test('GET /api/ListHotel?destinationID = test - country parameter - returns no hotels', async () => {
    // Send request to server with no parameters 
    const response = await request(app).get('/api/listhotels?destinationID=test');

    // For it to be successful, the server should respond with a 200 OK message
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);


  });
});


