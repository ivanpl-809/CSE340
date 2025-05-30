const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get('/detail/:inv_id', inventoryController.buildVehicleDetail);


module.exports = router;