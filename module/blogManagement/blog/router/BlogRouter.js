const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  uploadImage,
  getAllBlogsCategory,
  updateBlogStatus
} = require("../controller/blogController");

const { uploadThumbnail, uploadBlogContentImage } = require("../../../../middlewares/UploadMiddleware");
const {protect} = require("../../../../middlewares/auth");


// router.post("/upload-image", uploadBlogContentImage.single("image"), uploadImage);

// CRUD
router.post("/create", protect, uploadThumbnail.single("thumbnail"), createBlog);
router.get("/blog-list", protect, getAllBlogs);
router.get("/:idOrSlug", protect, getBlogByIdOrSlug);
router.post("/update-blog/:id", protect, uploadThumbnail.single("thumbnail"), updateBlog);
router.delete("/delete-blog/:id", protect, deleteBlog);
router.post("/update-blog-status/:id", protect, updateBlogStatus);


// blog category for blog management
router.get("/blog-category/list", protect, getAllBlogsCategory);

module.exports =()=> router;