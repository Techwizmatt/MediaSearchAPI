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

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(process.cwd(), '/ssl/key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), '/ssl/cert.crt')),
  ca: fs.readFileSync(path.join(process.cwd(), '/ssl/ca.crt'))
}, app)

httpsServer.listen(3333, () => {
  console.log('HTTPS Server running on port 3333')
})
