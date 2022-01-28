const axios = require('axios')

class radarr {
  constructor () {
    this.api = {
      endpoint: process.env.RADARR_ENDPOINT,
      token: String(),
      http: Object()
    }

    this.api.http = axios.create({
      baseURL: this.api.endpoint,
      headers: {
        'x-api-key': process.env.RADARR_KEY
      }
    })
  }

  doSearchForMovie (query) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/movie/lookup', {
        params: {
          term: query
        }
      }).then(data => {
        const results = {
          raw: data.data,
          formatted: []
        }

        data.data.forEach(movie => {
          results.formatted.push({
            title: movie.title,
            overview: movie.overview ? movie.overview : null,
            year: movie.year ? movie.year : null,
            poster: movie.remotePoster ? movie.remotePoster : 'https://critics.io/img/movies/poster-placeholder.png',
            studio: movie.studio ? movie.studio : null,
            onDrive: movie.hasFile,
            id: movie.tmdbId,
            type: 'movie'
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

module.exports = radarr
