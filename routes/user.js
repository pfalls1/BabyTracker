var db = require('../libs/db'),
    UserSchema = require('../models/user'),
    User = db.model(UserSchema.name, UserSchema.schema);

/**
 * User routes
 *
 * All CRUD routes specific to users.
 *
 * TODO: Some of these routes need some authentication middleware to prevent
 * other users from accessing them, for example, /user/:id should only be 
 * accessible by that user
 */
module.exports = function(api){
  
  // GET /users
  // Returns the full list of users in the 
  // system
  api.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      if(err) {
        res.send(500);
      } else {
        res.send(users);
      }
    });
  });

  // GET /user/:id
  // Returns the specific user defined by the :id
  api.get('/user/:id', function(req, res) {
    // TODO: Discover if i should use _id or __v
    User.findOne({ _id: req.params.id}, function(err, user) {
      if(err) {
        res.send(500);
      } else {
        res.send(user);
      }
    });
  });

  // POST /user
  // Creates a new user
  // Expected params:
  //  name: string
  //  password: string
  api.post('/user', function(req, res) {
    // TODO: validations
    var user = new User({
      name: req.body.name
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
  api.put('/user/:id', function(req, res) {

  });

  // DELETE /user/:id
  // Deletes this user. This will truely delete them from the system
  api.delete('/user/:id', function(req, res) {

  });
};