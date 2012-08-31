var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'test');

exports.db = db;