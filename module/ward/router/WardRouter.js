const express = require("express");
const router = express.Router();
const WardController = require("../controller/WardController");
const { protect } = require("../../../middlewares/auth");

router.post("/create", protect, WardController.createWard);
router.get("/list", protect, WardController.getWards);
router.get("/:id", protect, WardController.getWardById);
router.post("/update-ward/:id", protect, WardController.updateWard);
router.delete("/delete-ward/:id", protect, WardController.deleteWard);
router.post("/update-ward-status/:id", protect, WardController.updateWardStatus);

module.exports = () => router;
