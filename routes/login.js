var hash = require('../libs/pwd').hash;

/**
 * Session Routes
 *
 * These are routes that deal with the session. Typically this refers to 
 * logging in and logging out.
 */
module.exports = function(api) {
  var User = api.get('db').model('User');

  // POST /logout
  // Log out the curently logged in user. This will destroy their session
  api.post('/logout', function(req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function() {
      // TOOD: Should I send a message back here, and if so, should I have some sort of messaging module that handles this for me
      // perhaps with localization
      res.send(200, { message: "Logged Out" });
    });
  });

  // POST /login
  // Attempts to login the user with the supplied credentials.
  // Expected params:
  //  username
  //  password
  api.post('/login', function(req, res){
    // TODO move this to the authenticate module
    authenticate(req.body.username, req.body.password, function(err, user){
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation 
        req.session.regenerate(function(){
          // Store the user's primary key 
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          // TODO come up with a uniform response object
          res.send({status: "success"});
        });
      } else {
        // TODO send correct http status
        res.send({status: "error"});
      }
    });
  });

  /**
   * Helper Methods
   */

  // Authenticate using our plain-object database of doom!
  function authenticate(name, pass, fn) {
    User.findOne({ 'name' : name }, function(err, user) {
      if (err || !user) {
        return fn(new Error('cannot find user'));
      } else {
        // apply the same algorithm to the POSTed password, applying
        // the hash against the pass / salt, if there is a match we
        // found the user
        hash(pass, user.salt, function(err, hash){
          if (err) return fn(err);
          if (hash == user.hash) return fn(null, user);
          fn(new Error('invalid password'));
        })
      }
    });
  }
}