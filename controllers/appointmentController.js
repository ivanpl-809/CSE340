const appModel = require("../models/appointment-model")
const utilities = require("../utilities")

const appointmentController = {}

appointmentController.buildAppointmentForm = async function (req, res) {
  const inv_id = req.params.inv_id
  const nav = await utilities.getNav()

  res.render("appointments/schedule", {
    title: "Schedule Test Drive",
    nav,
    inv_id,
    messages: "",
    errors: [],
  })
}

appointmentController.scheduleAppointment = async function (req, res) {
  const { appointment_date, message, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  const nav = await utilities.getNav()

  if (!appointment_date || !inv_id) {
    return res.status(400).render("appointments/schedule", {
      title: "Schedule Test Drive",
      nav,
      inv_id,
      messages: ["All fields are required."],
    })
  }

  try {
    await appModel.createAppointment(account_id, inv_id, appointment_date, message)
    return res.redirect("/appointments/manage")
  } catch (error) {
    return res.status(500).render("appointments/schedule", {
      title: "Schedule Test Drive",
      nav,
      inv_id,
      messages: ["Error scheduling appointment. Please try again."],
    })
  }
}


appointmentController.buildManagementView = async function (req, res) {
  const nav = await utilities.getNav()
  let appointments

  if (res.locals.accountData.account_type == "Admin") {
    appointments = await appModel.getAllAppointments()
  } else {
    appointments = await appModel.getAppointmentsByAccount(res.locals.accountData.account_id)
  }

  res.render("appointments/management", {
    title: "Manage Appointments",
    nav,
    appointments,
    messages: "",
  })
}

module.exports = appointmentController
