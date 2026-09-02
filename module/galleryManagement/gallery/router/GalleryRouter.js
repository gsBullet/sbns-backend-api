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
  updateGalleryImagesForFeatured,
  updateGalleryImageStatus,
  getAllGalleyCetogories,
  updateGalleryFeaturedStatus,
} = require("../controller/GalleryController");

router.get("/list", protect, getAllGalleyImages);

router.get("/:id", protect, getGalleryImageById);

router.post(
  "/create",
  protect,
  // restrictTo("admin"),
  // validateGalleryCreation,

  createGalleryImage,
);

router.post(
  "/update-image/:id",
  protect,
  // restrictTo("admin"),
  validateGalleryUpdate,
  updateGalleryImage,
);

router.delete(
  "/delete-image/:id",
  protect,
  //  restrictTo("admin"),
  deleteGalleryImage,
);

router.post("/featured/:id", protect, updateGalleryImagesForFeatured);

router.post("/update-image-gallery-status/:id", protect, updateGalleryImageStatus);
router.post("/update-feature-status/:id", protect, updateGalleryFeaturedStatus);

router.get(
  "/gallery-category/list",
  protect,
  // restrictTo("admin"),
  getAllGalleyCetogories,
);

module.exports = () => router;
