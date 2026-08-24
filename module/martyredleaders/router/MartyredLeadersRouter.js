const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getOurAllHeroes,
  createOurHero,
  updateOurHeros,
  updateOurHerosStatus,
  deleteOurHero
} = require('../controller/MartyredLeadersController');
const { protect } = require('../../../middlewares/auth');


const uploadDir = path.join(
  __dirname,
  "../../../uploads/our-hero"
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

    cb(null, `heros-${uniqueSuffix}${extension}`);
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




router.get('/list', protect, getOurAllHeroes);
router.post('/create-our-hero', protect, upload.single("image"), createOurHero);
router.post('/update-our-hero/:id', protect, upload.single("image"), updateOurHeros);
router.put('/update-our-hero-status/:id', protect, updateOurHerosStatus);
router.delete('/delete/:id', protect, deleteOurHero);

module.exports = () => router;