const express = require('express')
require('./db/mongoose')
const playerRouter = require('./routers/player')
const contractRouter = require('./routers/contract')
const bodyParser = require('body-parser');
const hbs = require('hbs')
const path = require('path')

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json())
app.use(playerRouter)
app.use(contractRouter)

module.exports = app