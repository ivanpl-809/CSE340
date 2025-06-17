const express = require("express")
const router = new express.Router()
const inventoryController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get('/detail/:inv_id', inventoryController.buildVehicleDetail);
router.get("/", inventoryController.buildManagementView)
router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.buildAddClassification)
router.post("/add-classification", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.addClassification)
router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.buildAddInventory)
router.post("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.addInventory)
router.post("/update", utilities.checkJWTToken, utilities.checkAccountType,invValidate.newInventoryRules(), invValidate.checkUpdateData, inventoryController.updateInventory)
router.get("/getInventory/:classification_id", inventoryController.getInventoryJSON)
router.get("/edit/:inv_id", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.editInventoryView)
router.get("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.buildDeleteView)
router.post("/delete", utilities.checkJWTToken, utilities.checkAccountType,inventoryController.deleteInventoryItem)


module.exports = router;