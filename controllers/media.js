const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))

const nzbget = new libs.Nzbget()
const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()
const fileBrowser = new libs.FileBrowser()

const media = {
  doUpdateAllSeries: async function () {
    return new Promise((resolve, reject) => {
      sonarr.doGetAll().then(series => {
        const promises = []

        series.forEach(media => {
          promises.push(new Promise((resolve, reject) => {
            let poster = null

            media.images.forEach(image => {
              if (image.coverType === 'poster') {
                poster = image.remoteUrl
              }
            })

            models.media.findOne({
              where: {
                mediaId: media.id,
                type: 'series'
              }
            }).then(data => {
              if (data === null) {
                models.media.create({
                  type: 'series',
                  mediaId: media.id,
                  serviceId: media.tvdbId,
                  title: media.title,
                  description: media.overview,
                  poster: poster
                }).then(media => {
                  resolve(media)
                }).catch(error => {
                  reject(error)
                })
              } else {
                models.media.update({
                  poster: poster
                }, {
                  where: {
                    mediaId: media.id,
                    type: 'series'
                  }
                }).then(_ => {
                  data.poster = poster

                  resolve(data)
                }).catch(error => {
                  reject(error)
                })
              }
            }).catch(error => {
              reject(error)
            })
          }))
        })

        Promise.all(promises).then(series => {
          resolve(series)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doUpdateAllMovies: async function () {
    return new Promise((resolve, reject) => {
      radarr.doGetAll().then(series => {
        const promises = []

        series.forEach(media => {
          promises.push(new Promise((resolve, reject) => {
            let poster = null

            media.images.forEach(image => {
              if (image.coverType === 'poster') {
                poster = image.remoteUrl
              }
            })

            models.media.findOne({
              where: {
                mediaId: media.id,
                type: 'movie'
              }
            }).then(data => {
              if (data === null) {
                models.media.create({
                  type: 'movie',
                  mediaId: media.id,
                  serviceId: media.tmdbId,
                  title: media.title,
                  description: media.overview,
                  poster: poster
                }).then(media => {
                  resolve(media)
                }).catch(error => {
                  reject(error)
                })
              } else {
                models.media.update({
                  poster: poster
                }, {
                  where: {
                    mediaId: media.id,
                    type: 'movie'
                  }
                }).then(_ => {
                  data.poster = poster

                  resolve(data)
                }).catch(error => {
                  reject(error)
                })
              }
            }).catch(error => {
              reject(error)
            })
          }))
        })

        Promise.all(promises).then(series => {
          resolve(series)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doUpdateAllMedia: async function () {
    return new Promise((resolve, reject) => {
      Promise.all([media.doUpdateAllSeries(), media.doUpdateAllMovies()]).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doShare: async function (path) {
    return new Promise((resolve, reject) => {
      fileBrowser.doShareForDay(path).then(url => {
        resolve({
          location: url
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = media
