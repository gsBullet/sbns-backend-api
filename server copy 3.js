const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./middlewares/AppError");
const AllRouter = require("./module/All.Router");

/* ─── Connect DB ─────────────────────────────────────────────── */
connectDB();

/* ─── Security ───────────────────────────────────────────────── */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ 3. Serve uploads with inline disposition + explicit headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Frame-Options", "ALLOWALL"); // or remove entirely
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline"); // 🔑 forces in-browser view
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  }),
);



/* ─── Rate limiting ──────────────────────────────────────────── */
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: {
      success: false,
      message: "অনেক বেশি অনুরোধ। কিছুক্ষণ পরে চেষ্টা করুন।",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ─── General ────────────────────────────────────────────────── */
app.use(cookieParser());
app.set("json spaces", 4);

// ONE json parser, ONE urlencoded parser — both skip multipart automatically.
// Multer handles multipart exclusively, per-route. ✅
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

/* ─── Static files ───────────────────────────────────────────── */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ─── Logger ─────────────────────────────────────────────────── */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ─── Health check ───────────────────────────────────────────── */
app.get("/api/health", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
    env: process.env.NODE_ENV,
  })
);

/* ─── Routes ─────────────────────────────────────────────────── */
app.use("/api", AllRouter());

/* ─── 404 ────────────────────────────────────────────────────── */
app.all("*", (req, res, next) => {
  next(new AppError(`রুটটি পাওয়া যায়নি: ${req.method} ${req.originalUrl}`, 404));
});

/* ─── Error handler ──────────────────────────────────────────── */
app.use(errorHandler);

/* ─── Start ──────────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err.name, err.message);
  server.close(() => process.exit(1));
});

module.exports = app;