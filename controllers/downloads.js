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
  doGetAllDownloadingByTypeAndMediaId: async function (type, mediaId) {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          type: type,
          mediaId: mediaId,
          completedAt: {
            [Sequelize.Op.ne]: null
          },
          failedAt: {
            [Sequelize.Op.ne]: null
          }
        },
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetAllByTypeAndMediaId: async function (type, mediaId) {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          type: type,
          mediaId: mediaId
        },
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAdd: async function (type, userId, mediaId, downloadId, title) {
    return new Promise((resolve, reject) => {
      models.downloads.create({
        mediaId: mediaId,
        downloadId: downloadId,
        userId: userId,
        type: type,
        title: title
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doUpdate: async function (id, data) {
    return new Promise((resolve, reject) => {
      models.downloads.update(data, {
        where: {
          id: id
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetDownloadQueue: async function () {
    return new Promise((resolve, reject) => {
      models.downloads.findAll({
        where: {
          completedAt: {
            [Sequelize.Op.ne]: null
          },
          failedAt: {
            [Sequelize.Op.ne]: null
          }
        },
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = downloads
