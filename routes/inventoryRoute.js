const express = require("express")
const router = new express.Router()
const inventoryController = require("../controllers/inventoryController")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get('/detail/:inv_id', inventoryController.buildVehicleDetail);
router.get("/", inventoryController.buildManagementView)
router.get("/add-classification", inventoryController.buildAddClassification)
router.post("/add-classification", inventoryController.addClassification)
router.get("/add-inventory", inventoryController.buildAddInventory)
router.post("/add-inventory", inventoryController.addInventory)
router.post("/update", invValidate.newInventoryRules(), invValidate.checkUpdateData, inventoryController.updateInventory)
router.get("/getInventory/:classification_id", inventoryController.getInventoryJSON)
router.get("/edit/:inv_id", inventoryController.editInventoryView)


module.exports = router;