const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))

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
  doGetByTypeAndMediaId: async function (type, mediaId) {
    return new Promise((resolve, reject) => {
      models.downloads.findOne({
        where: {
          type: type,
          mediaId: mediaId
        }
      }).then(download => {
        resolve(download)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllDownloading: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          downloadId: {
            [Sequelize.Op.ne]: null
          },
          failedAt: null,
          completedAt: null,
          createdAt: {
            [Sequelize.Op.gt]: new Date(Date.now() - ((60 * 60 * 1000) * 24))
          }
        }
      }).then(download => {
        resolve(download)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllPending: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          failedAt: null,
          completedAt: null
        }
      }).then(download => {
        resolve(download)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllPendingAndSearching: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          downloadId: null,
          failedAt: null,
          completedAt: null,
          createdAt: {
            [Sequelize.Op.gt]: new Date(Date.now() - ((60 * 60 * 1000) * 24))
          }
        }
      }).then(download => {
        resolve(download)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllPendingAndOld: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          downloadId: null,
          failedAt: null,
          completedAt: null,
          createdAt: {
            [Sequelize.Op.lt]: new Date(Date.now() - ((60 * 60 * 1000) * 24))
          }
        }
      }).then(download => {
        resolve(download)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doUpdate: async function (id, data) {
    return new Promise((resolve, reject) => {
      models.downloads.update(data, {
        where: {
          id: id
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = downloads
