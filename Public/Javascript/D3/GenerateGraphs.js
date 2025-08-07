

    fetch("http://localhost:3000/api/Admin/GetMonthlySales")
      .then(res => res.json())
      .then(data => {
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        
        const svg = d3.select("#chart")
        .append("svg")
        
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("class", "chart-container")  // add class
        .style("width", "100%")   // full width of parent container
        .style("height", "100%"); // keeps aspect ratio

        // X scale (Booking Types)
        const x = d3.scaleBand()
          .domain(data.map(d => d.BookingTypeName))
          .range([margin.left, width - margin.right])
          .padding(0.2);

        // Y scale (Total Bookings)
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.TotalBookings)])
          .nice()
          .range([height - margin.bottom, margin.top]);

        // Bars
        svg.selectAll("rect")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.BookingTypeName))
          .attr("y", d => y(d.TotalBookings))
          .attr("width", x.bandwidth())
          .attr("height", d => height - margin.bottom - y(d.TotalBookings))
          .attr("fill", "steelblue");

        // X Axis
        svg.append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("class", "axis-label");

        // Y Axis
        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .selectAll("text")
          .attr("class", "axis-label");

          svg.selectAll("rect")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.BookingTypeName))
          .attr("y", d => y(d.TotalBookings))
          .attr("width", x.bandwidth())
          .attr("height", d => height - margin.bottom - y(d.TotalBookings))
          .attr("fill", "steelblue");
        
        // Labels
        svg.selectAll(".label")
          .data(data)
          .enter().append("text")
          .attr("class", "label")
          .attr("x", d => x(d.BookingTypeName) + x.bandwidth() / 2) // center horizontally
          .attr("y", d => y(d.TotalBookings) - 5) // 5px above the bar
          .attr("text-anchor", "middle")
          .text(d => d.TotalBookings + " Sales");
      })
      .catch(err => console.error("Error fetching chart data:", err));




      fetch("http://localhost:3000/api/Admin/GetYearlySales")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("yearly-sales");
    const width = container.clientWidth || 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select("#yearly-sales").select("svg").remove();

    const svg = d3.select("#yearly-sales")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%");

    // Define months sorted
    const months = [...new Set(data.map(d => d.Month))];

    // X scale = months
    const x = d3.scalePoint()
      .domain(months)
      .range([margin.left, margin.left + chartWidth])
      .padding(0.5);

    // Y scale = bookings
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.TotalBookings)])
      .nice()
      .range([margin.top + chartHeight, margin.top]);

    // Color by booking type
    const color = d3.scaleOrdinal()
      .domain(["Flight", "Hotel", "Package"])
      .range(["steelblue", "orange", "green"]);

    // Nest data by BookingTypeName
    const grouped = d3.group(data, d => d.BookingTypeName);

    // Draw lines
    const line = d3.line()
      .x(d => x(d.Month))
      .y(d => y(d.TotalBookings));

    grouped.forEach((values, key) => {
      svg.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", color(key))
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    svg.append("g")
    .attr("transform", `translate(0,${margin.top + chartHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")   // rotate 45 degrees up-left
    .style("text-anchor", "end")        // align end of text
    .attr("dx", "-0.8em")               // shift left a bit
    .attr("dy", "0.15em");              // shift down a bit
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

    ["Flight", "Hotel", "Package"].forEach((type, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(type));
      g.append("text").attr("x", 18).attr("y", 10).text(type).style("font-size", "12px");
    });
    // Add labels to each data point
grouped.forEach((values, key) => {
  svg.selectAll(`.label-${key}`)
    .data(values)
    .enter().append("text")
    .attr("class", "line-label")
    .attr("x", d => x(d.Month))
    .attr("y", d => y(d.TotalBookings) - 8)  // place just above the point
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", color(key))
    .text(d => d.TotalBookings);
});

  })
  .catch(err => console.error("Error fetching yearly sales:", err));






  fetch("http://localhost:3000/api/Admin/branchGetMonthlySales")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("yearly-sales");
    const width = container.clientWidth || 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select("#yearly-sales").select("svg").remove();

    const svg = d3.select("#yearly-sales")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%");

    // Define months sorted
    const months = [...new Set(data.map(d => d.Month))];

    // X scale = months
    const x = d3.scalePoint()
      .domain(months)
      .range([margin.left, margin.left + chartWidth])
      .padding(0.5);

    // Y scale = bookings
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.TotalBookings)])
      .nice()
      .range([margin.top + chartHeight, margin.top]);

    // Color by booking type
    const color = d3.scaleOrdinal()
      .domain(["Flight", "Hotel", "Package"])
      .range(["steelblue", "orange", "green"]);

    // Nest data by BookingTypeName
    const grouped = d3.group(data, d => d.BookingTypeName);

    // Draw lines
    const line = d3.line()
      .x(d => x(d.Month))
      .y(d => y(d.TotalBookings));

    grouped.forEach((values, key) => {
      svg.append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", color(key))
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    svg.append("g")
    .attr("transform", `translate(0,${margin.top + chartHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")   // rotate 45 degrees up-left
    .style("text-anchor", "end")        // align end of text
    .attr("dx", "-0.8em")               // shift left a bit
    .attr("dy", "0.15em");              // shift down a bit
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

    ["Flight", "Hotel", "Package"].forEach((type, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(type));
      g.append("text").attr("x", 18).attr("y", 10).text(type).style("font-size", "12px");
    });
    // Add labels to each data point
grouped.forEach((values, key) => {
  svg.selectAll(`.label-${key}`)
    .data(values)
    .enter().append("text")
    .attr("class", "line-label")
    .attr("x", d => x(d.Month))
    .attr("y", d => y(d.TotalBookings) - 8)  // place just above the point
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", color(key))
    .text(d => d.TotalBookings);
});

  })
  .catch(err => console.error("Error fetching yearly sales:", err));

  fetch("http://localhost:3000/api/Admin/branchGetMonthlySales")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("Branch-Comparison");
    const width = container.clientWidth || 900;
    const height = 500;
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear any existing chart
    d3.select("#Branch-Comparison").select("svg").remove();

    const svg = d3.select("#Branch-Comparison")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%");

    // Booking categories
    const bookingTypes = ["Hotels", "Flights", "Packages"];

    // Transform the API data into a flat dataset
    const dataset = [];
    data.forEach(d => {
      bookingTypes.forEach(type => {
        dataset.push({
          Branch: d.BranchName,
          Type: type,
          Current: d[`Current${type}`],
          Previous: d[`Previous${type}`]
        });
      });
    });

    // X0 scale for Branches
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.BranchName))
      .range([margin.left, margin.left + chartWidth])
      .padding(0.2);

    // X1 scale for Booking Types within each branch
    const x1 = d3.scaleBand()
      .domain(bookingTypes)
      .range([0, x0.bandwidth()])
      .padding(0.1);

    // X2 scale for Current vs Previous within each booking type
    const x2 = d3.scaleBand()
      .domain(["Current", "Previous"])
      .range([0, x1.bandwidth()])
      .padding(0.05);

    // Y scale with padding (20% higher than max)
    const y = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => Math.max(d.Current, d.Previous)) * 1.2])
      .nice()
      .range([margin.top + chartHeight, margin.top]);

    // Colors for Current vs Previous
    const color = d3.scaleOrdinal()
      .domain(["Current", "Previous"])
      .range(["steelblue", "orange"]);


 
    // Group by Branch
    const branchGroups = svg.selectAll(".branch")
      .data(data)
      .enter().append("g")
      .attr("class", "branch")
      .attr("transform", d => `translate(${x0(d.BranchName)},0)`);

    // Bars
    branchGroups.selectAll(".type")
      .data(d => bookingTypes.map(type => ({
        Branch: d.BranchName,
        Type: type,
        Current: d[`Current${type}`],
        Previous: d[`Previous${type}`]
      })))
      .enter().append("g")
      .attr("class", "type")
      .attr("transform", d => `translate(${x1(d.Type)},0)`)
      .each(function(d) {
        const g = d3.select(this);
        ["Current", "Previous"].forEach(period => {
          g.append("rect")
            .attr("x", x2(period))
            .attr("y", y(d[period]))
            .attr("width", x2.bandwidth())
            .attr("height", chartHeight + margin.top - y(d[period]))
            .attr("fill", color(period));

          // Add labels above bars
          g.append("text")
            .attr("x", x2(period) + x2.bandwidth() / 2)
            .attr("y", y(d[period]) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "black")
            .text(d[period]);
        });
      });

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${margin.top + chartHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 150}, ${margin.top})`);

    ["Current", "Previous"].forEach((period, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(period));
      g.append("text").attr("x", 18).attr("y", 10).text(period).style("font-size", "12px");
    });
  })
  .catch(err => console.error("Error fetching yearly sales:", err));




  // generate trending
  

  fetch("http://localhost:3000/api/Admin/GetTrending")
  .then(res => res.json())
  .then(data => {
    try {
      let html = "";

      data.forEach(d => {
        html += `
          <tr>
            <td>${d.CountryName}</td>
            <td>${d.TownName}</td>
            <td>${d.CurrentBookings}</td>
            <td>${d.PreviousBookings}</td>
            <td class="${d.ChangeInBookings > 0 ? 'positive' : d.ChangeInBookings < 0 ? 'negative' : ''}">
              ${d.ChangeInBookings > 0 ? "+" : ""}${d.ChangeInBookings}
            </td>
            <td class="${d.PercentageChange.includes('-') ? 'negative' : d.PercentageChange !== 'N/A' ? 'positive' : ''}">
              ${d.PercentageChange}
            </td>
          </tr>
        `;
      });
  
      document.querySelector("#trending-body").innerHTML = html;
  
    } catch (err) {
      console.error("Error fetching trending destinations:", err);
      document.querySelector("#trending-body").innerHTML =
        `<li class="TrendingRow"><span>Error loading data</span></li>`;
    }
  

  })
  .catch(err => console.error("Error fetching yearly sales:", err));


  
  fetch("http://localhost:3000/api/Admin/hotelTopSellers")
  .then(res => res.json())
  .then(data => {
    console.log(data)


    try{
      // Group JSON by branch
      const branches = {};
      data.forEach(item => {
        if (!branches[item.BranchName]) {
          branches[item.BranchName] = { top: [], bottom: [] };
        }
        if (item.Category === "Top 5") {
          branches[item.BranchName].top.push(item);
        } else if (item.Category === "Bottom 5") {
          branches[item.BranchName].bottom.push(item);
        }
      });
  
      // Build HTML
      let html = `
        <li class="Saleslistitem heading">
          <h4>Location</h4>
          <h4>Top Hotels</h4>
          <h4>Lowest Sales Hotels</h4>
        </li>
      `;
  
      for (const branch in branches) {
        html += `
          <li class="Saleslistitem salerow">
            <h3>${branch}</h3>
            <ul class="SalesItemList topsales">
              ${branches[branch].top.length
                ? branches[branch].top.map(h => `<li>${h.HotelName} (${h.BookingCount})</li>`).join("")
                : "<li><em>No Data</em></li>"
              }
            </ul>
            <ul class="SalesItemList lowestSales">
              ${branches[branch].bottom.length
                ? branches[branch].bottom.map(h => `<li>${h.HotelName} (${h.BookingCount})</li>`).join("")
                : "<li><em>No Data</em></li>"
              }
            </ul>
          </li>
        `;
      }
  
      document.querySelector(".Saleslist").innerHTML = html;
  
    } catch (err) {
      console.error("Error fetching branch stats:", err);
      document.querySelector(".Saleslist").innerHTML = `
        <li class="Saleslistitem"><p>Error loading branch stats</p></li>
      `;
    }


  })
  .catch(err => console.error("Error fetching yearly sales:", err));
