var hash = require('../libs/pwd').hash,
    db = require('../libs/db');

module.exports = function(api){
  // dummy database

  var users = {
    tj: { name: 'tj' }
  };

  api.get('/logout', function(req, res){
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('/');
    });
  });

  api.get('/login', function(req, res){
    if (req.session.user) {
      res.send({message: "You are logged in!"});
    } else {
      res.send({message: "You are not logged in."});
    }
  });

  api.post('/login', function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation 
        req.session.regenerate(function(){
          // Store the user's primary key 
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
          res.send({status: "success"});
        });
      } else {
        res.send({status: "error"});
      }
    });
  });

  /**
   * Helper Methods
   */

  // when you create a user, generate a salt
  // and hash the password ('foobar' is the pass here)

  hash('foobar', function(err, salt, hash){
    if (err) throw err;
    // store the salt & hash in the "db"
    users.tj.salt = salt;
    users.tj.hash = hash;
  });


  // Authenticate using our plain-object database of doom!
  function authenticate(name, pass, fn) {
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash(pass, user.salt, function(err, hash){
      if (err) return fn(err);
      if (hash == user.hash) return fn(null, user);
      fn(new Error('invalid password'));
    })
  }
}