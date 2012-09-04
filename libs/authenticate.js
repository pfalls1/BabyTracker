exports.role = function(role) {
  return function(req, res, next) {
    // TODO:
    // 1. role equality should be done better
    // 2. req.currentUser seems to rely on other middleware a bit more than I'd like
    //    I'd like to change this so that either this module takes care of retrieving the current user
    //    or this module requires another module that gets the current user
    if(req.currentUser && req.currentUser.role == role) {
      // the logged in user has the required role, we can continue
      next();
    } else {
      // TODO: add some descriptive status perhaps?
      res.send(401);
    }
  };
}