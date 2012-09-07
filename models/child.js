module.exports = function(mongoose) {
  var Schema = mongoose.Schema,
      Child = new Schema({
        name   : String,
        parent : [{ type: Schema.ObjectId, ref: 'User' }]
      });

  return mongoose.model('Child', Child);
};