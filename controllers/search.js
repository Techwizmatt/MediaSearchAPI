const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()

const search = {
  doQuery (query) {
    return new Promise((resolve, reject) => {
      const queries = [sonarr.doSearchForSeries(query), radarr.doSearchForMovie(query)]

      Promise.all(queries).then(data => {
        const seriesResults = data[0].formatted
        const movieResults = data[1].formatted

        const results = {
          series: seriesResults,
          movies: movieResults,
          raw: {
            series: data[0].raw,
            movies: data[1].raw
          }
        }

        resolve(results)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = search
