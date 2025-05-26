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
const exphbs = require('express-handlebars');
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute.js")
const baseController = require("./controllers/baseController")


app.set("view engine", "ejs");
app.set("views", "./views");  

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"));

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", baseController.buildHome);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}, // hide stack in production
  });
});