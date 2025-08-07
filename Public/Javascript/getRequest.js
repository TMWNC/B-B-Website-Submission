////////////////////////////////////////////////////////////////////////
// Created 14/07/2025 by Tommy Mannix 
// This function makes an asynchronous GET request to a provided URL
// It retrieves JSON data from the endpoint and returns it to the caller
////////////////////////////////////////////////////////////////////////

async function GetJSONRequest(url) {
    try {
        // Fetch data from the given URL
        const returnJson = await fetch(url);

        // Parse the response as JSON
        const data = await returnJson.json();

        // Return the parsed data to the caller
        return data;
    } 
    catch {
        // If the fetch or parsing fails, alert the user
        alert('error');
    }
}
