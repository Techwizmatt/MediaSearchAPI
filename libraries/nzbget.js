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

  doGetDownloads () {
    return new Promise((resolve, reject) => {
      this.client.RPCClient.call({
        jsonrpc: '2.0',
        method: 'listgroups',
        params: {},
        id: 0
      }, (error, response) => {
        if (!error) {
          resolve(response.result)
        } else {
          reject(error)
        }
      })
    })
  }

  doDeleteDownload (nzbgetId) {
    return new Promise((resolve, reject) => {
      // this.client.RPCClient.call({
      //   jsonrpc: '2.0',
      //   method: 'editqueue',
      //   params: { params: ['GroupPause', '', [nzbgetId]] },
      //   id: 0
      // }, (error, response) => {
      //   if (!error) {
      //     resolve(response.result)
      //   } else {
      //     reject(error)
      //   }
      // })
    })
  }
}

module.exports = nzbget
