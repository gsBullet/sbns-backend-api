
const express = require("express");
const router = express.Router();
const UserRouter = require("./user/router/User.Router");
const GalleryRouter = require("./gallery/router/GalleryRouter");
const ResponsibilityRouter = require("./reponsibility/router/ResponsibilityRouter");
const MemberRouter = require("./member/router/MemberRouter");
const WardRouter = require("./ward/router/WardRouter");
const WardManagementRouter = require("./wardManagement/router/WardManagementRouter");
const UnitRouter = require("./unit/Router/UnitRouter");

router.use("/user", UserRouter());
router.use("/gallery", GalleryRouter());
router.use("/responsibility", ResponsibilityRouter());
router.use("/members", MemberRouter());
router.use("/wards", WardRouter());
router.use("/ward-management", WardManagementRouter());
router.use("/units", UnitRouter());

module.exports = () => router;

