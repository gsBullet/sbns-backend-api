const express = require("express");
const router = express.Router();

const FrontViewController = require("./FrontViewController");

router.get("/hero-banner-list",  FrontViewController.heroBannerList);
router.get("/our-hero-list",  FrontViewController.ourHeroList);
router.get("/image-gallery-list", FrontViewController.imageGalleryList);
router.get("/video-gallery-list", FrontViewController.videoGalleryList);
router.get("/image-gallery-list-for-page", FrontViewController.imageGalleryListPage);
router.get("/video-gallery-list-for-page", FrontViewController.videoGalleryListPage);

router.get("/blog-list", FrontViewController.blogList);
router.get("/blog-list-for-page", FrontViewController.blogListPage);
router.get("/blog-for-read/:id", FrontViewController.blogForRead);
router.get("/blog-categories-for-front-view", FrontViewController.blogCategoriesForFrontView);
router.get("/category-wise-blog-list-for-page", FrontViewController.categoryWiseBlogListPage);


module.exports =()=> router