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
    const vehicleData = await invModel.getInventoryById(inv_id)
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
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
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
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
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

  const result = await invModel.addInventoryItem(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
)

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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Deliver Delete Confirmation View
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  const name = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/delete-confirm", {
    title: `Delete ${name}`,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult.rowCount > 0) {
    req.flash("notice", "The item was successfully deleted.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

  module.exports = invCont
