const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../../../middlewares/auth");
const {
  validateResponsibilityCreation,
  validateResponsibilityUpdate,
} = require("../../../middlewares/validators");
const {
  createResponsibility,
  getAllResponsibilities,
  getResponsibilityById,
  updateResponsibility,
  deleteResponsibility,
  allResponsibilities,
} = require("../controller/ResponsibilityController");

/* ─────────────────────────────────────────────────────────────
   PUBLIC ROUTES  (no auth required)
───────────────────────────────────────────────────────────── */

// GET /api/responsibilities → get all responsibilities
router.get("/get-responsibility-for-members", getAllResponsibilities);

// GET /api/responsibilities/:id → get responsibility by ID
router.get("/responsibility/:id", getResponsibilityById);

/* ─────────────────────────────────────────────────────────────
   PROTECTED ROUTES (auth required)
───────────────────────────────────────────────────────────── */

// POST /api/responsibilities → create new responsibility (admin only)
router.post(
  "/create-responsibility",
  protect,
  // restrictTo("admin"),
  validateResponsibilityCreation,
  createResponsibility,
);

// PUT /api/responsibilities/:id → update responsibility by ID (admin only)
router.put(
  "/update-responsibility/:id",
  protect,
  // restrictTo("admin"),
  validateResponsibilityUpdate,
  updateResponsibility,
);

// DELETE /api/responsibilities/:id → delete responsibility by ID (admin only)
router.get(
  "/delete-responsibility/:id",
  protect,
//   restrictTo("admin"),
  deleteResponsibility,
);

router.get("/all-responsibilities", protect, allResponsibilities);

module.exports = () => router;
