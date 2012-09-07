var fs = require('fs');

module.exports = function(api) {
  var config = api.get('config');

  // Allow access to api from app
  // CORS supports
  api.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', config.originURL);
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
  });

  // This will load all files in this directory, these files are assumed to include
  // additional routes.
  fs.readdirSync(__dirname).forEach(function(file) {
      if (file == "index.js") return;
      var name = file.substr(0, file.indexOf('.'));
      require('./' + name)(api);
  });
}