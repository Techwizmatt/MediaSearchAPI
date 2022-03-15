const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))

const nzbget = new libs.Nzbget()
const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()

const queue = {
  doAddNewMedia: async function (type, parentMediaId, mediaId, userId = null) {
    return new Promise((resolve, reject) => {
      models.queueStatuses.findOne({
        where: {
          key: 'searching'
        }
      }).then(data => {
        const statusId = data.id
        models.queue.create({
          type: type,
          userId: userId,
          queueStatusId: statusId,
          parentMediaId: parentMediaId,
          mediaId: mediaId
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
  doUserAddSeries: async function (userId, parentMediaId) {
    return new Promise((resolve, reject) => {
      sonarr.doGetSeriesEpisodes(parentMediaId).then(episodes => {
        const queues = []

        episodes.forEach(episode => {
          queues.push(new Promise((resolve, reject) => {
            queue.doAddNewMedia('series', parentMediaId, episode.id, userId).then(queue => {
              resolve(queue)
            }).catch(error => {
              reject(error)
            })
          }))
        })

        Promise.all(queues).then(queues => {
          resolve(queues)
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doUserAddMovie: async function (userId, mediaId) {
    return new Promise((resolve, reject) => {
      radarr.doGetFromMediaId(mediaId).then(_ => {
        queue.doAddNewMedia('movie', mediaId, mediaId, userId).then(queue => {
          resolve([queue])
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllWithMedia: async function () {
    return new Promise((resolve, reject) => {
      models.queueStatuses.findOne({
        where: {
          key: 'complete'
        }
      }).then(complete => {
        models.queueStatuses.findOne({
          where: {
            key: 'failed'
          }
        }).then(failed => {
          const completeStatusId = complete.id
          const failedId = failed.id

          models.queue.findAll({
            raw: true,
            where: {
              queueStatusId: {
                [Sequelize.Op.not]: [completeStatusId, failedId]
              },
              createdAt: {
                [Sequelize.Op.gt]: new Date(Date.now() - ((60 * 60 * 1000) * 24))
              }
            }
          }).then(queue => {
            const addMedia = []

            queue.forEach(item => {
              addMedia.push(new Promise((resolve, reject) => {
                const parentMediaId = item.parentMediaId
                const mediaId = item.mediaId
                const type = item.type

                if (type === 'series') {
                  sonarr.doGetSeriesEpisode(mediaId).then(media => {
                    item.media = media

                    resolve(item)
                  }).catch(error => {
                    reject(error)
                  })
                } else if (type === 'movie') {
                  radarr.doGetFromMediaId(mediaId).then(media => {
                    item.media = media

                    resolve(item)
                  }).catch(error => {
                    reject(error)
                  })
                } else {
                  resolve(item)
                }
              }))
            })

            Promise.all(addMedia).then(queueWithMedia => {
              resolve(queueWithMedia)
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doMatchQueues: async function () {
    return new Promise((resolve, reject) => {
      nzbget.doGetDownloads().then(nzbgetDownloads => {
        Promise.all([sonarr.doGetOrganizedDownloadQueue(), radarr.doGetOrganizedDownloadQueue()]).then(services => {
          services.forEach(service => {
            if (Object.keys(service).length >= 1) {
              Object.keys(service).forEach(serviceParentMediaId => {
                const serviceMedia = service[serviceParentMediaId]
                const serviceMediaType = serviceMedia.type

                const two = []

                serviceMedia.downloads.forEach(download => {
                  two.push(new Promise((resolve, reject) => {
                    const serviceMediaId = download.mediaId
                    const serviceFilename = download.filename
                    const serviceDownloadType = download.type

                    new Promise((resolve, reject) => {
                      models.queue.findAll({
                        where: {
                          parentMediaId: serviceParentMediaId,
                          mediaId: serviceMediaId
                        }
                      }).then(queues => {
                        if (queues.length >= 1) {
                          resolve(queues)
                        } else {
                          queue.doAddNewMedia(serviceMediaType, serviceParentMediaId, serviceMediaId).then(queue => {
                            resolve([queue])
                          }).catch(error => {
                            reject(error)
                          })
                        }
                      }).catch(error => {
                        reject(error)
                      })
                    }).then(_ => {
                      const three = []

                      nzbgetDownloads.forEach(nzbgetDownload => {
                        three.push(new Promise((resolve, reject) => {
                          const nzbgetFilename = nzbgetDownload.NZBName
                          const nzbgetId = nzbgetDownload.NZBID
                          const nzbgetStatus = nzbgetDownload.Status.toLowerCase()

                          if (nzbgetFilename === serviceFilename) {
                            models.queue.update({
                              nzbgetId: nzbgetId,
                              filename: serviceFilename
                            }, {
                              where: {
                                parentMediaId: serviceParentMediaId,
                                mediaId: serviceMediaId
                              }
                            }).then(_ => {
                              models.queueStatuses.findOne({
                                where: {
                                  key: nzbgetStatus
                                }
                              }).then(status => {
                                if (status !== null) {
                                  models.queue.update({
                                    queueStatusId: status.id
                                  }, {
                                    where: {
                                      parentMediaId: serviceParentMediaId,
                                      mediaId: serviceMediaId
                                    }
                                  }).then(_ => {
                                    resolve()
                                  }).catch(error => {
                                    reject(error)
                                  })
                                } else {
                                  resolve()
                                }
                              }).catch(error => {
                                reject(error)
                              })
                            }).catch(error => {
                              reject(error)
                            })
                          } else {
                            resolve()
                          }
                        }))
                      })

                      Promise.all(three).then(_ => {
                        resolve(three)
                      }).catch(error => {
                        reject(error)
                      })
                    }).catch(error => {
                      reject(error)
                    })
                  }))
                })

                Promise.all(two).then(_ => {
                  resolve()
                }).catch(error => {
                  reject(error)
                })
              })
            } else {
              resolve()
            }
          })
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },
  doCheckQueuesComplete: async function () {
    return new Promise((resolve, reject) => {
      models.queueStatuses.findOne({
        where: {
          key: 'complete'
        }
      }).then(data => {
        if (data !== null) {
          const completeStatusId = data.id

          models.queue.findAll({
            where: {
              queueStatusId: {
                [Sequelize.Op.not]: completeStatusId
              },
              nzbgetId: {
                [Sequelize.Op.not]: null
              }
            }
          }).then(queues => {
            const loop = []

            queues.forEach(queue => {
              loop.push(new Promise((resolve, reject) => {
                const type = queue.type
                const parentMediaId = queue.parentMediaId
                const mediaId = queue.mediaId

                if (type === 'series') {
                  sonarr.doGetSeriesEpisodeFile(mediaId).then(data => {
                    if (data !== null) {
                      models.queue.update({
                        queueStatusId: completeStatusId,
                        fileId: data.id
                      }, {
                        where: {
                          parentMediaId: parentMediaId,
                          mediaId: mediaId
                        }
                      }).then(_ => {
                        resolve()
                      }).catch(error => {
                        reject(error)
                      })
                    } else {
                      resolve()
                    }
                  }).catch(error => {
                    reject(error)
                  })
                  resolve()
                } else if (type === 'movie') {
                  radarr.doGetMovieFile(mediaId).then(data => {
                    if (data !== null) {
                      models.queue.update({
                        queueStatusId: completeStatusId,
                        fileId: data.id
                      }, {
                        where: {
                          parentMediaId: parentMediaId,
                          mediaId: mediaId
                        }
                      }).then(_ => {
                        resolve()
                      }).catch(error => {
                        reject(error)
                      })
                    } else {
                      resolve()
                    }
                  }).catch(error => {
                    reject(error)
                  })
                } else {
                  resolve()
                }
              }))
            })

            Promise.all(loop).then(data => {
              resolve(data)
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doCheckQueuesTimeout: async function () {
    return new Promise((resolve, reject) => {
      models.queueStatuses.findOne({
        where: {
          key: 'complete'
        }
      }).then(complete => {
        models.queueStatuses.findOne({
          where: {
            key: 'failed'
          }
        }).then(failed => {
          const completeStatusId = complete.id
          const failedId = failed.id

          models.queue.update({
            queueStatusId: failedId
          }, {
            raw: true,
            where: {
              nzbgetId: null,
              queueStatusId: {
                [Sequelize.Op.not]: [completeStatusId, failedId]
              },
              createdAt: {
                [Sequelize.Op.lt]: new Date(Date.now() - ((60 * 60 * 1000) * 24))
              }
            }
          }).then(_ => {
            resolve()
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = queue
