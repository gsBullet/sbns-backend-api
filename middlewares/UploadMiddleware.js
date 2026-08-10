const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

const fileFilter = (req, file, cb) => {
  if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, webp, gif, svg) are allowed"), false);
  }
};

const makeStorage = (subfolder) => {
  const dir = path.join(__dirname, "..", "uploads", subfolder);
  ensureDir(dir);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${ext}`);
    },
  });
};

// For the blog thumbnail (used on create/update blog)
const uploadThumbnail = multer({
  storage: makeStorage("thumbnails"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// For EditorJS inline content images (image tool uploader.uploadByFile)
const uploadBlogContentImage = multer({
  storage: makeStorage("blogs"),
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = { uploadThumbnail, uploadBlogContentImage };