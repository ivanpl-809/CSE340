const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route for delivering login view
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)


module.exports = router
