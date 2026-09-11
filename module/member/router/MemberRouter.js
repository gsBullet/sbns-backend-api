const express = require("express");
const router = express.Router();
const memberController = require("../controller/MemberController");
const {
  validateMemberCreation,
  validateMemberUpdate,
} = require("../../../middlewares/validators");
// let upload = require("../../../middlewares/updloadHandler");
const { protect } = require("../../../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../../../uploads/members");

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

    cb(null, `members-${uniqueSuffix}${extension}`);
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

// Create a new member
router.post(
  "/create-member",
  protect,
  handleUpload(upload.single("image")),
  memberController.createMember,
);

// Get all members
router.get("/get-all-members", protect, memberController.getAllMembers);

// Get a single member by ID
router.get("/get-member/:id",protect, memberController.getMemberById);

// Update a member by ID
router.post(
  "/update-member/:id",
  protect,
  handleUpload(upload.single("image")),
  memberController.updateMember,
);

router.put(
  "/update-member-status/:id",
  protect,
  memberController.updateMemberStatus,
);

// Delete a member by ID
router.delete("/delete-member/:id", protect, memberController.deleteMember);

module.exports = () => router;
