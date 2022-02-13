const path = require('path')
const cron = require('cron')
const chalk = require('chalk')
const libs = require(path.join(process.cwd(), '/libraries'))
const controllers = require(path.join(process.cwd(), '/controllers'))

class watcher {
  constructor (cronArg) {
    this.cronArg = cronArg

    this.job = new cron.CronJob(this.cronArg, function () {
      new Promise((resolve, reject) => {
        console.log(chalk.green('---=== WATCHER STARTED ===---'))
        controllers.queue.doMatchQueues().then(_ => {
          controllers.queue.doCheckQueuesComplete().then(_ => {
            resolve()
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      }).then(_ => {
        console.log(chalk.green('---=== WATCHER FINISHED ===---'))
      }).catch(error => {
        console.log(error)
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
