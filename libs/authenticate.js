// TODO: A true auth module may in fact need the user module in order to be comprehensive. 
// but idealy this module wouldn't be tied to a database or ORM.

/**
 * Verifies that a user is logged in and sets req.currentUser to the 
 * currently logged in user.
 *
 * Use this middleware likeso:
 *  var auth = require('authenticate');
 *  ...
 *  app.get('/secure', auth.requireAuth, function(req, res) { ... });
 */
exports.requireAuth = function(req, res, next) {
  // set req.currentUser if possible
  getUser(req);

  if (req.currentUser) {
    next();
  } else {
    res.send(401);
  }
};

/**
 * Verifies that the currently logged in user is in the correct role. You do not need to use 
 * requireAuth if you use this middleware.
 * Use this middleware like so:
 *
 *  var auth = require(authenticate);
 *  ...
 *  app.get('/for-admins-only', auth.requireRole('admin'), function(req, res) { ... });
 */
exports.requireRole = function(role) {
  return function(req, res, next) {
    // TODO:
    // 1. role equality should be done better
    // 2. req.currentUser seems to rely on other middleware a bit more than I'd like
    //    I'd like to change this so that either this module takes care of retrieving the current user
    //    or this module requires another module that gets the current user
    
    // Start by getting the current user if there is one. This function will set req.currentUser
    // if the user is logged in.
    getUser(req);

    // Now we check the role field of the user and see if it matches the required role.
    if(req.currentUser && req.currentUser.role == role) {
      // the logged in user has the required role, we can continue
      next();
    } else {
      // TODO: add some descriptive status perhaps?
      res.send(401);
    }
  };
};

/**
 * A helper function that gets the currently logged in user if there is one, and returns it. Undefined will 
 * be returned if the user is not logged in.
 *
 * This function has the side effect of setting req.currentUser
 */
function getUser(req) {
  // TODO: the session is currently holding the entire user, we don't want to do this
  if (req.session.user) {
    req.currentUser = req.session.user;
    return req.currentUser;
  } 

  return undefined;
}