const express = require("express");
const router = express.Router();

const FrontViewController = require("./FrontViewController");

router.get("/hero-banner-list",  FrontViewController.heroBannerList);
router.get("/our-hero-list",  FrontViewController.ourHeroList);
router.get("/image-gallery-list", FrontViewController.imageGalleryList);
router.get("/video-gallery-list", FrontViewController.videoGalleryList);
router.get("/image-gallery-list-for-page", FrontViewController.imageGalleryListPage);
router.get("/video-gallery-list-for-page", FrontViewController.videoGalleryListPage);


// router.post("/update-website/:id", protect, FrontViewController.updateWebsite);
// router.delete("/delete-website/:id", protect, FrontViewController.deleteWebsite);
// router.post(
//     "/update-website-status/:id",
//     protect,
//     FrontViewController.updateWebsiteStatus,
// );

module.exports =()=> router