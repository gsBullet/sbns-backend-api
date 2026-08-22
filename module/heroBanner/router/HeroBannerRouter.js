const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  getHeroBannerList,
  getHeroBannerById,
  createHeroBanner,
  updateHeroBanner,
  updateHeroBannerStatus,
  deleteHeroBanner,
} = require("../controller/heroBannerController");

const { protect } = require("../../../middlewares/auth");

/* ─── Upload Directory ───────────────────────────────────────── */

const uploadDir = path.join(
  __dirname,
  "../../../uploads/hero-banners"
);

// Directory না থাকলে automatically তৈরি করবে
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ─── Multer Storage ─────────────────────────────────────────── */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, `banner-${uniqueSuffix}${extension}`);
  },
});

/* ─── File Filter ────────────────────────────────────────────── */

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only image files are allowed"
      )
    );
  }
};

/* ─── Multer Configuration ──────────────────────────────────── */

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
    fields: 50,
    parts: 100,
  },

  fileFilter,
});

/* ─── Routes ────────────────────────────────────────────────── */

// Get all banners
router.get("/list", protect, getHeroBannerList);

// Create banner
router.post(
  "/create",
  protect,
  upload.single("image"),
  createHeroBanner
);

// Update banner
router.post(
  "/update-hero-banner/:id",
  protect,
  upload.single("image"),
  updateHeroBanner
);

// Update status
router.patch(
  "/update-hero-banner-status/:id",
  protect,
  updateHeroBannerStatus
);

// Delete banner
router.delete(
  "/delete-hero-banner/:id",
  protect,
  deleteHeroBanner
);

// Get single banner
// এটি সবশেষে রাখা ভালো, কারণ /:id একটি dynamic route
router.get("/:id", protect, getHeroBannerById);

module.exports = () => router;