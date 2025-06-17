const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    message: null, 
    errors: null
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you’re registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("message"), 
    accountData
  })
}

async function logout (req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/")
}

async function buildUpdateAccount (req, res){
  const nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = res.locals.accountData

  if (parseInt(account_id) !== accountData.account_id) {
    req.flash("notice", "Unauthorized access.")
    return res.redirect("/account")
  }

  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData
  })
}

async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
  } else {
    req.flash("notice", "Update failed. Please try again.")
  }

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("notice"),
    accountData
  })
}

async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      message: req.flash("notice"),
      accountData
    })
  } catch (error) {
    req.flash("notice", "An error occurred.")
    res.redirect(`/account/update/${account_id}`)
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  logout,
  buildUpdateAccount,
  updateAccount,
  updatePassword
}