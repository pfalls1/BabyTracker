var hash = require('../libs/pwd').hash,
    db = require('../libs/db'),
    UserSchema = require('../models/user'),
    User = db.model(UserSchema.name, UserSchema.schema);

module.exports = function(api){
  
  // seed db
  User.count({ name: 'tj' }, function (err, count) {
    if (count == 0) {
      var tj = new User({
        name: "tj"
      });

      hash('foobar', function(err, salt, hash){
        if (err) throw err;
        // store the salt & hash in the "db"
        tj.salt = salt;
        tj.hash = hash;

        tj.save();
      });
    }
  });

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