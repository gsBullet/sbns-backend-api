const express = require("express");
const router = express.Router();
const { protect } = require("../../../middlewares/auth");
const { unitValidator } = require("../../../middlewares/validators");
const UnitController = require("../controller/UnitController");

router.post("/create-unit", protect, 
    unitValidator,
    UnitController.createUnit);
router.get("/get-all-units/list", protect, UnitController.getUnits);
router.get("/get-unit-by-id/:id", protect, UnitController.getUnitById);
router.post("/update-unit/:id", protect, UnitController.updateUnit);
router.delete("/delete-unit/:id", protect, UnitController.deleteUnit);
router.post(
  "/update-unit-status/:id",
  protect,
  UnitController.updateUnitStatus,
);

module.exports = () => router;