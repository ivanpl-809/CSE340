const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get('/detail/:inv_id', inventoryController.buildVehicleDetail);
router.get("/inv", inventoryController.buildManagementView)
router.get("/add-classification", inventoryController.buildAddClassification)
router.post("/add-classification", inventoryController.addClassification)
router.get("/add-inventory", inventoryController.buildAddInventory)
router.post("/add-inventory", inventoryController.addInventory)



module.exports = router;