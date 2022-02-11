const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.post('/', async (request, response) => {
  controllers.series.doAdd(request.body.id).then(data => {
    controllers.downloads.doAddSeries(request.user.id, data.id).then(_ => {
      response.status(200).json(data)
    }).catch(error => {
      response.status(500).json({ error: error.message })
    })
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/', async (request, response) => {
  controllers.series.doGetAll().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/episodes', async (request, response) => {
  controllers.series.doGetAllEpisodes(request.query.mediaId).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.delete('/', async (request, response) => {
  controllers.series.doDelete(request.query.mediaId).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

module.exports = router
