/**
 * Module dependencies.
 */

var express = require('express'),
    config = require('./config'),
    cluster = require('cluster'),
    http = require('http'),
    numCPUs = require('os').cpus().length,
    api = express();

// API middleware
api.use(express.cookieParser('shhhh, very secret'));
api.use(express.session());
api.use(express.logger('dev'));
api.use(express.bodyParser());

require('./routes')(api);

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({message: "Access Denied"});
  }
}

api.get('/restricted', function(req, res){
  res.send({payload: "You've reached a restricted area!"});
});

// TODO add api.all("*", loadCurrentUser) which will get the currently logged in user
// We want the separate from the authentication middleware just in case

/**
 * Configure Cluster
 */

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(api).listen(3001);
}