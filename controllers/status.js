const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const nzbget = new libs.Nzbget()
const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()

const status = {
  doGetCurrent () {
    return new Promise((resolve, reject) => {
      nzbget.doGetStatus().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetHistory () {
    return new Promise((resolve, reject) => {
      nzbget.doGetHistory().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetDownloads () {
    return new Promise((resolve, reject) => {
      const downloads = [sonarr.doGetOrganizedDownloadQueue(), radarr.doGetOrganizedDownloadQueue()]

      Promise.all(downloads).then(data => {
        resolve({
          series: data[0],
          movies: data[1]
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = status
