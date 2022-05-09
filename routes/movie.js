const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.post('/', async (request, response) => {
  controllers.movie.doAdd(request.body.id).then(data => {
    response.status(200).json(data)
    // controllers.queue.doUserAddMovie(request.user.id, data.id).then(_ => {
    //   response.status(200).json(data)
    // }).catch(error => {
    //   response.status(500).json({ error: error.message })
    // })
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/', async (request, response) => {
  controllers.movie.doGetAll().then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.delete('/', async (request, response) => {
  controllers.movie.doDelete(request.query.mediaId).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

module.exports = router
