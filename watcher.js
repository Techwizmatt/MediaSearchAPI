const path = require('path')
const cron = require('cron')
const libs = require(path.join(process.cwd(), '/libraries'))
const controllers = require(path.join(process.cwd(), '/controllers'))

class watcher {
  constructor (repeatMin) {
    this.repeatMin = repeatMin

    this.job = new cron.CronJob(`*/${this.repeatMin} * * * *`, function () {
      new Promise((resolve, reject) => {
        Promise.all([new libs.Sonarr().doGetOrganizedDownloadQueue(), new libs.Radarr().doGetOrganizedDownloadQueue()]).then(currentQueueData => {
          currentQueueData.forEach(service => {
            Object.keys(service).forEach(mediaId => {
              const serviceId = service[mediaId].serviceId
              const currentDownloads = service[mediaId].downloads

              const downloading = []

              currentDownloads.forEach(currentDownload => {
                downloading.push(new Promise((resolve, reject) => {
                  const currentDownloadType = currentDownload.type
                  const currentDownloadMediaId = currentDownload.mediaId
                  const currentDownloadTitle = currentDownload.title
                  const currentDownloadId = currentDownload.downloadId
                  const currentDownloadStatus = currentDownload.status
                  const currentDownloadNotice = currentDownload.notice

                  new Promise((resolve, reject) => {
                    controllers.downloads.doGetByTypeAndMediaId(currentDownloadType, currentDownloadMediaId).then(data => {
                      if (data === null) {
                        controllers.downloads.doAdd(currentDownloadType, 0, currentDownloadMediaId, currentDownloadTitle).then(data => {
                          resolve(data)
                        }).catch(error => {
                          reject(error)
                        })
                      } else {
                        resolve(data)
                      }
                    }).catch(error => {
                      reject(error)
                    })
                  }).then(data => {
                    const dbId = data.id
                    const dbDownloadId = data.downloadId
                    const failedAt = data.failedAt
                    const completedAt = data.completedAt

                    new Promise((resolve, reject) => {
                      if (dbDownloadId === null) {
                        controllers.downloads.doUpdate(dbId, {
                          downloadId: currentDownloadId
                        }).then(_ => {
                          resolve()
                        }).catch(error => {
                          reject(error)
                        })
                      } else {
                        resolve()
                      }
                    }).then(_ => {
                      if (currentDownloadNotice !== 'Ok' && failedAt === null) {
                        controllers.downloads.doUpdate(dbId, {
                          failedAt: new Date()
                        }).then(_ => {
                          resolve(dbId)
                        }).catch(error => {
                          reject(error)
                        })
                      } else if (currentDownloadStatus === 'Completed' && currentDownloadNotice === 'Ok' && completedAt === null) {
                        controllers.downloads.doUpdate(dbId, {
                          completedAt: new Date()
                        }).then(_ => {
                          resolve(dbId)
                        }).catch(error => {
                          reject(error)
                        })
                      } else {
                        resolve(dbId)
                      }
                    }).catch(error => {
                      reject(error)
                    })
                  })
                }))
              })

              Promise.all(downloading).then(rawDownloads => {
                rawDownloads.forEach(downloadId => {
                  console.log(`Watched status on current downloads: id - ${downloadId}`)
                })

                console.log('Now checking on downloads in database not found within machine')

                controllers.downloads.doGetAllPendingAndSearching().then(pendingDownloads => {
                  pendingDownloads.forEach(download => {
                    const downloadMediaId = download.mediaId

                    controllers.downloads.doGetAllPendingWithMediaId(downloadMediaId).then(pending => {
                      if (pending.length >= 1) {
                        pending.forEach(pend => {
                          controllers.downloads.doUpdate(pend.id, {
                            failedAt: new Date()
                          }).then(_ => {
                            console.log(`${pend.id} has been marked as failed`)
                          })
                        })
                      }
                    })
                  })
                })
              }).catch(error => {
                console.log(error)
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
