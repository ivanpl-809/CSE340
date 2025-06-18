/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const path = require('path');
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute.js")
const baseController = require("./controllers/baseController")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/")
const appointmentRoute = require("./routes/appointmentRoute")



app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));



app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(utilities.checkJWTToken)
app.use("/appointments", appointmentRoute)



/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", baseController.buildHome);
app.use("/account", accountRoute)


// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

app.get('/errorTest', (req, res, next) => {
  const error = new Error('This is a simulated 500 error as per the errorTestController');
  error.status = 500;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('errors/500', {
    message: err.message || 'Internal Server Error'
  });
});

const errorTestRoute = require("./routes/errorTestRoute")
app.use("/error", errorTestRoute)