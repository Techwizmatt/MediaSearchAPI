const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))

const nzbget = new libs.Nzbget()
const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()

const downloads = {
  doAdd: async function (type, userId, mediaId, title) {
    return new Promise((resolve, reject) => {
      models.downloads.create({
        mediaId: mediaId,
        userId: userId,
        type: type,
        title: title
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAddSeries: async function (userId, mediaId) {
    return new Promise((resolve, reject) => {
      sonarr.doGetSeriesEpisodes(mediaId).then(episodes => {
        const downloads = []

        episodes.forEach(episode => {
          downloads.push(new Promise((resolve, reject) => {
            models.downloads.create({
              mediaId: episode.id,
              userId: userId,
              type: 'episode',
              title: episode.title
            }).then(data => {
              resolve(data)
            }).catch(error => {
              reject(error)
            })
          }))
        })

        Promise.all(downloads).then(downloads => {
          resolve(downloads)
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAddMovie: async function (userId, mediaId) {
    return new Promise((resolve, reject) => {
      radarr.doGetFromMediaId(mediaId).then(movie => {
        models.downloads.create({
          mediaId: movie.id,
          userId: userId,
          type: 'movie',
          title: movie.title
        }).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAll: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.getAll({
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetNzbgetDownloads () {
    return new Promise((resolve, reject) => {
      nzbget.doGetDownloads().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = downloads
