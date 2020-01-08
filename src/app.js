const express = require('express')
require('./db/mongoose')
const playerRouter = require('./routers/player')
const contractRouter = require('./routers/contract')
const bodyParser = require('body-parser');
const hbs = require('hbs')
const path = require('path')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
//const expressLayouts = require('express-ejs-layouts');

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()

// Passport Config
require('./middleware/passport')(passport);

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Set up EJS and viewsPath
// app.use(expressLayouts);
// app.set('view engine', 'ejs');
// app.set('views', viewsPath)


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

// Global variables
// LOOK AT EJS TO SEE HOWS ITS CONNECTED
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