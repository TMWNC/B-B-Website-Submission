////////////////////////////////////////////////////////////////////////
//    Created 26/07/2025 by Tommy Mannix ///////////////////////////////
// This module builds the trip basket for the trip overview including 
// air travel costs, hotel costs, and calculation of required rooms.
////////////////////////////////////////////////////////////////////////

//////////////////////// BUILD AIR TRAVEL COSTS /////////////////////////
// Calculates the total airfare costs for adults and children based on
// inbound and outbound flights.
// Parameters:
//   Inboundflight   - flight details for the return journey
//   outboundflight  - flight details for the outbound journey
//   numofadults     - number of adult passengers
//   numOfChildren   - number of child passengers
// Returns: Object with adult, child, and total air travel costs
////////////////////////////////////////////////////////////////////////
function buildAirCosts(Inboundflight, outboundflight, numofadults, numOfChildren) {
    const adultcosts = (Number(numofadults) * Number(Inboundflight[0].AdultPrice)) 
                     + (Number(numofadults) * Number(outboundflight[0].AdultPrice));
    const Childcosts = ((Number(numOfChildren) * Number(Inboundflight[0].ChildPrice)) 
                     + (Number(numOfChildren) * Number(outboundflight[0].ChildPrice))) || null;

    const total = Number(adultcosts) + Number(Childcosts);

    const airtravelcosts = {
        adultcost: adultcosts,
        Childcost: Childcosts,
        totalcost: total
    };
    return airtravelcosts;
}

//////////////////////// BUILD HOTEL COSTS /////////////////////////////
// Calculates hotel costs based on the number of rooms required and the
// length of stay. Hotel pricing is on a per room, per night basis.
// Parameters:
//   hotelinfo    - hotel information object containing room details
//   numofadults  - number of adult guests
//   numOfChildren- number of child guests
//   staylength   - number of nights staying
// Returns: Object with total cost and number of rooms booked
////////////////////////////////////////////////////////////////////////
async function hotelcosts(hotelinfo, numofadults, numOfChildren, staylength) {
    const roominfo = JSON.parse(hotelinfo[0].Rooms);

    // Work out the number of rooms required
    const numberofRooms = await numOfRooms(
        numofadults,
        numOfChildren,
        roominfo[0].AdultCapacity,
        roominfo[0].ChildCapacity
    );

    // Calculate overall cost
    const costoverall = (Number(roominfo[0].PricePerNight) * Number(numberofRooms)) 
                      * Number(staylength);

    const hotelCosting = {
        costoverall: costoverall,
        numberofRooms: numberofRooms
    };
    return hotelCosting;
}

/////////////////////// CALCULATE NUMBER OF ROOMS //////////////////////
// Determines the number of rooms required for the booking based on
// adult and child capacities per room. Always ensures at least one room.
// Parameters:
//   numOfAdults      - number of adult guests
//   numOfChildren    - number of child guests
//   RoomAdultCapacity- max adult capacity per room
//   RoomChildCapacity- max child capacity per room
// Returns: number of rooms required
////////////////////////////////////////////////////////////////////////
function numOfRooms(numOfAdults, numOfChildren, RoomAdultCapacity, RoomChildCapacity) {
    const adultRoomCount = Math.ceil(numOfAdults / RoomAdultCapacity);

    const childRoomCount = RoomChildCapacity > 0
        ? Math.ceil(numOfChildren / RoomChildCapacity)
        : 0;

    // Use the larger of the two counts, since a room can hold both adults and children
    const numberOfRooms = Math.max(adultRoomCount, childRoomCount);

    return numberOfRooms;
}

//////////////////////// MODULE EXPORTS ////////////////////////////////
module.exports = {
    buildAirCosts,
    hotelcosts
};
