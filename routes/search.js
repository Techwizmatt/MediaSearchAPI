const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

// Perform query search
router.get('/', async (request, response) => {
  controllers.search.doQuery(request.user.id, request.query.query).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

module.exports = router
