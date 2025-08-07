// Created 27/07/2025 by Tommy Mannix

////////////////////////////////////////////////////////////////////////
// This route caters for all /auth routes including login, logout,
// and account creation functionality.
////////////////////////////////////////////////////////////////////////

const express = require("express");
const router = express.Router();
const { validationResult } = require('express-validator');

const hashing = require("../middleware/Hashing");
const CheckAuth = require('../middleware/checkauth');
const MySqlModule = require('../Modules/mysqlmodule');

////////////////////////////////////////////////////////////////////////
//                     Start of /auth routes
////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////
// GET /auth
// - Redirects to login page
////////////////////////////////////////////////////////////////////////
router.get('/', async (req, res) => {
  res.redirect("../../auth/login");
});


////////////////////////////////////////////////////////////////////////
// POST /auth/login
// - Validates user credentials
// - Sets up session for authenticated user
////////////////////////////////////////////////////////////////////////
router.post('/login', async (req, res) => {
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.redirect('../../auth/login');
  }

  const redirect = req.body.redirect || '/home';
  const password = req.body.password;
  const username = req.body.email;

  try {
    // Retrieve user credentials from DB
    const hashedpassword = await MySqlModule.GetCustomerHashedPassword(username);

    // Verify password
    const validPassword = await hashing.verifyhash(password, hashedpassword[0].HashedPassword);

    if (validPassword) {
      // Assign session values
      req.session.userID = hashedpassword[0].CustomerID;

      // Fetch and store user’s name
      const userdata = await MySqlModule.GetCustomerNameByID(req.session.userID);
      req.session.userName = userdata[0].CustomerFirstName + ' ' + userdata[0].CustomerSurname;
      req.session.isloggedin = true;

      // Redirect to requested page
      return res.redirect(redirect);
    } else {
      // Invalid password
      req.flash('error_msg', 'Invalid username or password');
      return res.redirect(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
    }
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Invalid username or password');
    return res.redirect(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
  }
});



////////////////////////////////////////////////////////////////////////
// GET /auth/staff/login
// - Renders staff login form with optional redirect
////////////////////////////////////////////////////////////////////////
router.get('/staff/login', async (req, res) => {
  const redirect = req.query.redirect || '/';
  const error_msg = req.flash('error_msg');
  res.render("../views/~Login/StaffLogin", { redirect, error_msg });
});


////////////////////////////////////////////////////////////////////////
// POST /auth/Staff/login
// - Validates user credentials for Staff users
// - Sets up session for authenticated Staff user
////////////////////////////////////////////////////////////////////////
router.post('/staff/login', async (req, res) => {
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.redirect('../../auth/staff/login');
  }

  const redirect = req.body.redirect || '../../../admin/Branch';
  const password = req.body.password;
  const username = req.body.email;

  try {
    // Retrieve user credentials from DB
    const hashedpassword = await MySqlModule.GetStaffHashedPassword(username);

    // Verify password
    const validPassword = await hashing.verifyhash(password, hashedpassword[0].StaffHashedPassword);

    if (validPassword) {
      // Assign session values
      req.session.staff = true;
      req.session.StaffID = hashedpassword[0].StaffID;
 
      // Fetch and store user’s name
      const userdata = await MySqlModule.GetStaffNameByID(req.session.StaffID);

    
      req.session.userName = userdata[0].FirstName + ' ' + userdata[0].Surname;
      req.session.accesslevel = userdata[0].AccessLevel
      req.session.isloggedin = true;


      // Redirect to requested page
      return res.redirect(redirect);
    } else {
      // Invalid password
      req.flash('error_msg', 'Invalid username or password');
      return res.redirect(`/auth/staff/login?redirect=${encodeURIComponent(redirect)}`);
    }
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Invalid username or password');
    return res.redirect(`/auth/staff/login?redirect=${encodeURIComponent(redirect)}`);
  }
});



////////////////////////////////////////////////////////////////////////
// GET /auth/logout
// - Ends user session and redirects to login
////////////////////////////////////////////////////////////////////////
router.get('/logout', CheckAuth.requireAuth, async (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});


////////////////////////////////////////////////////////////////////////
// GET /auth/login
// - Renders login form with optional redirect
////////////////////////////////////////////////////////////////////////
router.get('/login', async (req, res) => {
  const redirect = req.query.redirect || '/';
  const error_msg = req.flash('error_msg');
  res.render("../views/~Login/Login", { redirect, error_msg });
});


////////////////////////////////////////////////////////////////////////
// GET /auth/CreateAccount
// - Renders the account creation page
////////////////////////////////////////////////////////////////////////
router.get('/CreateAccount', async (req, res) => {
  const redirect = req.query.redirect || '/';
  res.render("../views/~CreateAccount/CreateAccount", { redirect });
});


////////////////////////////////////////////////////////////////////////
// POST /auth/CreateAccount
// - Validates and creates a new user account
// - Hashes password before saving
////////////////////////////////////////////////////////////////////////
router.post('/CreateAccount', async (req, res) => {
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    req.flash('error_msg', firstError);
    return res.redirect('../../auth/CreateAccount');
  }

  try {
    const redirect = req.body.redirect || '/auth/login';
    const email = req.body.email;
    const Fname = req.body.FName;
    const Sname = req.body.SName;
    const plaintextPassword = req.body.Password;

    // Hash the password
    const hashedPassword = await hashing.generatehash(plaintextPassword);

    // Create user in DB
    const created = await MySqlModule.CreateUser(Fname, Sname, null, null, null, email, hashedPassword);

    if (created) {
      req.flash('error_msg', 'Account created. Log in now.');
      return res.redirect(`/auth/login?redirect=${encodeURIComponent(redirect || '/')}`);
    } else {
      req.flash('error_msg', 'User already exists');
      return res.redirect(`/auth/CreateAccount?redirect=${encodeURIComponent(redirect)}`);
    }
  } catch (err) {
    console.log(err);
    req.flash('error_msg', 'Unknown error - contact admin');
    return res.redirect(`/auth/CreateAccount?redirect=${encodeURIComponent(req.body.redirect || '/')}`);
  }
});


////////////////////////////////////////////////////////////////////////
// Export router module
////////////////////////////////////////////////////////////////////////
module.exports = router;
