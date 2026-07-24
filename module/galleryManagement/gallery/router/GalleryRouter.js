const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../../../../middlewares/auth");
const {
  validateGalleryCreation,
  validateGalleryUpdate,
} = require("../../../../middlewares/validators");
const {
  createGallery,
  getAllGalleries,
  getAllGalleriesForFeatured,
  getGalleryById,
  updateGallery,
  deleteGallery,
} = require("../controller/GalleryController");

/* ─────────────────────────────────────────────────────────────
   PUBLIC ROUTES  (no auth required)
───────────────────────────────────────────────────────────── */

// // GET /api/galleries → get all galleries
router.get("/", getAllGalleries);

// GET /api/galleries/:id → get gallery by ID
router.get("/:id", getGalleryById);

/* ─────────────────────────────────────────────────────────────
   PROTECTED ROUTES (auth required)
───────────────────────────────────────────────────────────── */



// POST /api/galleries → create new gallery (admin only)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validateGalleryCreation,
  createGallery,
);

// PUT /api/galleries/:id → update gallery by ID (admin only)
router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  validateGalleryUpdate,
  updateGallery,
);

// DELETE /api/galleries/:id → delete gallery by ID (admin only)
router.delete("/:id", protect, restrictTo("admin"), deleteGallery);

// GET /api/galleries/featured → get featured galleries
router.get("/featured",protect, getAllGalleriesForFeatured);

module.exports = () => router;