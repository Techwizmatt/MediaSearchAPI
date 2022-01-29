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
            onDrive: !!movie.path,
            id: movie.tmdbId,
            type: 'movie',
            addOptions: {
              ignoreEpisodesWithFiles: true,
              searchForMissingEpisodes: true
            }
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

  doGetMovieByTMDBId (tmdbId) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/movie/lookup', {
        params: {
          term: `tmdb:${tmdbId}`
        }
      }).then(data => {
        if (data.data.length >= 1) {
          resolve(data.data[0])
        } else {
          reject(new Error('Unable to find movie'))
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  _doForceSearch (id) {
    return new Promise((resolve, reject) => {
      this.api.http.post('/command', {
        movieIds: [id],
        name: 'MoviesSearch'
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doAddMovie (tmdbId) {
    return new Promise((resolve, reject) => {
      this.doGetMovieByTMDBId(tmdbId).then(data => {
        this.api.http.post('/movie', {
          tmdbId: tmdbId,
          title: data.title,
          titleSlug: data.titleSlug,
          images: data.images,
          profileId: 1,
          monitored: true,
          path: `/movies/${data.title}`
        }).then(data => {
          this._doForceSearch(data.data.id).then(_ => {
            resolve(data.data)
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = radarr
