const express = require('express')
const  morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs  = require('express-handlebars')
const methodOverride = require('method-override');
const path = require('path')
const cookieParser = require('cookie-parser')
const nanoid = require('nanoid')

const Handlebars = require('./helpers/handlebars');
const route = require('./routes')
const db = require('./config/db');
const sortMiddleware = require('./app/middlewares/sortMiddleware');
const setSession = require('./app/middlewares/setSession');
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
/* Khai báo để sử dụng kịch bản passport */
const passportEX = require('./config/passport/passport');
const app = express();
const port = 3000

// Middleware
app.use(express.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json
app.use(cookieParser('arsenalrobertpires'));
app.use(setSession);

// Static files
app.use(express.static(path.join(__dirname, 'public'))) 

//use override method
app.use(methodOverride('_method'));

// Use sortMiddleware
app.use(sortMiddleware);  


/* Cấu hình passport */
passportEX
app.use(session({
  secret : 'secured_key',
  resave : true,
  saveUninitialized : true,
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Template engine
app.engine(
  '.hbs',
  hbs({
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
  }))
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views')); //set views

//HTTP logger
app.use(morgan('dev'));

//Routes
route(app);

//Connect db
db.connect();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
})