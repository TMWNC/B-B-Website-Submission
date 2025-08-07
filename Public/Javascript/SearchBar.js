/* Created 20/07/2025 by Tommy Mannix
* This script populates the search bar with values 
* (airports, destinations, passengers, etc.)
* and initiates a search for Hotels, Flights, or Packages
*/


////////////////////////////////////////////////////////////////////////
// DOM Selectors
// These query the search form fields and buttons required for search
////////////////////////////////////////////////////////////////////////
const OriginSelect = document.querySelector("#OriginSelect");
const destinationSelect = document.querySelector("#DestinationSelect");
const DateSelect = document.querySelector("#Date");
const durationSelect = document.querySelector("#duration");
const adultSelect = document.querySelector("#adultpass");
const childpass = document.querySelector("#childpass");

const SubmitButton = document.querySelector("#PackagesSearchContainer .searchButton");
const FlightsSubmitButton = document.querySelector("#flightssearchContainer .searchButton");
const HotelsSubmitButton = document.querySelector("#HotelssearchContainer .searchButton");
const packageButton = document.querySelector(".packageButton");
const FlightButton = document.querySelector(".FlightButton");
const HotelButton = document.querySelector(".HotelButton");

const packagecontainer = document.querySelector("#PackagesSearchContainer");
const flightcontainer = document.querySelector("#flightssearchContainer");
const hotelcontainer = document.querySelector("#HotelssearchContainer");

const holidaytype = document.querySelector(".holidaytype");
const form = document.querySelector("#searchform");

var type; // Global type variable (1 = Hotel, 2 = Flight, 3 = Package)


////////////////////////////////////////////////////////////////////////
// Prevent default form submission
////////////////////////////////////////////////////////////////////////
form.addEventListener('submit', function(event) {
    event.preventDefault();
});


////////////////////////////////////////////////////////////////////////
// Function: populateSearchBar
// Populates the Origin and Destination dropdown lists on page load
////////////////////////////////////////////////////////////////////////
async function populateSearchBar() {
    populateOriginAirports();
    populateDestinations();
}


////////////////////////////////////////////////////////////////////////
// Function: populateOriginAirports
// Gets a list of origin airports and populates the Origin select boxes
////////////////////////////////////////////////////////////////////////
async function populateOriginAirports() {
    OriginSelect.innerHTML = "";
    var OrginsHTML = `<option value="" disabled selected>Select an airport</option>`;

    // Fetch origin airports from API
    const AirportList = await GetJSONRequest("../../api/GetOutboundAirport");

    AirportList.forEach((Airport) => {
        OrginsHTML += `<option value="${Airport.AirportID}">${Airport.AirportName}</option>`;
    });

    const departAirport = document.querySelector("#flightssearchContainer .OriginSelect");
    OriginSelect.innerHTML = OrginsHTML;
    departAirport.innerHTML = OrginsHTML;
}


////////////////////////////////////////////////////////////////////////
// Function: populateDestinations
// Fetches possible destinations for the selected origin and populates 
// the relevant dropdowns for Packages, Flights, and Hotels
////////////////////////////////////////////////////////////////////////
async function populateDestinations() {
    const Originid = OriginSelect.value;
    destinationSelect.innerHTML = "";

    const hotelDestinationSelect = document.querySelector("#HotelssearchContainer .DestinationSelect");
    hotelDestinationSelect.innerHTML = "";
    var hoteldestinationHTML = `<option value=""  selected>Select a country</option>`;

    var destinationHTML = `<option value="" disabled selected>Select an Airport</option>`;

    if (Originid != "") {
        destinationHTML = `<option value="" disabled selected>Select a country</option>`;
        const CountryList = await GetJSONRequest(`../../api/GetDestinations?OriginID=${Originid}`);

        CountryList.forEach((Country) => {
            destinationHTML += `<option value="${Country.CountryID}">${Country.CountryName}</option>`;
            hoteldestinationHTML += `<option value="${Country.CountryID}">${Country.CountryName}</option>`;
        });
    }

    // Populate hotel-only destinations
    const desCountryList = await GetJSONRequest(`../../api/GetDestinations?OriginID=1`);
    desCountryList.forEach((Country) => {
        hoteldestinationHTML += `<option value="${Country.CountryID}">${Country.CountryName}</option>`;
    });

    destinationSelect.innerHTML = destinationHTML;
    hotelDestinationSelect.innerHTML = hoteldestinationHTML;

    // Populate flight destination airports
    const FlightAirportDestinationSelect = document.querySelector("#flightssearchContainer .DestinationSelect");
    const AirportOrigin = document.querySelector("#flightssearchContainer .OriginSelect").value;

    if (AirportOrigin != "") {
        var AirportDestiantion = `<option value="" disabled selected>Select an Airport</option>`;
        FlightAirportDestinationSelect.innerHTML = AirportDestiantion;

        const AirportDestinationList = await GetJSONRequest(`../../api/GetDestinations?OriginID=${AirportOrigin}`);

        AirportDestinationList.forEach((Country) => {
            const airports = JSON.parse(Country.Airports);

            // Deduplicate by AirportID
            const uniqueAirports = [];
            const seen = new Set();
            airports.forEach(airport => {
                if (!seen.has(airport.AirportID)) {
                    seen.add(airport.AirportID);
                    uniqueAirports.push(airport);
                }
            });

            const optgroup = document.createElement("optgroup");
            optgroup.label = Country.CountryName;

            uniqueAirports.forEach(airport => {
                const option = document.createElement("option");
                option.value = airport.AirportID;
                option.textContent = `${airport.AirportName} (${airport.AirportShortName})`;
                optgroup.appendChild(option);
            });

            FlightAirportDestinationSelect.appendChild(optgroup);
        });
    }
}


////////////////////////////////////////////////////////////////////////
// Function: searchPackage
// Redirects the user based on their selected holiday type (Hotel, 
// Flight, or Package) after validating the search form inputs.
////////////////////////////////////////////////////////////////////////
async function searchPackage() {

    // Package Holiday
    if (type == 3 && checkSearchValidation(packagecontainer) === true) {
        const DateSelect = document.querySelector("#PackagesSearchContainer .date-search");
        const durationSelect = document.querySelector("#PackagesSearchContainer .duration-search");
        const adultSelect = document.querySelector("#PackagesSearchContainer .adult-search");
        const childpass = document.querySelector("#PackagesSearchContainer .child-search");
        const origin = OriginSelect.value;
        const dest = destinationSelect.value;
        const date = DateSelect.value;
        const duration = durationSelect.value;
        const adults = adultSelect.value;
        const children = childpass.value;
        type = 3;

        var url = `../../search/hotel?destinationID=${dest}&numOfNights=${duration}&adult=${adults}&child=${children}&originID=${origin}&type=${type}&date=${date}`;
        window.location.href = url;
    }

    // Flight Only
    if (type == 2 && checkSearchValidation(flightcontainer) === true) {
        const DateSelect = document.querySelector("#flightssearchContainer .date-search");
        const durationSelect = document.querySelector("#flightssearchContainer .duration-search");
        const adultSelect = document.querySelector("#flightssearchContainer .adult-search");
        const childpass = document.querySelector("#flightssearchContainer .child-search");
        const OriginSelect = document.querySelector("#flightssearchContainer .OriginSelect");
        const destinationSelect = document.querySelector("#flightssearchContainer .DestinationSelect");

        const origin = OriginSelect.value;
        const dest = destinationSelect.value;
        const date = DateSelect.value;
        const duration = durationSelect.value;
        const adults = adultSelect.value;
        const children = childpass.value;
        type = 2;

        var url = `../../search/flights/outbound?numOfNights=${duration}&adult=${adults}&child=${children}&OutBound=${origin}&InBound=${dest}&type=${type}&date=${date}`;
        window.location.href = url;
    }

    // Hotel Only
    if (type == 1 && checkSearchValidation(hotelcontainer)) {
        const DateSelect = document.querySelector("#HotelssearchContainer .date-search");
        const durationSelect = document.querySelector("#HotelssearchContainer .duration-search");
        const adultSelect = document.querySelector("#HotelssearchContainer .adult-search");
        const childpass = document.querySelector("#HotelssearchContainer .child-search");
        const destinationSelect = document.querySelector("#HotelssearchContainer .DestinationSelect");

        const dest = destinationSelect.value;
        const date = DateSelect.value;
        const duration = durationSelect.value;
        const adults = adultSelect.value;
        const children = childpass.value;
        type = 1;

        var url = `../../search/hotel?numOfNights=${duration}&adult=${adults}&child=${children}&originID=1&type=${type}&date=${date}`;
        window.location.href = url;
    }
}


////////////////////////////////////////////////////////////////////////
// Functions to switch holiday type
// These show/hide the relevant search containers and repopulate fields
////////////////////////////////////////////////////////////////////////
function packageselected() {
    type = 3;
    holidaytype.value = 3;
    packagecontainer.classList.remove("hidden");
    flightcontainer.classList.add("hidden");
    hotelcontainer.classList.add("hidden");
    populateSearchBar();
}

function Flightselected() {
    type = 2;
    holidaytype.value = 2;
    flightcontainer.classList.remove("hidden");
    hotelcontainer.classList.add("hidden");
    packagecontainer.classList.add("hidden");
    populateSearchBar();
}

function Hotelselected() {
    type = 1;
    holidaytype.value = 1;
    hotelcontainer.classList.remove("hidden");
    flightcontainer.classList.add("hidden");
    packagecontainer.classList.add("hidden");
    populateSearchBar();
}


////////////////////////////////////////////////////////////////////////
// Initialise on DOM Load
////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    type = 3; // Default to packages
    populateSearchBar();
});

const FlightsDepartureAirport = document.querySelector("#flightssearchContainer .OriginSelect");
FlightsDepartureAirport.addEventListener("change", populateDestinations);

FlightsSubmitButton.addEventListener("click", searchPackage);
HotelsSubmitButton.addEventListener("click", searchPackage);
OriginSelect.addEventListener("click", populateDestinations);
SubmitButton.addEventListener("click", searchPackage);
packageButton.addEventListener("click", packageselected);
FlightButton.addEventListener("click", Flightselected);
HotelButton.addEventListener("click", Hotelselected);
