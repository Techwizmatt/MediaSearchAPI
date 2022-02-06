const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))

const downloads = {
  doGetAll: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.getAll({
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAdd: async function (type, mediaId, userId) {
    return new Promise((resolve, reject) => {

    })
  }
}

module.exports = downloads
