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

  /**
   * Converts string time into seconds
   * @param str - 'HH:MM:SS' Format
   * @returns {Number}
   */
  _doConvertStringTimeToSeconds (str) {
    const [hh = '0', mm = '0', ss = '0'] = (str || '0:0:0').split(':')
    const hour = parseInt(hh, 10) || 0
    const minute = parseInt(mm, 10) || 0
    const second = parseInt(ss, 10) || 0
    return (hour * 3600) + (minute * 60) + (second)
  }

  _doForceMonitoring (id) {
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
          this._doForceMonitoring(data.data.id).then(_ => {
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

  doGetDownloadQueue () {
    return new Promise((resolve, reject) => {
      this.api.http.get('/queue', {
        params: {
          page: 1,
          pageSize: 100,
          sortDirection: 'ascending',
          sortKey: 'timeLeft',
          includeUnknownMovieItems: true
        }
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetOrganizedDownloadQueue () {
    return new Promise((resolve, reject) => {
      this.doGetDownloadQueue().then(data => {
        const response = {}

        if (data.length >= 1) {
          data.forEach(download => {
            const id = download.movie.id
            const movieTitle = download.movie.title

            response[id] = {
              title: movieTitle,
              type: 'movie',
              parentMediaId: download.movie.id,
              serviceId: download.movie.tmdbId,
              downloadId: download.id,
              totalSize: download.size,
              totalSizeLeft: download.sizeleft,
              downloads: [{
                title: movieTitle,
                type: 'movie',
                mediaId: download.movie.id,
                downloadId: download.id,
                filename: download.title,
                info: download.movie.year,
                size: download.size,
                sizeLeft: download.sizeleft,
                timeLeft: this._doConvertStringTimeToSeconds(download.timeleft),
                resolution: download.quality.quality.resolution,
                status: download.status,
                notice: download.trackedDownloadStatus
              }]
            }
          })
        }

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetFromMediaId (id) {
    return new Promise((resolve, reject) => {
      this.api.http.get(`/movie/${id}`).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetMovieFile (mediaId) {
    return new Promise((resolve, reject) => {
      this.api.http.get(`/movie/${mediaId}`).then(data => {
        resolve(data.data.movieFile === undefined ? null : data.data.movieFile)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetAll () {
    return new Promise((resolve, reject) => {
      this.api.http.get('/movie').then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doDelete (mediaId) {
    return new Promise((resolve, reject) => {
      this.api.http.delete(`/movie/${mediaId}`, {
        params: {
          id: mediaId,
          deleteFiles: true
        }
      }).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = radarr
