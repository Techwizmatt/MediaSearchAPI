const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models

const sonarr = new libs.Sonarr()
const radarr = new libs.Radarr()

const search = {
  doQuery (userId, query) {
    return new Promise((resolve, reject) => {
      models.searchHistory.create({
        userId: userId,
        query: query
      }).then(search => {
        const queries = [sonarr.doSearchForSeries(query), radarr.doSearchForMovie(query)]

        Promise.all(queries).then(data => {
          const seriesResults = data[0].formatted
          const movieResults = data[1].formatted

          const results = {
            id: search.id,
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
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = search
