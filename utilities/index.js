const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/inv" title="Inventory Management">Inventory Management</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

/* **************************************
* Build the vehicle detail HTML
* ************************************ */
Util.buildVehicleDetailHTML = function (vehicle) {
  let detailHTML = '<div class="vehicle-detail">'

  detailHTML += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" class="vehicle-detail-img"/>`

  detailHTML += '<div class="vehicle-info">'
  detailHTML += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`

  detailHTML += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detailHTML += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`
  detailHTML += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
  detailHTML += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`

   detailHTML += `
    <div class="vehicle-actions">
      <a href="/appointments/schedule/${vehicle.inv_id}" class="button">Schedule Test Drive</a>
    </div>
  `
  detailHTML += '</div>'
  detailHTML += '</div>'

  return detailHTML
};


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    res.locals.loggedin = false
    res.locals.accountData = null
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      req.flash("notice", "Please log in.")
      res.clearCookie("jwt")
      res.locals.loggedin = false
      res.locals.accountData = null
      return res.redirect("/account/login")
    }

    res.locals.loggedin = true
    res.locals.accountData = accountData
    next()
  })
}

/* ****************************************
* Middleware to restrict access to certain account types
**************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData

  if (!accountData) {
    req.flash("notice", "You must be logged in to access this page.")
    return res.redirect("/account/login")
  }

  const allowedTypes = ["Admin", "Employee"]
  if (!allowedTypes.includes(accountData.account_type)) {
    req.flash("notice", "You do not have permission to access this page.")
    return res.redirect("/account/login")
  }

  next()
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util
