/**
 * Module dependencies.
 */

var express = require('express'),
    config  = require('./config'),
    cluster = require('cluster'),
    http    = require('http'),
    numCPUs = require('os').cpus().length,
    api     = express();

/**
 * Configure Cluster
 */
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // set configuration on the app
  api.config = config;

  // API middleware
  // TODO: better secret key for cookie parser
  api.use(express.cookieParser('shhhh, very secret'));
  api.use(express.session());
  api.use(express.bodyParser());
  if(api.config.logger.use) {
    api.use(express.logger(api.config.logger.level));
  }

  // Load the routes
  require('./routes')(api);

  // start listening
  api.listen(api.config.port);
}