const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../../../../middlewares/auth");
const {
  validateGalleryCreation,
  validateGalleryUpdate,
} = require("../../../../middlewares/validators");
const {
  createGalleryImage,
  getAllGalleyImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryImagesForFeatured,
  updateGalleryImageStatus,
} = require("../controller/GalleryController");

router.get("/list", protect, getAllGalleyImages);

router.get("/:id", protect, getGalleryImageById);

router.post(
  "/create",
  protect,
  // restrictTo("admin"),
  validateGalleryCreation,
  createGalleryImage,
);

router.post(
  "/:id",
  protect,
  // restrictTo("admin"),
  validateGalleryUpdate,
  updateGalleryImage,
);

router.delete(
  "/delete-gallery/:id",
  protect,
  //  restrictTo("admin"),
  deleteGalleryImage,
);

router.post("/featured/:id", protect, getGalleryImagesForFeatured);

router.post("/update-gallery-status/:id", protect, updateGalleryImageStatus);

module.exports = () => router;
