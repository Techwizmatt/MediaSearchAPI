const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.get('/', async (request, response) => {
  controllers.status.doGetCurrent().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error })
  })
})

router.get('/downloads', async (request, response) => {
  controllers.status.doGetDownloads().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error })
  })
})

module.exports = router
