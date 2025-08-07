
////////////////////////////////////////////////////////////////////////
//    Created 14/07/2025 by Tommy Mannix ///////////////////
//This  is the main start up server script for the web 
// application and handles routing and configuration of the server

const express = require('express');
require('dotenv').config();
const path = require('path');
const flash = require('connect-flash');


//////////////////////// Middle ware linkages////////////////////////////
////////////////////// Middle ware configuration is in /middleware///////
const SessionSetup = require('./middleware/SessionDetails')
const { userSessionMiddleware } = require('./middleware/localvariables'); // new middleware

///////////////// set up the app system ///////////////////////////////////
// configure express view engine
const app = express();
app.use(express.json());

/// Configure to use ejs View engine
app.set('view engine', 'ejs'); 



///////////////Enable helmet content secure policy//////////////////////////
//////////// Configuration stored in /middleware/HelmetSetup.js////////////
const helmetconfig = require('./middleware/HelmetSetup');
app.use(helmetconfig.helmetConfiguration);

// assign a port from the .env file
const PORT = process.env.PORT || 3000;

//Set up the public folder for public assets such as CSS files
app.use('/public', express.static(path.join(__dirname, 'public')));


///////// set up routing files for use within the server instance//////////
///////// all routes are stored in /routes ////////////////////////////////
const homerouter = require("./Routes/HomeRoute");
const Apirouter = require("./Routes/ApiRoute");
const searchrouter = require("./Routes/searchRoute");
const bookingrouter = require("./Routes/BookingRoute");
const Checkoutrouter = require("./Routes/CheckoutRoute");
const Authroute = require("./Routes/authroute");
const AccountRoute = require("./Routes/accountRoute");
const AdminRoute = require("./Routes/AdminRoute");
//////////// Set up the usage of JSON and Urlencoding within Express
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form-encoded data



/////// assign session usage using /middleware/Sessionsetup
app.use(SessionSetup.sessionMiddleware); 
app.use(userSessionMiddleware) // make the session variables avaialble to the system
////////////////// Flash message middleware set up /////////////////////
app.use(flash());
const flashconfig = require('./middleware/FlashMessages')
app.use(flashconfig.flashmessages)


////////////////// Set up routing end points////////////////////////////
app.use("/home",homerouter); // load /home routes
app.use("/api",Apirouter); // load /home routes
app.use("/search",searchrouter); // load /search routes
app.use("/booking",bookingrouter); // load /booking routes
app.use("/checkout",Checkoutrouter); // load /checkout routes
app.use("/auth",Authroute); // load /auth routes
app.use("/account",AccountRoute); // load /auth routes
app.use("/admin",AdminRoute); // load /admin routes
//////////////// Default route redirect to login page if there is not an active session
app.get('/', async(req, res) => {
    res.redirect("./home")
    });
    //////////////// Start the server//////////////////////////////
    
    /// make the server listen on the port
    app.listen(PORT, () => {
      console.log(`HTTPS server running at https://localhost:${PORT}`);
    });
    

    module.exports = app; 