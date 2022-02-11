const path = require('path')
const cron = require('cron')
const libs = require(path.join(process.cwd(), '/libraries'))
const controllers = require(path.join(process.cwd(), '/controllers'))

class watcher {
  constructor (repeatMin) {
    this.repeatMin = repeatMin

    this.job = new cron.CronJob(`*/${this.repeatMin} * * * *`, function () {
      new Promise((resolve, reject) => {
        Promise.all([new libs.Sonarr().doGetOrganizedDownloadQueue(), new libs.Radarr().doGetOrganizedDownloadQueue()]).then(data => {
          data.forEach(service => {
            Object.keys(service).forEach(mediaId => {
              const type = service[mediaId].type
              const title = service[mediaId].title
              const serviceId = service[mediaId].serviceId
              const downloads = service[mediaId].downloads

              downloads.forEach(download => {
                new Promise((resolve, reject) => {
                  controllers.downloads.doGetAllByTypeAndMediaId(type, mediaId).then(downloads => {
                    if (downloads.length === 0) {
                      controllers.downloads.doAdd(type, 0, mediaId, download.downloadId, download.title).then(data => {
                        resolve(data)
                      }).catch(error => {
                        reject(error)
                      })
                    } else {
                      resolve(downloads)
                    }
                  }).catch(error => {
                    reject(error)
                  })
                }).then(downloads => {
                  new Promise((resolve, reject) => {
                    downloads.forEach(data => {
                      const id = data.id

                      if (download.status === 'Completed') {
                        if (download.notice === 'Ok') {
                          controllers.downloads.doUpdate(id, {
                            completedAt: new Date()
                          }).then(_ => {
                            resolve()
                          }).catch(error => {
                            reject(error)
                          })
                        } else {
                          controllers.downloads.doUpdate(id, {
                            failedAt: new Date()
                          }).then(_ => {
                            resolve()
                          }).catch(error => {
                            reject(error)
                          })
                        }
                      }
                    })
                  }).then(_ => {
                    resolve()
                  }).catch(error => {
                    reject(error)
                  })
                }).catch(error => {
                  reject(error)
                })
              })
            })
          })
        }).catch(error => {
          reject(error)
        })
      }).then(_ => {
        console.log('Successfully updated download queues')
      }).catch(error => {
        console.log(`Watcher error: ${error.message}`)
      })
    }, null, null, null, null, true)
  }

  doStart () {
    return new Promise((resolve, reject) => {
      try {
        this.job.start()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = watcher
