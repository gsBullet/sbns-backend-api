const express = require("express");
const router = express.Router();

const FrontViewController = require("./FrontViewController");

router.get("/hero-banner-list",  FrontViewController.heroBannerList);
// router.get("/get-website-by-id/:id", protect, FrontViewController.getWebsiteById);
// router.post("/update-website/:id", protect, FrontViewController.updateWebsite);
// router.delete("/delete-website/:id", protect, FrontViewController.deleteWebsite);
// router.post(
//     "/update-website-status/:id",
//     protect,
//     FrontViewController.updateWebsiteStatus,
// );

module.exports =()=> router