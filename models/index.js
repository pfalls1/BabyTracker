var fs = require('fs');

module.exports = function(mongoose) {
  // This will load all files in this directory, these files are assumed to include
  // additional routes.
  fs.readdirSync(__dirname).forEach(function(file) {
      if (file == "index.js") return;
      var name = file.substr(0, file.indexOf('.'));
      require('./' + name)(mongoose);
  });
}