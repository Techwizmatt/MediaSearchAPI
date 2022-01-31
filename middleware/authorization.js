const models = require(require('path').join(process.cwd(), '/models')).models

module.exports = (request, response, next) => {
  if (request.user) {
    models.users.findOne({
      where: {
        id: request.user.id
      }
    }).then(_ => {
      next()
    }).catch(_ => {
      console.log('Auth failed')
    })
  } else {
    next()
  }
}
