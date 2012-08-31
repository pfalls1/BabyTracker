/**
 * Module dependencies.
 */

var express = require('express'),
    cluster = require('cluster'),
    http = require('http'),
    numCPUs = require('os').cpus().length,
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

require('./routes')(api);

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({message: "Access Denied"});
  }
}

api.get('/restricted', restrict, function(req, res){
  res.send({payload: "You've reached a restricted area!"});
});

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
  http.createServer(app).listen(3000);
  http.createServer(api).listen(3001);
}