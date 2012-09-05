var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Child = new Schema({
  name : { type: String }
});

exports.schema = Child;
exports.name = 'Child';