const path = require('path')
const router = require('express').Router()
const controllers = require(path.join(process.cwd(), '/controllers'))

router.get('/authenticate', async (request, response) => {
  controllers.users.doRequestCode(request.query.phone).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.post('/authenticate', async (request, response) => {
  controllers.users.doAuthenticate(request.body.phone, request.body.code).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.post('/', async (request, response) => {
  controllers.users.doCheckAdmin(request.user.id).then(_ => {
    controllers.users.doCreate(request.body).then(data => {
      response.status(200).json(data)
    }).catch(error => {
      response.status(500).json({ error: error.message })
    })
  }).catch(error => {
    response.status(401).json({ error: error.message })
  })
})

router.get('/', async (request, response) => {
  controllers.users.doRead(request.user.id).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/status/plex', async (request, response) => {
  controllers.users.doCheckPlexInvite(request.user.id).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.get('/preferences/default', async (request, response) => {
  controllers.users.doGetDefaultPreferences(request.user.id).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error.message })
  })
})

router.post('/preference', async (request, response) => {
  controllers.users.doSetPreference(request.user.id, request.body.preference, request.body.preferenceValue).then(data => {
    response.status(200).json(data)
  }).catch(error => {
    response.status(500).json({ error: error })
  })
})

module.exports = router
