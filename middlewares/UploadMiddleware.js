const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const fileFilter = (req, file, cb) => {
  if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  // Drain the rejected file's stream so the request doesn't hang/abort
  file.stream?.resume?.();
  cb(new multer.MulterError(
    "LIMIT_UNEXPECTED_FILE",
    `Only image files (jpeg, png, webp, gif, svg) are allowed. Got: ${file.mimetype}`
  ));
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

const uploadThumbnail = multer({
  storage: makeStorage("thumbnails"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadBlogContentImage = multer({
  storage: makeStorage("blogs"),
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

module.exports = { uploadThumbnail, uploadBlogContentImage };