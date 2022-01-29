const NzbgetNode = require('nzbget-nodejs')

class nzbget {
  constructor () {
    this.client = new NzbgetNode({
      host: process.env.NZBGET_HOST,
      port: process.env.NZBGET_PORT,
      username: process.env.NZBGET_USER,
      password: process.env.NZBGET_PASSWORD
    })
  }

  doGetStatus () {
    return new Promise((resolve, reject) => {
      this.client.status((error, response) => {
        if (!error) {
          resolve(response)
        } else {
          reject(error)
        }
      })
    })
  }

  doGetHistory () {
    return new Promise((resolve, reject) => {
      this.client.history((error, response) => {
        if (!error) {
          resolve(response)
        } else {
          reject(error)
        }
      })
    })
  }
}

module.exports = nzbget
