const path = require('path')

require('dotenv').config({
  path: path.join(process.cwd(), '/.env')
})

const cors = require('cors')
const app = require('express')()
const parser = require('body-parser')
const https = require('https')
const fs = require('fs')

app.use(cors({
  origin: '*', optionsSuccessStatus: 200
}))

app.use(parser.urlencoded({
  extended: true
}))

app.use(parser.json())

app.use('/', require(path.join(process.cwd(), '/routes')))

app.use((request, response, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

let options = {}

try {
  options = {
    key: fs.readFileSync(path.join(process.cwd(), '/ssl/*.techhost.co.key'), 'utf8'),
    cert: fs.readFileSync(path.join(process.cwd(), '/ssl/*.techhost.co.crt'), 'utf8'),
    ca: fs.readFileSync(path.join(process.cwd(), '/ssl/gd_bundle-g2-g1.crt'), 'utf8')
  }
} catch (error) {
  console.log(error)
}

const httpsServer = https.createServer(options, app)

httpsServer.listen(3333, () => {
  console.log('Server running on port 3333')
})
