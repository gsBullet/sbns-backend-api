const jwt      = require("jsonwebtoken");
const AppError = require("./AppError");
const { asyncHandler } = require("./asyncHandler");

// Import your User model — adjust path as needed
// const User = require("../models/User");

/* ─── protect ───────────────────────────────────────────────── */
// Verifies JWT from Authorization header or cookie
exports.protect = asyncHandler(async (req, res, next) => {
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
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("টোকেন অবৈধ বা মেয়াদ শেষ হয়েছে। আবার লগইন করুন।", 401);
  }

  // 3) Check user still exists  ← uncomment after adding User model
  // const user = await User.findById(decoded.id).select("-password");
  // if (!user) throw new AppError("এই ব্যবহারকারী আর বিদ্যমান নেই", 401);

  // Temporary: attach decoded payload directly
  // Replace with `req.user = user` after wiring User model
  req.user = {
    _id:    decoded.id,
    name:   decoded.name   || "ব্যবহারকারী",
    email:  decoded.email  || "",
    role:   decoded.role   || "user",
    avatar: decoded.avatar || "👤",
  };

  next();
});

/* ─── restrictTo ─────────────────────────────────────────────── */
// Usage: restrictTo("admin")  or  restrictTo("admin", "moderator")
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("আপনার এই কাজ করার অনুমতি নেই", 403));
  }
  next();
};