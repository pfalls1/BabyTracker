var hash = require('../libs/pwd').hash,
    auth = require('../libs/authenticate');

/**
 * User routes
 *
 * All CRUD routes specific to users.
 *
 */
module.exports = function(api) {
  var User = api.get('db').model('User');

  // GET /users
  // Returns the full list of users in the 
  // system
  api.get('/users', function(req, res) {
    console.log('serving /users');
    User.find({}, function(err, users) {
      console.log('found users');
      if(err) {
        res.send(500);
      } else {
        // TODO: limit fields being sent back, not great to send back
        // hash or salt!
        res.send({
          status: "success",
          users: users
        });
      }
    });
  });

  // GET /user/:id
  // Returns the specific user defined by the :id
  api.get('/user/:id', loadUser, function(req, res) {
    res.send(req.user);
  });

  // POST /user
  // Creates a new user
  // Expected params:
  //  name: string
  //  password: string
  api.post('/user', function(req, res) {
    // TODO: validations
    var user = new User({
      name: req.body.username
    });

    hash(req.body.password, function(err, salt, hash){
      // TODO: Send back an actual error response
      if (err) throw err;
      // store the salt & hash in the "db"
      user.salt = salt;
      user.hash = hash;

      user.save(function(err, user) {
        if(err) {
          // TODO: send better error messages
          res.send(500);
        } else {
          // now that we have saved this user, we will authenticate them
          // because this is an api, we may not want to do that, but for now
          // we're doing it for simplicity
          // TODO: this function is duplicated in the login routes, this should be pulled
          // into its own module
          req.session.regenerate(function(){
            // Store the user's primary key 
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.user = user;
            res.send({status: "success"});
          });
        }
      });
    });
  });

  // PUT /user/:id
  // Updates the user specified by :id
  // Available params:
  //  name: string
  //  password: string
  api.put('/user/:id', auth.requireAuth, loadUser, canEditUser, function(req, res) {
    // TODO: check to see if req.body.name was actually sent
    req.user.name = req.body.name;

    hash(req.body.password, function(err, salt, hash){
      // TODO: Send back an actual error response
      if (err) throw err;
      // store the salt & hash in the "db"
      req.user.salt = salt;
      req.user.hash = hash;

      req.user.save(function(err, user) {
        if(err) {
          // TODO: send better error messages
          res.send(500);
        } else {
          res.send({status: "success"});
        }
      });
    });
  });

  // DELETE /user/:id
  // Deletes this user. This will truely delete them from the system
  api.delete('/user/:id', auth.requireAuth, loadUser, canEditUser, function(req, res) {
    req.user.remove(function(err, user) {
      if(err) {
        res.send(500);
      } else {
        res.send({status: "success"});
      }
    });
  });

  /**
   * Middleware
   */
  function loadUser(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if(err || !user) {
        // TODO: send a better response
        res.send(500);
      } else {
        req.user = user;
        next();
      }
    });
  }

  /**
   * Function that ensures that the current user can view the requested user.
   * For our example, users can only view themselves.
   */
  function canEditUser(req, res, next) {
    if(!req.currentUser || req.current_user._id != req.user._id) {
      // the current user is trying to access the information of another user
      res.send(401);
    } else {
      next();
    }
  }
};