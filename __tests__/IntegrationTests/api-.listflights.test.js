
//////// Created 09/07/2025 by Tommy Mannix 


///////////////// Unit test suite/////////////////////////////
/// This test suite test the authentication of users within the system


const request = require('supertest');
const app = require('../../index'); // your Express app must export `app`



  test('GET /api/listFlights - with departureID,destinationID,Flightdate,numOfNights - returns all outbound from heathrow and inbound from Greece', async () => {

    // Send request to server
    const response = await request(app).get('/api/listflights?OutBound=1&InBound=2&OutDate=14/07/2025&numOfnights=7');

    // For it to be successful, the server should respond with a 200 OK message
    expect(response.statusCode).toBe(200);
    // check for JSON
    expect(response.headers['content-type']).toMatch(/json/);
    // show it in array format
    expect(response.body.outboundflightlist).toBeInstanceOf(Array);
    // must be more than 1 returned item
    expect(response.body.outboundflightlist.length).toBeGreaterThan(0);

    // Check expected values in the first result
    expect(response.body.outboundflightlist[0].FlightTimeID).toBe(1);
    expect(response.body.outboundflightlist[0].OriginAirportName).toBe("Heathrow");

    expect(response.body.inboundflightlist[0].FlightTimeID).toBe(6);
    expect(response.body.inboundflightlist[0].OriginAirportName).toBe("Eleftherios Venizelos");
  });

