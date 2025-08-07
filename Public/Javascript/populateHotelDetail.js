////////////////////////////////////////////////////////////////////////
// Created 28/07/2025 by Tommy Mannix
// This script handles retrieving and rendering hotel details based on 
// user query parameters. It supports both hotel-only and package 
// bookings. The script fetches hotels from the API, displays details, 
// amenities, and calculates pricing information. It also sets up 
// navigation for the booking process.
////////////////////////////////////////////////////////////////////////


// Initialise global variables for search parameters
var adult = 1;
var child = 0;
var numOfNights = 1;
var type = 1;        // Booking type: 1 = Hotel, 2 = Flight, 3 = Package
var hotel = null;    // Selected hotel
var origin;          // Origin airport


////////////////////////////////////////////////////////////////////////
// Function: getQueryParameters
// Retrieves query string parameters from the page URL and assigns them 
// to the script-level variables for later use in hotel searches.
////////////////////////////////////////////////////////////////////////
function getQueryParameters() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  adult = params.get("Adult") || 1;
  child = params.get("Child") || 0;
  numOfNights = params.get("numOfNights") || 1;
  type = params.get("type") || 1;
  hotelid = params.get("hotelID") || null;
  origin = params.get("originID") || null;
  date = params.get("date") || null;
}


////////////////////////////////////////////////////////////////////////
// Function: fetchAndRenderHotels
// Builds the API request URL using query parameters, fetches the hotel 
// details from the server, and passes the data to the displayHotels 
// function for rendering on the page.
////////////////////////////////////////////////////////////////////////
async function fetchAndRenderHotels() {
  try {
    await getQueryParameters();

    console.log(adult);

    const url = `http://localhost:3000/api/hotel?numOfNights=${numOfNights}&numOfAdults=${adult}&numOfChildren=${child}&hotelid=${hotelid}&originID=${origin}&date=${date}`;
    console.log(url);

    const response = await GetJSONRequest(url);

    displayHotels(response);
  } catch (err) {
    console.error('Failed to fetch hotels:', err);
  }
}


////////////////////////////////////////////////////////////////////////
// Function: displayHotels
// Takes the response from the API and builds the HTML output for hotel 
// details including pricing, amenities, and booking options. 
// Handles both hotel-only and package bookings.
////////////////////////////////////////////////////////////////////////
async function displayHotels(response) {
  if (response.length < 1) {
    container.innerHTML = '<p>No Hotels available</p>';
    return;
  }

  const hoteldetails = document.querySelector('.hotelInformationContainer');
  const TripDetailsContainer = document.querySelector('.TripDetailsContainer');

  hoteldetails.innerHTML = '';
  TripDetailsContainer.innerHTML = '';

  response.forEach((hotel) => {
    const Date = (type == 3 && hotel.Rooms[0].recommendFlight && hotel.Rooms[0].recommendFlight[0])
      ? ConvertDate(hotel.Rooms[0].recommendFlight[0].NextAvailableDate)
      : ConvertDate(date);

    const roominfo = hotel.Rooms[0];

    const hotelitem = `
      <div class="hotelImageWrapper roundedbox">
        <img class="hotelImage" src="${hotel.HotelImageURL || "../../Public/assets/images/beachimage.jpeg"}" alt="${hotel.HotelName} image">
      </div>
      <div class="hotellocationblock flexcol">
        <h1 class="hotelName">${hotel.HotelName}</h1>
        <p class="location">In ${hotel.TownName}, ${hotel.CountryName} - <a href="#">View map</a></p>
      </div>
      <p class="hotelDetailDescription">${hotel.Description || "no description available"}</p>
    `;

    var airport;
    if (type == 3) {
      airport = `<li><span class="icon">✈️</span> ${hotel.Rooms[0].airport.OriginAirportName} - ${hotel.Rooms[0].airport.DestinationAirportName}</li>`;
    } else {
      airport = ``;
    }

    // Build trip overview depending on booking type
    var tripoverview;
    if (type == 3) {
      tripoverview = `
        <div class="tripTotal">
          <h2>Trip Total</h2>
          <div class="priceInfo">
            <p class="totalPrice">£${roominfo.priceEstimate}</p>
            <p class="pricePerPerson">£${roominfo.PricePerNight}</p>
            <p class="perPersonLabel">Per night</p>
          </div>
        </div>
        <div class="glanceSection">
          <h3>At a glance</h3>
          <ul class="glanceList">
            <li><span class="icon">👤</span> ${adult} adults</li>
            <li><span class="icon">🧒</span> ${child} children</li>
            <li><span class="icon">📅</span> ${Date} - ${numOfNights} nights</li>
            ${airport}
            <li><span class="icon">🛏️</span> ${hotel.BoardTypeName}</li>
          </ul>
        </div>
        <button class="detailbutton bookNowButton searchButton">Book Now</button>
      `;
    } else {
      tripoverview = `
        <div class="tripTotal">
          <h2>Trip Total</h2>
          <div class="priceInfo">
            <p class="totalPrice">£${roominfo.HotelEstimate}</p>
            <p class="pricePerPerson">£${roominfo.PricePerNight}</p>
            <p class="perPersonLabel">Per night</p>
          </div>
        </div>
        <div class="glanceSection">
          <h3>At a glance</h3>
          <ul class="glanceList">
            <li><span class="icon">👤</span> ${adult} adults</li>
            <li><span class="icon">🧒</span> ${child} children</li>
            <li><span class="icon">📅</span> ${Date} - ${numOfNights} nights</li>
            ${airport}
            <li><span class="icon">🛏️</span> ${hotel.BoardTypeName}</li>
          </ul>
        </div>
        <button class="detailbutton bookNowButton searchButton">Book Now</button>
      `;
    }

    // Render amenities section if present
    var amenitiesHTML = "";
    AmenitiesJSON = JSON.parse(hotel.Amenities);

    if (Array.isArray(AmenitiesJSON)) {
      amenitiesHTML = AmenitiesJSON.map(a =>
        `<div><span class="icon"></span> ${a}</div>`
      ).join('');
    }

    const ameneties = `
      <div class="amenitiesSection">
        <h3>Amenities</h3>
        <div class="amenitiesGrid">
          ${amenitiesHTML}
        </div>
      </div>
    `;

    hoteldetails.innerHTML = hotelitem;
    TripDetailsContainer.innerHTML = (tripoverview + ameneties);

    const detailbutton = document.querySelector(".detailbutton");

    var url;
    if (type == 1) {
      // If hotel-only, post the selected hotel details
      const payload = {
        hotelid: hotelid,
        numOfNights: numOfNights,
        adult: adult,
        child: child,
        typeOfBooking: type,
        Date: date
      };

      fetch('../../search/hotel/hoteldetail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(result => console.log('Success:', result))
      .catch(error => console.error('Error:', error));

      url = "../../checkout";
    } else {
      // If package, redirect to outbound flight search
      url = `../../search/flights/outbound?hotel=${hotelid}&numOfNights=${numOfNights}&adult=${adult}&child=${child}&OutBound=${hotel.Rooms[0].airport.OriginAirportID}&InBound=${hotel.Rooms[0].airport.DestinationAirportID}&type=${type}&date=${date}`;
    }

    detailbutton.addEventListener("click", function () {
      gotoURL(url);
    });
  });
}


////////////////////////////////////////////////////////////////////////
// Function: gotoURL
// Navigates the user to the given URL. Used for redirecting to 
// checkout or flight selection after hotel selection.
////////////////////////////////////////////////////////////////////////
function gotoURL(url) {
  window.location.href = url;
}


////////////////////////////////////////////////////////////////////////
// Run on DOM Load
// When the page loads, fetch hotel details and render them.
////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', fetchAndRenderHotels);
