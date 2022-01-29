const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const nzbget = new libs.Nzbget()

const status = {
  doGetCurrent () {
    return new Promise((resolve, reject) => {
      nzbget.doGetStatus().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetHistory () {
    return new Promise((resolve, reject) => {
      nzbget.doGetHistory().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = status
