const throwError = (req, res, next) => {
  try {
    throw new Error("This is a simulated 500 error.")
  } catch (err) {
    next(err)
  }
}

module.exports = { throwError }
