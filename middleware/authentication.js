const ejwt = require('express-jwt')

function authentication () {
  return ejwt({ secret: process.env.JWT_KEY, algorithms: ['HS256'] }).unless({
    path: [
      {
        url: '/users/authenticate',
        methods: ['GET', 'POST', 'OPTIONS']
      }
    ]
  })
}

module.exports = authentication
