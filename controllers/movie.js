const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const radarr = new libs.Radarr()

const movie = {
  doAdd: async function (tmdbId) {
    return new Promise((resolve, reject) => {
      radarr.doAddMovie(tmdbId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAll: async function () {
    return new Promise((resolve, reject) => {
      radarr.doGetAll().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGet: async function (mediaId) {
    return new Promise((resolve, reject) => {
      radarr.doGetFromMediaId(mediaId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doDelete: async function (mediaId) {
    return new Promise((resolve, reject) => {
      radarr.doDelete(mediaId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = movie
