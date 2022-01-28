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
        'content-type': 'application/json',
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
          raw: data.data,
          formatted: []
        }

        data.data.forEach(series => {
          results.formatted.push({
            title: series.title,
            overview: series.overview ? series.overview : null,
            year: series.year ? series.year : null,
            poster: series.remotePoster ? series.remotePoster : 'https://critics.io/img/movies/poster-placeholder.png',
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

  doGetSeriesByTVDBId (tvdbId) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/series/lookup', {
        params: {
          term: `tvdb:${tvdbId}`
        }
      }).then(data => {
        if (data.data.length >= 1) {
          resolve(data.data[0])
        } else {
          reject(new Error('Unable to find series'))
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  doAddSeries (tvdbId) {
    return new Promise((resolve, reject) => {
      this.doGetSeriesByTVDBId(tvdbId).then(data => {
        this.api.http.post('/series', {
          tvdbId: tvdbId,
          title: data.title,
          titleSlug: data.titleSlug,
          images: data.images,
          seasons: data.seasons,
          profileId: 1,
          seasonFolder: true,
          monitored: false,
          path: `/${data.title}`,
          seriesType: data.seriesType,
          addOptions: {
            ignoreEpisodesWithFiles: true,
            searchForMissingEpisodes: false
          }
        }).then(data => {
          resolve(data.data)
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = sonarr
