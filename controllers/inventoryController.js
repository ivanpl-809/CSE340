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


invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    messages: req.flash("notice")
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: req.flash("notice"),
  })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  if (!/^[A-Za-z0-9]+$/.test(classification_name)) {
    req.flash("notice", "Invalid classification name.")
    res.status(400).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("notice")
    })
    return
  }

  const result = await invModel.addClassification(classification_name)

  if (result) {
    const nav = await utilities.getNav()
    req.flash("notice", "Classification successfully added.")
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("notice")
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages: req.flash("notice")
    })
  }
}

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    messages: req.flash("notice"),
    ...req.body, // Sticky fields
  })
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  } = req.body

  if (
    !classification_id || !inv_make || !inv_model || !inv_year ||
    !inv_description || !inv_image || !inv_thumbnail ||
    !inv_price || !inv_miles || !inv_color
  ) {
    req.flash("notice", "All fields are required.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.status(400).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: req.flash("notice"),
      ...req.body
    })
  }

  const result = await invModel.addInventoryItem({
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  })

  if (result) {
    req.flash("notice", "Inventory item added.")
    res.status(201).redirect("/inv")
  } else {
    req.flash("notice", "Failed to add item.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      messages: req.flash("notice"),
      ...req.body
    })
  }
}


  module.exports = invCont
