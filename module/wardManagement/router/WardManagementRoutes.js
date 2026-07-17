const express = require("express");
const router = express.Router();
const WardManagementController = require("../controller/WardManagementController");
const {
  validateWardManagement,
  validateWardManagementUpdate,
} = require("../../../middlewares/validators");
const { protect } = require("../../../middlewares/auth");
router.post(
  "/create",
  protect,
  validateWardManagement,
  WardManagementController.createWardManagement,
);
router.get("/list", WardManagementController.getAllWardManagement);
router.get("/getById/:id", WardManagementController.getWardManagementById);
router.post(
  "/update/:id",
  protect,
  validateWardManagementUpdate,
  WardManagementController.updateWardManagement,
);
router.post(
  "/update-status/:id",
  protect,
  WardManagementController.updateWardManagementStatus,
);
router.delete(
  "/delete/:id",
  protect,
  WardManagementController.deleteWardManagement,
);

module.exports = () => router;
