// config refers to the normal config file for babyTracker
module.exports = function(mongoose, config) {
  return mongoose.createConnection(config.db.url, config.db.database);
};