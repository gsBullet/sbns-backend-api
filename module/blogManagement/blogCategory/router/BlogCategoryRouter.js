const express = require("express");
const router = express.Router();
const BlogCategoryController = require("../controller/BlogCategoryController");
const { protect } = require("../../../../middlewares/auth");

router.post("/create", protect, BlogCategoryController.createBlogCategory);
router.get("/list", protect, BlogCategoryController.getAllBlogCategories);
router.post(
  "/update-blog-category/:id",
  protect,
  BlogCategoryController.updateBlogCategory,
);
router.delete(
  "/delete-blog-category/:id",
  protect,
  BlogCategoryController.deleteBlogCategory,
);
router.post(
  "/update-blog-category-status/:id",
  protect,
  BlogCategoryController.updateBlogCategoryStatus,
);

module.exports = () => router;
