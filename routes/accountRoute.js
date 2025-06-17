const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Route for delivering login view
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.get("/", utilities.checkLogin, async (req, res, next) => {
  try {
    await accountController.buildManagement(req, res, next)
  } catch (err) {
    next(err)
  }
})

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
)

router.get("/logout", accountController.logout)

router.get("/update/:account_id", utilities.checkJWTToken, accountController.buildUpdateAccount)

router.post(
  "/update",
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  accountController.updateAccount)

  router.post(
  "/update-password",
  utilities.checkJWTToken,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  accountController.updatePassword
)

module.exports = router
