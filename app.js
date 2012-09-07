/**
 * Module dependencies.
 */

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

/**
 * Configure Cluster
 */
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  var express  = require('express'),
      config   = require('./config'),
      api      = express(),
      mongoose = require('mongoose'),
      db       = require('./libs/db')(mongoose, config); 

  // intialize models
  require('./models')(mongoose);
  
  // set configuration on the app
  // using api.set in this case, ma not be the right choice
  api.set('config', config);
  api.set('db', db);

  // API middleware
  // TODO: better secret key for cookie parser
  api.use(express.cookieParser('shhhh, very secret'));
  api.use(express.session());
  api.use(express.bodyParser());
  if(config.logger.use) {
    api.use(express.logger(config.logger.level));
  }

  // Load the routes
  require('./routes')(api);

  // start listening
  api.listen(config.port);
}