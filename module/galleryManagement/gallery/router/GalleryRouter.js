const express = require("express");
const router = express.Router();
const { protect } = require("../../../../middlewares/auth");

const {
  createGalleryImage,
  getAllGalleyImages,
  getGalleryImageById,
  updateGalleryImage,
  deleteGalleryImage,
  updateGalleryImageStatus,
  getAllGalleyCetogories,
  updateGalleryFeaturedStatus,
} = require("../controller/GalleryController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../../../../uploads/gallery");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ─── Multer Storage ─────────────────────────────────────────── */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `thumbnail-${uniqueSuffix}${extension}`);
  },
});

/* ─── File Filter ────────────────────────────────────────────── */

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXT.has(ext)) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
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

const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      let message = "File upload error";
      if (err.code === "LIMIT_FILE_SIZE")
        message = "Image must be 5MB or smaller";
      else if (err.code === "LIMIT_FILE_COUNT")
        message = "Only one image is allowed";
      else if (err.code === "LIMIT_UNEXPECTED_FILE")
        message = "Unexpected file field";
      return res.status(400).json({ success: false, message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.get("/list", protect, getAllGalleyImages);

router.get("/:id", protect, getGalleryImageById);

router.post(
  "/create",
  protect,
  handleUpload(upload.single("image")),
  createGalleryImage,
);

router.post(
  "/update-image/:id",
  protect,
  handleUpload(upload.single("image")),
  updateGalleryImage,
);

router.delete("/delete-image/:id", protect, deleteGalleryImage);

router.post(
  "/update-image-gallery-status/:id",
  protect,
  updateGalleryImageStatus,
);
router.post("/update-feature-status/:id", protect, updateGalleryFeaturedStatus);

router.get("/gallery-category/list", protect, getAllGalleyCetogories);

module.exports = () => router;
