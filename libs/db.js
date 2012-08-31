var mongoose = require('mongoose'),
    config = require('../config'),
    db = mongoose.createConnection(config.db.url, config.db.database);

module.exports = db;