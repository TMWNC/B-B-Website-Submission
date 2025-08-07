////////////////////////////////////////////////////////////////////////
// Created 28/07/2025 by Tommy Mannix
// This script handles searching and displaying hotels based on user 
// query parameters. It also generates filters (board type, destination, 
// and price) and dynamically updates results when filters or passenger 
// numbers are changed. Supports hotel-only and package bookings.
////////////////////////////////////////////////////////////////////////


// Default search parameters
var adult = 1;
var child = 0;
var numOfNights = 1;
var type = 1;             // 1 = Hotel, 2 = Flight, 3 = Package
var destination = null;   // Destination ID (for packages)
var date;                 // Travel date


////////////////////////////////////////////////////////////////////////
// Function: getQueryParameters
// Retrieves query parameters from the page URL and updates the search 
// variables for use in hotel search requests.
////////////////////////////////////////////////////////////////////////
function getQueryParameters() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  adult = params.get("adult") || 1;
  child = params.get("child") || 0;
  numOfNights = params.get("numOfNights") || 1;
  type = params.get("type") || 1;
  destination = params.get("destinationID") || null;
  origin = params.get("originID") || null;
  date = params.get("date");
}


////////////////////////////////////////////////////////////////////////
// Passenger selection change listeners
// Updates the adult/child count when the dropdowns are changed and 
// refreshes the hotel results accordingly.
////////////////////////////////////////////////////////////////////////
const adultselect = document.querySelector(".numOfadults");
const childselect = document.querySelector(".numChildren");

adultselect.addEventListener("change", () => {
  adult = adultselect.value;
  fetchAndRenderHotels();
});

childselect.addEventListener("change", () => {
  child = childselect.value;
  fetchAndRenderHotels();
});


////////////////////////////////////////////////////////////////////////
// Function: fetchAndRenderHotels
// Builds the API request URL based on search parameters, fetches hotel 
// data from the server, and calls the filter generation and display 
// functions to render the results.
////////////////////////////////////////////////////////////////////////
async function fetchAndRenderHotels() {
  try {
    await getQueryParameters();

    var url;
    if (type == 1) {
      type = 1;
      url = `http://localhost:3000/api/listhotels?numOfNights=${numOfNights}&numOfAdults=${adult}&numOfChildren=${child}&date=${date}`;
    } else {
      type = 3;
      url = `http://localhost:3000/api/listhotels?numOfNights=${numOfNights}&numOfAdults=${adult}&numOfChildren=${child}&destinationID=${destination}&originID=${origin}&date=${date}`;
    }

    console.log(url);

    const response = await GetJSONRequest(url);

    GenerateFilters(response);
    displayHotels(response);
  } catch (err) {
    console.error('Failed to fetch hotels:', err);
  }
}


////////////////////////////////////////////////////////////////////////
// Function: GenerateFilters
// Creates filter UI elements for board types, destinations, and 
// maximum price using the hotel dataset. Populates the filter section 
// dynamically and attaches filter listeners.
////////////////////////////////////////////////////////////////////////
function GenerateFilters(hoteldata) {
  const boardTypes = [...new Set(hoteldata.map(h => h.BoardTypeName))];
  const destinations = [...new Set(hoteldata.map(h => h.TownName))];
  const prices = [...new Set(hoteldata.map(h => h.priceEstimate))];

  const boardFilterGroup = document.querySelector(".board-filter");
  const destinationFilterGroup = document.querySelector(".destination-filter");

  const max = Math.max(...prices);

  const MaxPriceFilter = document.querySelector("#max-price");
  const pricelabel = document.querySelector("#price-value");

  MaxPriceFilter.max = max;
  MaxPriceFilter.value = max;
  pricelabel.textContent = MaxPriceFilter.value;

  boardFilterGroup.innerHTML = "";
  destinationFilterGroup.innerHTML = "";

  const boardheading = document.createElement("h3");
  boardheading.innerHTML = `Board type`;
  boardFilterGroup.appendChild(boardheading);

  boardTypes.forEach(board => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${board}" data-filter="board" /> ${board}`;
    boardFilterGroup.appendChild(label);
  });

  const destinationheading = document.createElement("h3");
  destinationheading.innerHTML = `Destination type`;
  destinationFilterGroup.appendChild(destinationheading);

  destinations.forEach(town => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${town}" data-filter="destination" /> ${town}`;
    destinationFilterGroup.appendChild(label);
  });

  attachFilterListeners(hoteldata);
}


////////////////////////////////////////////////////////////////////////
// Function: attachFilterListeners
// Adds change event listeners to each filter input (checkboxes and 
// price slider). When filters are changed, the results are re-rendered.
////////////////////////////////////////////////////////////////////////
async function attachFilterListeners(hoteldata) {
  const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
  allCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => applyFilters(hoteldata));
  });

  const maxPriceInput = document.getElementById("max-price");
  const pricelabel = document.querySelector("#price-value");

  maxPriceInput.addEventListener("change", () => {
    pricelabel.textContent = maxPriceInput.value;
    applyFilters(hoteldata);
  });
}


////////////////////////////////////////////////////////////////////////
// Function: applyFilters
// Filters the hotel dataset based on selected board types, destinations, 
// and the maximum price set by the user. Calls displayHotels to update 
// the results on screen.
////////////////////////////////////////////////////////////////////////
function applyFilters(data) {
  const selectedBoards = Array.from(document.querySelectorAll("input[data-filter='board']:checked"))
    .map(cb => cb.value);

  const selectedDestinations = Array.from(document.querySelectorAll("input[data-filter='destination']:checked"))
    .map(cb => cb.value);

    console.log("selectedDestinations")
    console.log(data)
    console.log(selectedDestinations)
    console.log("end")
  const maxPriceInput = document.getElementById("max-price").value;
  const maxPrice = parseFloat(maxPriceInput);

  const filtered = data.filter(hotel => {
    const boardMatch = selectedBoards.length === 0 || selectedBoards.includes(hotel.BoardTypeName);
    const destinationMatch = selectedDestinations.length === 0 || selectedDestinations.includes(hotel.TownName.trim());

  
    const priceMatch = isNaN(maxPrice) || hotel.priceEstimate <= maxPrice;

    return boardMatch && destinationMatch && priceMatch;
  });

  displayHotels(filtered);
}


////////////////////////////////////////////////////////////////////////
// Function: displayHotels
// Renders the hotel cards to the results container. Includes hotel 
// images, location, price per person, total price, and travel info if 
// part of a package. Also updates the "Number of Holidays" display.
////////////////////////////////////////////////////////////////////////
function displayHotels(response) {
  const container = document.querySelector('.hotel-search-results');
  const hotelNumdisplay = document.querySelector("#holiday-number");

  container.innerHTML = '';

  console.log(response)
  if (response.length < 1) {
    container.innerHTML = '<p>No Hotels available</p>';
    return;
  }

  hotelNumdisplay.innerHTML = `Number of Holidays : ${response.length}`;

  response.forEach((hotel) => {
    console.log(hotel);
    var travelInfoBlock = "";

    if (type == 2) {
      const Date = ConvertDate(hotel.recommendFlight[0].NextAvailableDate);
      travelInfoBlock = (hotel.airport && hotel.airport.OriginAirportName && hotel.airport.DestinationAirportName) || type == 3
        ? `
          <div class="travelInfoBlock">
            <p class="dates">&#128197;&nbsp; ${Date}- ${hotel.NumberOfNights} nights</p>
            <p class="airport">&#9992;&nbsp; ${hotel.airport.OriginAirportName} - ${hotel.airport.DestinationAirportName}</p>
          </div>
        `
        : '';
    }

    var totalprice;
    var priceperperson;
    if (type == 3) {
      totalprice = hotel.priceEstimate;
      priceperperson = hotel.HolidayPricePerPerson;
    } else {
      priceperperson = hotel.PricePerPerson;
      totalprice = Number(hotel.PricePerPerson) * Number(numOfNights);
    }

    const hotelitem = `
      <article class="hotelListItem roundedbox">
        <div class="hotelImageWrapper roundedbox">
          <img class="hotelImage" src=${hotel.HotelImageURL || "../../Public/assets/images/beachimage.jpeg"} alt="${hotel.HotelName} image">
        </div>
        <div class="hotellocationblock flexcol">
          <h1 class="hotelName">${hotel.HotelName}</h1>
          <p class="location">&#128205;&nbsp; In ${hotel.TownName}, ${hotel.CountryName} - 
            <a href="https://www.google.com/maps/@${hotel.HotelLat},${hotel.HotelLong},577m">View map</a>
          </p>
        </div>
        ${travelInfoBlock}
        <div class="priceBlock">
          <div class="flexrowinline">
            <p class="pricePerPerson">£${priceperperson}pp</p>
            <p class="boardType">(${hotel.BoardTypeName})</p>
          </div>
          <p class="totalPrice">£${totalprice} total price</p>
          <a href="http://localhost:3000/search/hotel/hoteldetail?hotelID=${hotel.HotelID}&numOfNights=${numOfNights}&Adult=${adult}&Child=${child}&originID=${origin}&date=${date}&type=${type}" 
             class="viewMoreButton" data-hotel-id="1">Continue</a>
        </div>
      </article>
    `;

    container.innerHTML += hotelitem;
  });
}


////////////////////////////////////////////////////////////////////////
// Run on DOM Load
// Executes the hotel fetch and render process when the DOM is fully 
// loaded and ready.
////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', fetchAndRenderHotels);
