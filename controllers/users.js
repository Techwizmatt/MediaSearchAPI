const path = require('path')
const Sequelize = require(path.join(process.cwd(), '/models')).Sequelize
const sequelize = require(path.join(process.cwd(), '/models')).sequelize
const models = require(path.join(process.cwd(), '/models')).models
const libs = require(path.join(process.cwd(), '/libraries'))
const jwt = require('jsonwebtoken')

const users = {
  doRequestCode: function (phoneNumber) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          phone: phoneNumber,
          isActive: 1
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
            new libs.Sms().doSend(phoneNumber, `(Plex Media Search) Hey ${data.firstName}, Your login code is ${code}`).then(_ => {
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
        console.log(error)
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
            models.users.update({
              tempCode: null,
              forceLogout: 0,
              firstLogin: 0
            }, {
              where: {
                id: data.id
              }
            }).then(_ => {
              const token = jwt.sign({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                isAdmin: data.isAdmin
              }, process.env.JWT_KEY)

              resolve({
                user: {
                  id: data.id,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  fullName: data.fullName,
                  phone: data.phone,
                  isAdmin: data.isAdmin,
                  firstLogin: data.firstLogin,
                  isPlexAccepted: data.isPlexAccepted,
                  plexInviteToken: data.plexInviteToken
                },
                token: token
              })
            }).catch(error => {
              reject(error)
            })
          } else {
            reject(new Error())
          }
        } else {
          reject(new Error())
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doCreate: function (user) {
    return new Promise((resolve, reject) => {
      if (user.firstName && user.lastName && user.phone && user.email) {
        new libs.Plex().doInvite(user.email).then(data => {
          models.users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            plexInviteToken: data.inviteToken
          }).then(createdUser => {
            new libs.Sms().doSend(user.phone, `Hey ${createdUser.firstName}, You have been added to Plex Media Search. Check it out at https://techwizmatt.info/plex`).then(_ => {
              resolve(data)
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error)
          })
        }).catch(_ => {
          reject(new Error('Plex email not found or already in use'))
        })
      } else {
        reject(new Error('All fields required'))
      }
    })
  },
  doRead: function (userId) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          id: userId,
          isActive: 1
        },
        include: [
          {
            model: models.usersPreferences,
            as: 'preferences',
            attributes: ['preferences']
          }
        ]
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doCheckAdmin: function (userId) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          id: userId
        }
      }).then(user => {
        if (user.isAdmin) {
          resolve()
        } else {
          reject(new Error())
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doGetDefaultPreferences: function () {
    return new Promise((resolve, reject) => {
      models.preferences.findAll({
        raw: true
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  doSetPreference: function (userId, preference, preferenceValue) {
    return new Promise((resolve, reject) => {
      models.usersPreferences.findOne({
        where: {
          userId: userId
        },
        raw: true
      }).then(data => {
        if (data !== null) {
          const preferences = data.preferences

          preferences[preference] = preferenceValue

          models.usersPreferences.update({
            preferences: preferences
          }, {
            where: {
              userId: userId
            }
          }).then(_ => {
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          reject(new Error())
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  doCheckPlexInvite: function (userId) {
    return new Promise((resolve, reject) => {
      models.users.findOne({
        where: {
          id: userId
        }
      }).then(data => {
        if (data.isPlexAccepted) {
          resolve({
            inviteToken: data.plexInviteToken,
            accepted: data.isPlexAccepted
          })
        } else {
          new libs.Plex().doCheckInvite(data.email).then(plex => {
            models.users.update({
              isPlexAccepted: plex
            }, {
              where: {
                id: userId
              }
            }).then(_ => {
              resolve({
                inviteToken: data.plexInviteToken,
                accepted: plex
              })
            }).catch(error => {
              reject(error)
            })
          }).catch(error => {
            reject(error)
          })
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = users
