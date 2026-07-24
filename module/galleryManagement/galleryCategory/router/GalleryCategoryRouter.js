const express = require("express");

const router = express.Router();

const {
  createGalleryCategory,
  getAllGalleryCategories,
  updateGalleryCategory,
  deleteGalleryCategory,
  updateGalleryCategoryStatus,
} = require("../controller/GalleryCategoryController");

const { protect } = require("../../../../middlewares/auth");

router.post("/create", protect, createGalleryCategory);
router.get("/list", protect, getAllGalleryCategories);
router.put("/update-category/:id", protect, updateGalleryCategory);
router.delete("delete-category/:id", protect, deleteGalleryCategory);
router.post(
  "/update-category-status/:id",
  protect,
  updateGalleryCategoryStatus,
);

module.exports = () => router;
