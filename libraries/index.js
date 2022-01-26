const path = require('path')

const libraries = {
  Sonarr: require(path.join(process.cwd(), '/libraries/sonarr')),
  Radarr: require(path.join(process.cwd(), '/libraries/radarr'))
}

module.exports = libraries
