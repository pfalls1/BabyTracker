module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      User = new mongoose.Schema({
        name     : String,
        salt     : String,
        hash     : String,
        children : [{ type: Schema.ObjectId, ref: 'Child'}] 
      });

  return mongoose.model('User', User);
};