var mongoose = require('mongoose');

// config refers to the normal config file for babyTracker
module.exports = function(config) {
  return mongoose.createConnection(config.db.url, config.db.database);
};