const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.get('/', async (request, response) => {
  controllers.queue.doGetAll().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/test', async (request, response) => {
  controllers.queue.doMatchQueues().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

module.exports = router
