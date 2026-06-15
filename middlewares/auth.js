const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
const { asyncHandler } = require("./asyncHandler");

// Import your User model — adjust path as needed
// const User = require("../models/User");

/* ─── protect ───────────────────────────────────────────────── */
// Verifies JWT from Authorization header or cookie
exports.protect = asyncHandler(async (req, res, next) => {
  // console.log(`req`, req);
  let token;

  // 1) Read token from header or cookie
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token)
    throw new AppError("আপনি লগইন করেননি। অনুগ্রহ করে লগইন করুন।", 401);

  // 2) Verify token
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`decode`, decoded);
  } catch {
    throw new AppError("টোকেন অবৈধ বা মেয়াদ শেষ হয়েছে। আবার লগইন করুন।", 401);
  }

  req.user = {
    _id: decoded._id,
    username: decoded.username || "ব্যবহারকারী",
    phone: decoded.phone || "",
    userRole: decoded.userRole || "user",
  };

  next();
});

/* ─── restrictTo ─────────────────────────────────────────────── */
// Usage: restrictTo("admin")  or  restrictTo("admin", "moderator")
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("আপনার এই কাজ করার অনুমতি নেই", 403));
    }
    next();
  };
