const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../../../middlewares/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../../../middlewares/validators");
const {
  registerUser,
  loginUser,
  getMe,
  updateMyProfile,
} = require("../controller/UserController");

/* ─────────────────────────────────────────────────────────────
   PUBLIC ROUTES  (no auth required)
───────────────────────────────────────────────────────────── */


// POST /api/users/login    → login user and return JWT
router.post("/login", validateUserLogin, loginUser);


// POST /api/users/register → register new user
router.post("/register",protect, validateUserRegistration, registerUser);

// GET  /api/users/me       → get logged-in user's profile

router.get("/me", protect, getMe);

// PUT  /api/users/me       → update logged-in user's profile
router.put("/update", protect, updateMyProfile);

module.exports =()=> router;