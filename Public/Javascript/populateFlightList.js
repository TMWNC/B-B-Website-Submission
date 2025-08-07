////////////////////////////////////////////////////////////////////////
// Created 28/07/2025 by Tommy Mannix
// This script handles the display and selection of flights within 
// the booking system. It processes query parameters, fetches flight 
// data from the server, and renders outbound and inbound flights.
// It also provides a date scrollbar for users to select alternate dates.
////////////////////////////////////////////////////////////////////////


// Initialise variables for query string parameters
var adult = 1;
var child = 0;
var numOfNights = 1;
var type = 1; // 1 = Hotel, 2 = Flight only, 3 = Package
var destination = null; 
var paramdate;
var mode = 0; // mode 0 = outbound flights, mode 1 = inbound flights

////////////////////////////////////////////////////////////////////////
// Function: getQueryParameters
// Retrieves query parameters from the URL and assigns them to variables.
// These include adults, children, hotel ID, outbound/inbound airports, 
// booking type, and travel date.
////////////////////////////////////////////////////////////////////////
function getQueryParameters() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);

  adult = params.get("adult");      
  child = params.get("child");     
  numOfNights = params.get("numOfNights") || 1;   
  type = params.get("type") || 1; 
  hotelid = params.get("hotel") || null; 
  OutBound = params.get("OutBound") || null; 
  InBound = params.get("InBound");
  paramdate = params.get("date");
}

////////////////////////////////////////////////////////////////////////
// Function: fetchandRenderFlights
// Fetches flight data from the server and displays either outbound 
// or inbound flights depending on the mode. Also controls the 
// visibility of the date scrollbar.
////////////////////////////////////////////////////////////////////////
async function fetchandRenderFlights(url) {
  try {
    console.log(url);     
    var response = await GetJSONRequest(url);
    console.log(response);

    if (mode == 0) {
      displayFlights(response.outboundflightlist);
      const datewrapper = document.querySelector(".date-bar-wrapper");
      datewrapper.classList.remove("hidden");
      populateScrollbar(response.outboundflightlist);
    } else {
      const datewrapper = document.querySelector(".date-bar-wrapper");
      datewrapper.classList.add("hidden");

      let parsed = new Date(paramdate);
      
      parsed.setDate(parsed.getDate() + Number(numOfNights)); // add 3 nights

      paramdate = parsed;

      displayFlights(response.inboundflightlist);
    }
  } catch (err) {
    console.error('Failed to fetch flights:', err);
  }
}

////////////////////////////////////////////////////////////////////////
// Function: populateScrollbar
// Populates the date scrollbar with a 14-day range starting 
// from the chosen date. Highlights available flight days 
// and attaches click events to load flights for that date.
////////////////////////////////////////////////////////////////////////
function populateScrollbar(flighttimes) {
  const allFlights = flighttimes;
  const weekdaysShort = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  
  const today = new Date(paramdate);
  const container = document.querySelector(".date-bar");
  container.innerHTML = "";

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = weekdaysShort[date.getDay()];
    const fullDayName = date.toLocaleString("en-GB", { weekday: "long" });
    const day = date.getDate();
    const month = monthsShort[date.getMonth()];
    const year = date.getFullYear();
    const label = `${dayName} ${day} ${month} ${year}`;
  
    const hasFlight = allFlights.some(flight => flight.DayOfWeek === fullDayName);
    const li = document.createElement("li");
    li.className = "datebar-item" + (hasFlight ? "" : " unavailable");
    li.textContent = label;
  
    if (hasFlight) {
      li.addEventListener("click", () => {
        document.querySelectorAll(".datebar-item.selected").forEach(el => {
          el.classList.remove("selected");
        });
        li.classList.add("selected");
        paramdate = li.textContent;

        const defualturl = `http://localhost:3000/api/listflights?OutBound=${OutBound}&InBound=${InBound}&OutDate=${ConvertDate(paramdate)}&numOfnights=${numOfNights}`;
        fetchandRenderFlights(defualturl);
      });
    }
  
    container.appendChild(li);
  }
}

////////////////////////////////////////////////////////////////////////
// Function: displayFlights
// Renders the list of flights into the flight list container.
// Updates the heading for outbound or inbound flights and 
// attaches event listeners to the Continue buttons.
////////////////////////////////////////////////////////////////////////
function displayFlights(response) {
  const container = document.querySelector('.flight-list-Wrapper');
  const heading = document.querySelector(".flightheading");
  container.innerHTML = '';

  if (response.length < 1) {
    container.innerHTML = '<p>No flights available</p>';
    return;
  }

  response.forEach((flight) => {
    if (mode == 0) {
      heading.innerHTML = `Outbound ${flight.OriginAirportName} to ${flight.DestinationAirportName}`;
    } else {
      heading.innerHTML = `Inbound ${flight.OriginAirportName} to ${flight.DestinationAirportName}`;
    }

    const flightitem = `
      <article class="flight-item roundedbox">
        <div class="data-codes datacode-inbound">
          <p class="datacode-date inbound-date">${ConvertDate(paramdate)}</p>
          <p class="datacode-time inbound-time">${standardisetime(flight.TakeOffTime)}</p>
          <p class="datacode-aircode inbound-aircode">${flight.OriginAirportName}</p>
        </div>
        <div class="flight-line">
          <span class="dot"></span>
          <div class="line"></div>
          <div class="line"></div>
          <span class="dot"></span>
        </div>
        <div class="airline-info">
          <p>${flight.OperatorName}</p>
        </div>
        <p class="flight-length">${convertminstoHour(flight.FlightTime).toFixed(2)}hrs</p>
        <p class="flight-type">${flight.FlightNum}</p>
        <div class="data-codes datacode-outbound">
          <p class="datacode-date outbound-date">${ConvertDate(paramdate)}</p>
          <p class="datacode-time outbound-time">${addMinutesToTime(flight.TakeOffTime, flight.FlightTime)}</p>
          <p class="datacode-aircode outbound-aircode">${flight.DestinationAirportName}</p>
        </div>
        <div class="data-codes-buttons">
          <button class="viewMoreButton" FlightTimetable-id="${flight.FlightTimeID}" FlightDate-date="${ConvertDate(paramdate)}">Continue</button>
        </div>
      </article>
    `;
    container.innerHTML += flightitem;

    document.querySelectorAll('.viewMoreButton').forEach(button => {
      button.addEventListener('click', () => {
        const flightID = button.getAttribute('FlightTimetable-id');
        const flightDate = button.getAttribute('FlightDate-date');
        postOutboundflight(flightID, flightDate);
      });
    });
  });
}

////////////////////////////////////////////////////////////////////////
// Function: postOutboundflight
// Posts the selected outbound flight to the server. If the mode is 
// outbound (0), switches to inbound flights. If already inbound (1), 
// posts the final booking data and redirects to checkout.
////////////////////////////////////////////////////////////////////////
function postOutboundflight(flightid, date) {
  if (mode == 0) {
    const payload = { flightID: flightid, date: date };

    fetch('../../search/flights/outbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));

    mode = 1;
    const defualturl = `http://localhost:3000/api/listflights?OutBound=${OutBound}&InBound=${InBound}&OutDate=${ConvertDate(paramdate)}&numOfnights=${numOfNights}`;
    fetchandRenderFlights(defualturl);
  } else {
    var payload;
    if (hotelid != null) {
      payload = { flightID: flightid, date: date, hotel: hotelid, adults: adult, child: child, numOfNights: numOfNights, type: type };
    } else {
      payload = { flightID: flightid, date: date, adults: adult, child: child, numOfNights: numOfNights, type: type };
    }

    fetch('../../search/flights/inbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
      window.location.href = "../../checkout";
    })
    .catch(error => console.error('Error:', error));
  }
}

////////////////////////////////////////////////////////////////////////
// Function: parseUKDate
// Utility function to convert UK formatted date strings (DD/MM/YYYY) 
// into a JavaScript Date object.
////////////////////////////////////////////////////////////////////////
function parseUKDate(str) {
  const [day, month, year] = str.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

////////////////////////////////////////////////////////////////////////
// Run on DOM Load
// Retrieves query parameters, builds the default URL, 
// and fetches outbound flights.
////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  getQueryParameters();
  const defualturl = `http://localhost:3000/api/listflights?OutBound=${OutBound}&InBound=${InBound}&OutDate=${ConvertDate(paramdate)}&numOfnights=${numOfNights}`;
  fetchandRenderFlights(defualturl);
});
