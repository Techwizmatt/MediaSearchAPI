const express = require('express')
const path = require('path')
const app = express()

app.use('/users', require(path.join(process.cwd(), '/routes/users')))
app.use('/search', require(path.join(process.cwd(), '/routes/search')))
app.use('/status', require(path.join(process.cwd(), '/routes/status')))
app.use('/series', require(path.join(process.cwd(), '/routes/series')))
app.use('/movie', require(path.join(process.cwd(), '/routes/movie')))

module.exports = app
