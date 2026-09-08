const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  uploadImage,
    getAllBlogsCategoryForBlog,
  updateBlogStatus,
  isPublishedBlog,
  uploadThumbnailByCoverImage,
  updatePublishDraftStatus,
  updateBlogFeaturedStatus
} = require("../controller/BlogController");


const { protect } = require("../../../../middlewares/auth");

// CRUD
router.post(
  "/upload-thumbnail-for-cover",
  protect,
  uploadThumbnailByCoverImage,
);
router.post("/create", protect, createBlog);
router.get("/blog-list", protect, getAllBlogs);
router.get("/:idOrSlug", protect, getBlogByIdOrSlug);
router.post("/update-blog/:id", protect, updateBlog);
router.delete("/delete-blog/:id", protect, deleteBlog);
router.post("/update-blog-status/:id", protect, updateBlogStatus);
router.get("/blog-is-published/:id", protect, isPublishedBlog);

// blog category for blog management
router.get("/blog-category/list", protect, getAllBlogsCategoryForBlog);

// blog publish draft
router.get("/publish-draft-status/:id", protect, updatePublishDraftStatus);
router.post("/update-blog-featured/:id", protect, updateBlogFeaturedStatus);

module.exports = () => router;
