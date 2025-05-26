const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get('/detail/:inv_id', inventoryController.buildVehicleDetail);


module.exports = router;