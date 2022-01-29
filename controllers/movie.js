const path = require('path')
const libs = require(path.join(process.cwd(), '/libraries'))

const radarr = new libs.Radarr()

const movie = {
  doAdd: async function (tmdbId) {
    return new Promise((resolve, reject) => {
      radarr.doAddMovie(tmdbId).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = movie
