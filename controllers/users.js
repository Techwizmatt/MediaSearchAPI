const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))
const jwt = require('jsonwebtoken')
const twillio = require('twilio')(process.env.TWILLIO_ACCOUNT_SID, process.env.TWILLIO_AUTH_TOKEN)

const users = {
  doRequestCode: function (phoneNumber) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          phone: phoneNumber
        },
        raw: true
      }).then(data => {
        if (data !== null) {
          const code = Math.floor(100000 + Math.random() * 900000)

          models.users.update({
            tempCode: code
          }, {
            where: {
              id: data.id
            },
            raw: true
          }).then(_ => {
            twillio.messages
              .create({
                body: `(Plex Media Search) Hey ${data.firstName}, Your login code is ${code}`,
                messagingServiceSid: process.env.TWILLIO_MESSAGING_SID,
                to: `+1${phoneNumber}`
              })
              .then(_ => {
                resolve()
              }).catch(error => {
                reject(error)
              })
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doAuthenticate: function (phoneNumber, code) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          phone: phoneNumber,
          isActive: 1
        },
        raw: true
      }).then(data => {
        if (data !== null) {
          if (data.tempCode === code) {
            const token = jwt.sign({
              id: data.id,
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone
            }, process.env.JWT_KEY)

            resolve({
              user: {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                fullName: data.fullName,
                phone: data.phone
              },
              token: token
            })
          } else {
            reject(new Error())
          }
        } else {
          reject(new Error())
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },
  doRead: function (userId) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          id: userId,
          isActive: 1
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

module.exports = users
