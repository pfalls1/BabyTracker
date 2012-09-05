var config = {
  port: 3000,
  originURL: 'http://localhost:3000',
  db: {
    url: 'localhost',
    database: 'test'
  },

  logger: {
    use: true,
    level: 'dev'
  }
}

module.exports = config;