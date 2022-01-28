const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.post('/', async (request, response) => {
  controllers.series.doAdd(request.body.id).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error })
  })
})

module.exports = router
