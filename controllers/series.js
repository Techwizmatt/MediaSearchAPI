const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const sonarr = new libs.Sonarr()

const series = {
  doAdd: async function (tvdbId) {
    return new Promise((resolve, reject) => {
      sonarr.doAddSeries(tvdbId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = series
