const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  getAllBlogsCategoryForBlog,
  updateBlogStatus,
  isPublishedBlog,
  uploadThumbnailByCoverImage,
  updatePublishDraftStatus,
  updateBlogFeaturedStatus,
} = require("../controller/BlogController");

const { protect } = require("../../../../middlewares/auth");

const uploadDir = path.join(__dirname, "../../../../uploads/blog-thumbnails");

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

  // Plain Error (not MulterError) so our custom message actually reaches
  // the client — MulterError's 2nd arg is the *field name*, not a message.
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

/* ─── Wrap upload middleware to catch multer errors cleanly ───── */
// Without this, a rejected file or exceeded limit falls through to
// Express's default error handler (ugly stack trace / generic 500).

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
      // Errors thrown from fileFilter land here
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// CRUD
router.post(
  "/upload-thumbnail-for-cover",
  protect,
  handleUpload(upload.single("thumbnail")),
  uploadThumbnailByCoverImage,
);
router.post("/create", protect, createBlog);
router.get("/blog-list", protect, getAllBlogs);
router.get("/:idOrSlug", protect, getBlogByIdOrSlug);
router.post("/update-blog/:id", protect, updateBlog);
router.delete("/delete-blog/:id", protect, deleteBlog);
router.post("/update-blog-status/:id", protect, updateBlogStatus);
router.get("/blog-is-published/:id", protect, isPublishedBlog);

// blog category for blog management
router.get("/blog-category/list", protect, getAllBlogsCategoryForBlog);

// blog publish draft
router.get("/publish-draft-status/:id", protect, updatePublishDraftStatus);
router.post("/update-blog-featured/:id", protect, updateBlogFeaturedStatus);

module.exports = () => router;
