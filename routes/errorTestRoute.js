const express = require("express")
const router = express.Router()
const errorTestController = require("../controllers/errorTestController")

router.get("/cause-error", errorTestController.throwError)

module.exports = router