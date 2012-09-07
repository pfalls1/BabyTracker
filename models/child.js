var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function(db) {
  var Child = new Schema({
    name   : String,
    parent : [{ type: Schema.Type.ObjectId, ref: 'User' }]
  });

  return db.model('Child', Child);
};