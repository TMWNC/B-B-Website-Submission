


describe('Unit Tests', () => {
  require('./UnitTests/GetHotelListTest.test');
  require('./UnitTests/GetOutboundAirport.test');

  require('./UnitTests/Haversine.test');
  });
  
  describe('Integration Tests', () => {
    require('./IntegrationTests/api-ListHotel.Test');
    require('./IntegrationTests/api-.listflights.test');
  });