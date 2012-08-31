var config = {},
    fs = require('fs'),
    env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    envConfigFile = env + '.js',
    envConfig = fs.existsSync(__dirname + '/' + envConfigFile) ? require('./' + envConfigFile) : {};

// merge envConfig into config
for (var attrname in envConfig) { config[attrname] = envConfig[attrname]; }

module.exports = config;