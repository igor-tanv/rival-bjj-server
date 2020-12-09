const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors')

require('./db/mongoose')
const apiJsonRouter = require('./routers/api/index')

const app = express()
app.use(cors())
require('./routers/api/chat/index')(app)

// Passport Config
require('./middleware/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json())
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flip the functionality - pass api to PlayerApi
app.use(apiJsonRouter.confirmationApi)
app.use(apiJsonRouter.playerApi)
app.use(apiJsonRouter.contractApi)
app.use(apiJsonRouter.sessionsApi)

module.exports = app