var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = new Schema({
  name : { type: String },
  salt : { type: String },
  hash : { type: String }
});

exports.schema = User;
exports.name = 'User';