const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./middlewares/AppError");
const AllRouter = require("./module/All.Router");

/* ─── Connect DB ─────────────────────────────────────────────── */
connectDB();

const app = express();

/* ─── Security middlewares ───────────────────────────────────── */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Rate limiting — 100 requests per 15 min per IP
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "অনেক বেশি অনুরোধ। কিছুক্ষণ পরে চেষ্টা করুন।",
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

/* ─── General middlewares ────────────────────────────────────── */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ─── Health check ───────────────────────────────────────────── */
app.get("/api/health", (req, res) =>
  res
    .status(200)
    .json({
      success: true,
      message: "Server is running 🚀",
      env: process.env.NODE_ENV,
    }),
);

/* ─── API Routes ─────────────────────────────────────────────── */
app.use("/api", AllRouter());
// app.use("/api/auth",  authRoutes);   // add later
// app.use("/api/users", userRoutes);   // add later

/* ─── 404 handler ────────────────────────────────────────────── */
app.all("*", (req, res, next) => {
  next(
    new AppError(`রুটটি পাওয়া যায়নি: ${req.method} ${req.originalUrl}`, 404),
  );
});

/* ─── Global error handler ───────────────────────────────────── */
app.use(errorHandler);

/* ─── Start server ───────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

// Unhandled rejections (e.g. DB crash mid-run)
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err.name, err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
