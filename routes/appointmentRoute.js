const express = require("express")
const router = express.Router()
const appointmentController = require("../controllers/appointmentController")
const utilities = require("../utilities")

router.get("/schedule/:inv_id", utilities.checkJWTToken, appointmentController.buildAppointmentForm)
router.post("/schedule", utilities.checkJWTToken, appointmentController.scheduleAppointment)
router.get("/manage", utilities.checkJWTToken, appointmentController.buildManagementView)


module.exports = router
