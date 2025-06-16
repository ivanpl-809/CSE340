const { body, validationResult } = require("express-validator")
const utilities = require(".") // Adjust path if necessary

const invValidate = {}

/* ***************************
 *  Inventory Data Validation Rules
 * *************************** */
invValidate.newInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid integer."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a number."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be a whole number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("classification_id")
      .trim()
      .isInt()
      .withMessage("Classification is required.")
  ]
}

/* ******************************
 * Check new inventory data and return errors or continue
 * ***************************** */
invValidate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
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
    return
  }
  next()
}

/* ******************************
 * Check update inventory data and return errors or continue
 * (Redirects to EDIT view instead of ADD)
 * ***************************** */
invValidate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationList,
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
    return
  }
  next()
}

module.exports = invValidate
