var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

module.exports = function(db) {
  var User = new Schema({
    name     : String,
    salt     : String,
    hash     : String,
    children : [{ type: Schema.Types.ObjectId, ref: 'Child'}] 
  });

  return db.model('User', User);
};