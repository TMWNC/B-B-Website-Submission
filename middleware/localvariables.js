// Created 27/07/2025 by Tommy Mannix
// Middleware to inject the logged-in user's name into res.locals for all EJS views

const userSessionMiddleware = (req, res, next) => {
  res.locals.userName = req.session.userName || null;
  res.locals.isloggedin = req.session.isloggedin || false;
  res.locals.isStaff = req.session.staff || false;
  next();
};

module.exports = { userSessionMiddleware };
