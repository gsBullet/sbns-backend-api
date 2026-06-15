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
router.get("/", getAllResponsibilities);

// GET /api/responsibilities/:id → get responsibility by ID
router.get("/:id", getResponsibilityById);

/* ─────────────────────────────────────────────────────────────
   PROTECTED ROUTES (auth required)
───────────────────────────────────────────────────────────── */

// POST /api/responsibilities → create new responsibility (admin only)
router.post(
    "/",
    protect,
    restrictTo("admin"),
    validateResponsibilityCreation,
    createResponsibility,
);

// PUT /api/responsibilities/:id → update responsibility by ID (admin only)
router.put(
    "/:id",
    protect,
    restrictTo("admin"),
    validateResponsibilityUpdate,
    updateResponsibility,
);

// DELETE /api/responsibilities/:id → delete responsibility by ID (admin only)
router.delete("/:id", protect, restrictTo("admin"), deleteResponsibility);



router.get("/all-responsibilities", protect, allResponsibilities);

module.exports = () => router;