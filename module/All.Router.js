
const express = require("express");
const router = express.Router();
const UserRouter = require("./user/router/User.Router");
const GalleryRouter = require("./gallery/router/GalleryRouter");
const ResponsibilityRouter = require("./reponsibility/router/ResponsibilityRouter");

router.use("/user", UserRouter());
router.use("/gallery", GalleryRouter());
router.use("/responsibility", ResponsibilityRouter());

module.exports = () => router;
