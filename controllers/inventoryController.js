const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Build vehicle detail view by inv_id
 * ************************** */

invCont.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.inv_id

  try {
    const vehicleData = await invModel.getVehicleById(inv_id)
    if (!vehicleData) {
      return next()
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData)
    let nav = await utilities.getNav()

    res.render("inventory/vehicle-detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHTML,
    })
  } catch (error) {
    next(error) 
  }
}

  module.exports = invCont
