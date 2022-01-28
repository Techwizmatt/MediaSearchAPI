const path = require('path')

module.exports = {
  search: require(path.join(process.cwd(), '/controllers/search')),
  series: require(path.join(process.cwd(), '/controllers/series'))
}
