const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const sonarr = new libs.Sonarr()

const series = {
  doAdd: async function (tvdbId) {
    return new Promise((resolve, reject) => {
      sonarr.doAddSeries(tvdbId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAll: async function () {
    return new Promise((resolve, reject) => {
      sonarr.doGetAll().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetSeries: async function (mediaId) {
    return new Promise((resolve, reject) => {
      sonarr.doGetSeriesFromMediaId(mediaId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllEpisodes: async function (mediaId) {
    return new Promise((resolve, reject) => {
      sonarr.doGetSeriesEpisodes(mediaId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doDelete: async function (mediaId) {
    return new Promise((resolve, reject) => {
      sonarr.doDelete(mediaId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = series
