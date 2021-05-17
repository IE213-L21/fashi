const express = require('express')
const  morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs  = require('express-handlebars')
const path = require('path')
const route = require('./routes')
const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//static files
app.use(express.static(path.join(__dirname, 'public')))
 
// parse application/json
app.use(bodyParser.json())

//template engine
app.engine('.hbs', hbs({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views',path.join(__dirname,'resources', 'views'))//set views

//HTTP logger
app.use(morgan('dev'))

//Routes
route(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})