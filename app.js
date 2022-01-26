const path = require('path')

require('dotenv').config({
  path: path.join(process.cwd(), '/.env')
})

const cors = require('cors')
const app = require('express')()
const parser = require('body-parser')

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

const server = app.listen(3030, () => {
  console.log('API RUNNING ON 3030')
})

server.timeout = 10000
