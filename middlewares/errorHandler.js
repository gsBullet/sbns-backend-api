const AppError = require("./AppError");

/* ─── Handle specific Mongoose / JWT errors ──────────────────── */
const handleCastError        = (err) => new AppError(`অবৈধ আইডি: ${err.value}`, 400);
const handleDuplicateFields  = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`'${err.keyValue[field]}' ইতিমধ্যে ব্যবহৃত হয়েছে`, 400);
};
const handleValidationError  = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join(", "), 400);
};
const handleJWTError         = () => new AppError("টোকেন অবৈধ। আবার লগইন করুন।", 401);
const handleJWTExpiredError  = () => new AppError("টোকেনের মেয়াদ শেষ। আবার লগইন করুন।", 401);

/* ─── Dev vs Prod response ───────────────────────────────────── */
const sendDevError = (err, res) =>
  res.status(err.statusCode).json({
    success: false,
    status:  err.status,
    message: err.message,
    stack:   err.stack,
    error:   err,
  });

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.error("CRITICAL ERROR 💥", err);
  res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।" });
};

/* ─── Global error handler ───────────────────────────────────── */
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || "error";

  if (process.env.NODE_ENV === "development") {
    return sendDevError(err, res);
  }

  // Transform known Mongoose / JWT errors into AppErrors
  let error = { ...err, message: err.message };
  if (err.name === "CastError")             error = handleCastError(err);
  if (err.code  === 11000)                  error = handleDuplicateFields(err);
  if (err.name === "ValidationError")       error = handleValidationError(err);
  if (err.name === "JsonWebTokenError")     error = handleJWTError();
  if (err.name === "TokenExpiredError")     error = handleJWTExpiredError();

  sendProdError(error, res);
};