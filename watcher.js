const path = require('path')
const cron = require('cron')
const libs = require(path.join(process.cwd(), '/libraries'))
const controllers = require(path.join(process.cwd(), '/controllers'))

class watcher {
  constructor (repeatMin) {
    this.repeatMin = repeatMin

    this.job = new cron.CronJob(`*/${this.repeatMin} * * * *`, function () {
      new Promise((resolve, reject) => {
        resolve()
      }).then(_ => {

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
