const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.get('/authenticate', async (request, response) => {
  controllers.users.doRequestCode(request.query.phone).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    console.log(error)
    response.status(500).json({ error: error })
  })
})

router.post('/authenticate', async (request, response) => {
  controllers.users.doAuthenticate(request.body.phone, request.body.code).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error })
  })
})

module.exports = router
