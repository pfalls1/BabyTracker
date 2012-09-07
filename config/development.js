var config = {
  port: 3001,
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