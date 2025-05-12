/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

app.set("view engine", "ejs"); // Enable EJS templates
app.set("views", "./views");   // Specify views directory


app.use(express.static("public")); // Serve files from 'public' folder

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", (req, res) => {
  res.render("index"); 
});

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
