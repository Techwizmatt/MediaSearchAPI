const path = require('path')
const cron = require('cron')
const libs = require(path.join(process.cwd(), '/libraries'))
const controllers = require(path.join(process.cwd(), '/controllers'))

class watcher {
  constructor (repeatMin) {
    this.repeatMin = repeatMin

    this.sonarr = libs.Sonarr()
    this.sms = libs.Sms()

    this.job = new cron.CronJob(`*/${this.repeatMin} * * * *`, function () {
      console.log('Running check')
    }, null, null, null, null, true)
  }

  doStart () {
    this.job.start()
  }
}
