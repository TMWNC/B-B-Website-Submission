

// Created 28/07/2025 by Tommy Mannix

//////////////////////////////////////////////////////////////////////////////////
//// This middleware checks the authentication of a users session, if it is valid 
/// the attached route will continue otherwise it will redirect to auth/login
/////////////////////////////////////////////////////////////////////////////////

// check the authorisation from the session values
const requireAuth = (req, res, next) => {

  
    // check user ID if it is present in the session cookie continue
    if (req.session.isloggedin) {
        next(); 

        // otherwise default to auth/login
    } else {
        console.log("NOT AUTHORISED!");
        res.redirect('./auth/login'); // User is not authenticated, redirect to login page
    }
}


// check the authorisation from the session values that the user is an admin user
const requireAdminAuth = (req, res, next) => {

    console.log(req.session.staff)
    // check user ID if it is present in the session cookie continue
    if (req.session.isAdmin) {
        next(); 

        // otherwise default to auth/login
    } else {
        console.log("NOT AUTHORISED!");
        res.redirect('./auth/login'); // User is not authenticated, redirect to login page
    }
}


// check the authorisation from the session values that the user is an admin user
const requireStaffAuth = (req, res, next) => {

  console.log("staff")
    // check user ID if it is present in the session cookie continue
    if (req.session.staff) {
        next(); 

        // otherwise default to auth/login
    } else {
        console.log("NOT AUTHORISED!");
        res.redirect('./auth/login'); // User is not authenticated, redirect to login page
    }
}


module.exports = {requireAuth,requireAdminAuth,requireStaffAuth}