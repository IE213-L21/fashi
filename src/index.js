const express = require('express')
const  morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs  = require('express-handlebars')
const path = require('path')
const route = require('./routes')
const app = express()
const port = 3000

// Middleware
app.use(express.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

// Static files
app.use(express.static(path.join(__dirname, 'public'))) 

// Template engine
app.engine('.hbs', hbs({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'resources', 'views')) //set views

//HTTP logger
app.use(morgan('dev'))

//Routes
route(app)

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`)
})