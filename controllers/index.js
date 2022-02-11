const path = require('path')

module.exports = {
  downloads: require(path.join(process.cwd(), '/controllers/downloads')),
  search: require(path.join(process.cwd(), '/controllers/search')),
  status: require(path.join(process.cwd(), '/controllers/status')),
  series: require(path.join(process.cwd(), '/controllers/series')),
  movie: require(path.join(process.cwd(), '/controllers/movie')),
  users: require(path.join(process.cwd(), '/controllers/users'))
}
