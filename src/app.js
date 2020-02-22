const express = require('express')
require('./db/mongoose')
const playerRouter = require('./routers/player')
const contractRouter = require('./routers/contract')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars')
const path = require('path')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const layoutPath = path.join(__dirname, '../templates/layouts')

const app = express()

// Passport Config
require('./middleware/passport')(passport);

//Setup handlebars engine and views location
app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: layoutPath,
  partialsDir: partialsPath,
} ) );

//app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, '../templates/layouts')})); 
app.set('view engine', 'hbs')
app.set('views', viewsPath)


app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json())

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.all('*', (req, res, next) => {           
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", "zloy.best");
  next();
});

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user
  next();
});

app.use(playerRouter)
app.use(contractRouter)

module.exports = app