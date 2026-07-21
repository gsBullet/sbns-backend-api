const express = require("express");
const router = express.Router();
const UnitManagementController = require("../controller/UnitManagementController");

const { protect } = require("../../../middlewares/auth");
router.post(
  "/create",
  protect,
  UnitManagementController.createUnitManagement,
);
router.get("/list", UnitManagementController.getAllUnitManagement);
router.get("/getById/:id", UnitManagementController.getUnitManagementById);
router.post(
  "/update-Unit-management/:id",
  protect,
  UnitManagementController.updateUnitManagement,
);
router.post(
  "/update-Unit-status/:id",
  protect,
  UnitManagementController.updateUnitManagementStatus,
);
router.delete(
  "/delete-Unit-management/:id",
  protect,
  UnitManagementController.deleteUnitManagement,
);

module.exports = () => router;
