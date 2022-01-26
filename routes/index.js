const express = require('express')
const path = require('path')
const app = express()

app.use('/search', require(path.join(process.cwd(), '/routes/search')))

module.exports = app
