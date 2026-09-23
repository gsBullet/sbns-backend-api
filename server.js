
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const AppError = require("./middlewares/AppError");
const AllRouter = require("./module/All.Router");

/* =========================================================
   APP
========================================================= */

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const PORT = Number(process.env.PORT) || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:3000";

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   TRUST PROXY
========================================================= */

/*
  Production architecture:

  Internet
      ↓
    Nginx
      ↓
   Node.js

  If you have ONE trusted reverse proxy:
*/

if (isProduction) {
  app.set("trust proxy", 1);
}

/* =========================================================
   BASIC SECURITY
========================================================= */

/*
  Don't expose:
      X-Powered-By: Express
*/

app.disable("x-powered-by");

/* =========================================================
   HELMET
========================================================= */

app.use(
  helmet({
    /*
      We are disabling global CSP here because this API
      serves uploaded resources and your frontend may have
      its own CSP policy.

      If you later want a strict global CSP, configure it
      according to your frontend architecture.
    */
    contentSecurityPolicy: false,

    /*
      Protect normal pages/API responses from being framed.
    */
    frameguard: {
      action: "deny",
    },

    /*
      Prevent MIME sniffing.
    */
    noSniff: true,

    /*
      Referrer policy.
    */
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },

    /*
      HSTS should be enabled only when production is
      actually running through HTTPS.
    */
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,

    /*
      Uploaded resources may be requested from frontend.
    */
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* =========================================================
   CORS
========================================================= */

/*
  Example .env:

  CLIENT_URL=https://example.com

  Multiple frontend origins:

  CLIENT_URL=https://example.com,https://admin.example.com
*/

const allowedOrigins = CLIENT_URL
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
        Requests without Origin:

        - Postman
        - curl
        - server-to-server requests

        are allowed.
      */

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new AppError("এই origin থেকে access অনুমোদিত নয়।", 403)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    optionsSuccessStatus: 204,
  })
);

/* =========================================================
   BODY PARSERS
========================================================= */

/*
  Keep JSON payload reasonably small.

  File uploads should be handled by Multer separately.
*/

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/* =========================================================
   COOKIE
========================================================= */

app.use(cookieParser());

/* =========================================================
   RATE LIMITING
========================================================= */

/*
  General API limiter.

  300 requests / 15 minutes / IP.

  Adjust according to your real traffic.
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "অনেক বেশি অনুরোধ করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "অনেক বেশি অনুরোধ করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।",
    });
  },
});

/*
  Apply rate limiting to API only.
*/

app.use("/api", apiLimiter);

/* =========================================================
   AUTH RATE LIMITER
========================================================= */

/*
  Use this for sensitive authentication endpoints.

  Example:

  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/auth/forgot-password", authLimiter);
*/

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "অনেকবার চেষ্টা করা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।",
  },
});

/*
  IMPORTANT:

  Don't apply authLimiter globally.

  Add it to your actual auth routes.

  Example:

  app.use("/api/auth/login", authLimiter);
*/

/* =========================================================
   STATIC UPLOADS
========================================================= */

const uploadsPath = path.join(process.cwd(), "uploads");

/*
  IMPORTANT:

  /uploads is registered ONLY ONCE.

  No directory listing.
  Hidden files are denied.
*/

app.use(
  "/uploads",
  express.static(uploadsPath, {
    dotfiles: "deny",

    index: false,

    redirect: false,

    /*
      Browser caching.
    */

    maxAge: isProduction ? "1h" : 0,

    setHeaders: (res, filePath) => {
      /*
        Prevent MIME sniffing.
      */

      res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
      );

      /*
        Allow frontend to load images/files.
      */

      res.setHeader(
        "Cross-Origin-Resource-Policy",
        "cross-origin"
      );

      /*
        PDF configuration.
      */

      if (filePath.toLowerCase().endsWith(".pdf")) {
        res.setHeader(
          "Content-Type",
          "application/pdf"
        );

        /*
          Open PDF inside browser instead of downloading.
        */

        res.setHeader(
          "Content-Disposition",
          "inline"
        );

        res.setHeader(
          "Cache-Control",
          "public, max-age=3600"
        );

        /*
          IMPORTANT:

          Do NOT use:

              X-Frame-Options: ALLOWALL

          because ALLOWALL is not a valid secure
          X-Frame-Options value.

          Instead use CSP frame-ancestors if you
          specifically need iframe embedding.
        */

        res.setHeader(
          "Content-Security-Policy",
          `frame-ancestors 'self' ${allowedOrigins.join(" ")}`
        );
      }
    },
  })
);

/* =========================================================
   LOGGER
========================================================= */

if (!isProduction) {
  app.use(morgan("dev"));
}

/* =========================================================
   JSON RESPONSE FORMAT
========================================================= */

app.set(
  "json spaces",
  isProduction ? 0 : 2
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running 🚀",

    /*
      Don't expose NODE_ENV in production.
    */

    ...(isProduction
      ? {}
      : {
          env: process.env.NODE_ENV,
        }),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api", AllRouter());

/* =========================================================
   404
========================================================= */

app.use((req, res, next) => {
  next(
    new AppError(
      `রুটটি পাওয়া যায়নি: ${req.method} ${req.originalUrl}`,
      404
    )
  );
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(errorHandler);

/* =========================================================
   START SERVER
========================================================= */

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

/* =========================================================
   UNHANDLED PROMISE REJECTION
========================================================= */

process.on("unhandledRejection", (err) => {
  console.error(
    "UNHANDLED REJECTION 💥",
    err.name,
    err.message
  );

  server.close(() => {
    process.exit(1);
  });
});

/* =========================================================
   UNCAUGHT EXCEPTION
========================================================= */

process.on("uncaughtException", (err) => {
  console.error(
    "UNCAUGHT EXCEPTION 💥",
    err.name,
    err.message
  );

  server.close(() => {
    process.exit(1);
  });
});

/* =========================================================
   GRACEFUL SHUTDOWN
========================================================= */

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    console.log("HTTP server closed.");

    process.exit(0);
  });
};

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

/* =========================================================
   EXPORT
========================================================= */

module.exports = app;

