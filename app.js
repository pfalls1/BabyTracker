/**
 * Module dependencies.
 */

var express = require('express'),
    hash = require('./libs/pwd').hash,
    app = express(),
    api = express();

// App Middleware
app.use(express.static(__dirname + '/dist'));

// API middleware
api.use(express.cookieParser('shhhh, very secret'));
api.use(express.session());
api.use(express.logger('dev'));
api.use(express.bodyParser());

// All app urls need to map to the index.html file
app.all('*', function(req, res, next) {
  res.sendfile(__dirname + '/dist' + '/index.html');    
})

// Allow access to api from app
// CORS supports
api.all('*', function(req, res, next) {
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  next();
});

// dummy database

var users = {
  tj: { name: 'tj' }
};

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

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send({message: "Access Denied"});
  }
}

api.get('/restricted', restrict, function(req, res){
  res.send({payload: "You've reached a restricted area!"});
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

app.listen(3000);
api.listen(3001);

console.log('app listening on 3000');
console.log('api listening on 3001');