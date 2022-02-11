const path = require('path')

require('dotenv').config({
  path: path.join(process.cwd(), '/.env')
})

const cors = require('cors')
const app = require('express')()
const parser = require('body-parser')
const https = require('https')
const fs = require('fs')
const Watcher = require(path.join(process.cwd(), '/watcher'))

app.use(cors({
  origin: '*', optionsSuccessStatus: 200
}))

app.use(parser.urlencoded({
  extended: true
}))

app.use(parser.json())

app.use(require(path.join(process.cwd(), '/middleware/authentication'))())

app.all('*', require(path.join(process.cwd(), '/middleware/authorization')))

app.use('/', require(path.join(process.cwd(), '/routes')))

app.use((error, request, response, next) => {
  response.status(error.status).send({ error: error.message })

  next()
})

let options

try {
  options = {
    key: fs.readFileSync(path.join(process.cwd(), '/ssl/*.techhost.co.key'), 'utf8'),
    cert: fs.readFileSync(path.join(process.cwd(), '/ssl/*.techhost.co.crt'), 'utf8'),
    ca: fs.readFileSync(path.join(process.cwd(), '/ssl/gd_bundle-g2-g1.crt'), 'utf8')
  }
} catch (error) {
  console.log('Unable to load SSL')
  options = {}
}

const httpsServer = https.createServer(options, app)

httpsServer.listen(3333, () => {
  console.log('Server running on port 3333')
  const watcher = new Watcher(2)
  watcher.doStart().then(_ => {
    console.log('Watcher started')
  }).catch(error => {
    console.log(`Unable to start watcher: ${error.message}`)
  })
})
