const path = require('path')

const libraries = {
  Sonarr: require(path.join(process.cwd(), '/libraries/sonarr')),
  Radarr: require(path.join(process.cwd(), '/libraries/radarr')),
  Nzbget: require(path.join(process.cwd(), '/libraries/nzbget'))
}

module.exports = libraries
