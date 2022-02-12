const axios = require('axios')
const path = require('path')

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
          profileId: 1,
          seasonFolder: true,
          monitored: true,
          path: `/tv/${data.title}`,
          seriesType: data.seriesType,
          addOptions: {
            ignoreEpisodesWithFiles: true,
            searchForMissingEpisodes: true
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

  doGetSeriesEpisodes (mediaId, triesLeft = 5) {
    return new Promise((resolve, reject) => {
      this.api.http.get('/episode', {
        params: {
          seriesId: mediaId
        }
      }).then(data => {
        if (data.data.length === 0 && triesLeft !== 0) {
          const timeout = setTimeout(_ => {
            this.doGetSeriesEpisodes(mediaId, triesLeft - 1).then(data => {
              clearTimeout(timeout)
              resolve(data)
            }).catch(error => {
              reject(error)
            })
          }, 5000)
        } else {
          resolve(data.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetDownloadQueue () {
    return new Promise((resolve, reject) => {
      this.api.http.get('/queue').then(data => {
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
            const id = download.series.id
            const seriesTitle = download.series.title

            const content = {
              title: download.episode.title,
              type: 'episode',
              downloadId: download.id,
              mediaId: download.episode.id,
              info: `Season ${download.episode.seasonNumber} Episode ${download.episode.episodeNumber}`,
              size: download.size,
              resolution: download.quality.quality.resolution,
              sizeleft: download.sizeleft,
              timeleft: this._doConvertStringTimeToSeconds(download.timeleft),
              status: download.status,
              notice: download.trackedDownloadStatus
            }

            if (String(id) in response) {
              response[id].downloads.push(content)
              response[id].totalSize = response[id].totalSize + download.size
              response[id].totalSizeLeft = response[id].totalSizeLeft + download.sizeleft
            } else {
              response[id] = {
                title: seriesTitle,
                type: 'series',
                mediaId: download.series.id,
                serviceId: download.series.tvdbId,
                totalSize: download.size,
                totalSizeLeft: download.sizeleft,
                downloads: [content]
              }
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
      this.api.http.get(`/series/${id}`).then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doGetAll () {
    return new Promise((resolve, reject) => {
      this.api.http.get('/series').then(data => {
        resolve(data.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  doDelete (mediaId) {
    return new Promise((resolve, reject) => {
      this.api.http.delete(`/series/${mediaId}`, {
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

  doRequest (type, endpoint, extra) {
    return new Promise((resolve, reject) => {
      try {
        this.api.http[type](endpoint, extra).then(data => {
          resolve(data.data)
        }).catch(error => {
          reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = sonarr
