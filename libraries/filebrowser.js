const axios = require('axios')

class FileBrowser {
  constructor () {
    this.api = {
      endpoint: process.env.FILE_BROWSER_ENDPOINT,
      token: String(),
      http: Object()
    }

    this.api.http = axios.create({
      baseURL: this.api.endpoint
    })
  }

  _doAuth () {
    return new Promise((resolve, reject) => {
      this.api.http.post('/api/login', {
        username: process.env.FILE_BROWSER_USERNAME,
        password: process.env.FILE_BROWSER_PASSWORD,
        recaptcha: String()
      }).then(response => {
        this.api.http.defaults.headers.common['X-Auth'] = response.data

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  doShareForDay (path) {
    return new Promise((resolve, reject) => {
      this._doAuth().then(_ => {
        this.api.http.post(`/api/share/media${encodeURIComponent(path)}/`, {
          expires: '1',
          unit: 'days',
          password: ''
        }).then(response => {
          console.log(path)
          console.log(response.data)
          resolve(`${process.env.FILE_BROWSER_ENDPOINT}/share/${response.data.hash}`)
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = FileBrowser
