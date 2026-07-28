const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const VideoCategoryController = require("../controller/VideoCategoryController");
const { protect } = require("../../../../middlewares/auth");

router.get("/list", protect, VideoCategoryController.getAllVideoCategories);
router.post("/create", protect, VideoCategoryController.createVideoCategory);
router.put(
  "/update-video-category/:id",
  protect,
  VideoCategoryController.updateVideoCategory,
);
router.delete("/:id", protect, VideoCategoryController.deleteVideoCategory);
router.post(
  "/update-video-category-status/:id",
  protect,
  VideoCategoryController.updateVideoCategoryStatus,
);

module.exports = () => router;
