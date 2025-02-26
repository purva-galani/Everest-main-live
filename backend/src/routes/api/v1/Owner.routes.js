const express = require("express");
const OwnerController = require("../../../controller/Owner.controller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/addOwner', upload.single('logo'), OwnerController.addOwner);
router.get("/getAllOwners", OwnerController.getOwners);
router.get("/getOwner/:id", OwnerController.getOwnerById);
router.put("/updateOwner/:id", OwnerController.updateOwner);
router.delete("/deleteOwner/:id", OwnerController.deleteOwner);
router.get("/count", OwnerController.getOwnerCount);  
router.get("/getOwnerForInvoice", OwnerController.getOwnerForInvoice);

module.exports = router;
