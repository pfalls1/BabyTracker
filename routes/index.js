var fs = require('fs');

module.exports = function(api){
  // Allow access to api from app
  // CORS supports
  api.all('*', function(req, res, next) {
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    next();
  });

  fs.readdirSync(__dirname).forEach(function(file) {
      if (file == "index.js") return;
      var name = file.substr(0, file.indexOf('.'));
      require('./' + name)(api);
  });
}