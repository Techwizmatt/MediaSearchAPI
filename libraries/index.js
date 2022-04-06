const path = require('path')

const libraries = {
  Sonarr: require(path.join(process.cwd(), '/libraries/sonarr')),
  Radarr: require(path.join(process.cwd(), '/libraries/radarr')),
  Nzbget: require(path.join(process.cwd(), '/libraries/nzbget')),
  Sms: require(path.join(process.cwd(), '/libraries/sms')),
  Plex: require(path.join(process.cwd(), '/libraries/plex')),
  Unraid: require(path.join(process.cwd(), '/libraries/unraid')),
  FileBrowser: require(path.join(process.cwd(), '/libraries/filebrowser'))
}

module.exports = libraries
