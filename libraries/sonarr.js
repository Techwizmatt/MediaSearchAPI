const axios = require('axios')

class sonarr {
  constructor () {
    this.api = {
      endpoint: process.env.SONARR_ENDPOINT,
      token: String(),
      http: Object()
    }

    this.api.http = axios.create({
      baseURL: this.api.endpoint,
      headers: {
        'x-api-key': process.env.SONARR_KEY
      }
    })
  }

  doSearchForSeries (query) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/series/lookup', {
        params: {
          term: query
        }
      }).then(data => {
        const results = {
          raw: data,
          formatted: []
        }

        data.data.forEach(series => {
          results.formatted.push({
            title: series.title,
            year: series.year ? series.year : null,
            poster: series.remotePoster ? series.remotePoster : null,
            studio: series.network ? series.network : null,
            onDrive: series.seasonFolder,
            id: series.tvdbId,
            type: 'series'
          })
        })

        if (results.formatted.length >= 10) {
          results.formatted.length = 10
        }

        resolve(results)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = sonarr
