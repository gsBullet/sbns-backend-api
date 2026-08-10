const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Blog = require("../model/BlogModel");
const { generateUniqueSlug } = require("../utils/slugify");
const BlogCategoryModel = require("../../blogCategory/model/BlogCategoryModel");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/";

// Helper: build a public URL for an uploaded file
const toPublicUrl = (subfolder, filename) =>
  `${BACKEND_URL.replace(/\/+$/, "")}/uploads/${subfolder}/${filename}`;

const parseIfString = (value, fallback) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Helper: remove an uploaded file from disk (used on failure / delete / replace)
const removeFileByUrl = (url) => {
  if (!url) return;
  try {
    const relative = url.split("/uploads/")[1]; // "thumbnails/xxx.png"
    if (!relative) return;
    const filePath = path.join(__dirname, "..", "uploads", relative);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove file:", err.message);
  }
};

/* ------------------------------------------------------------------ */
/* CREATE                                                              */
/* ------------------------------------------------------------------ */
const createBlog = async (req, res) => {
  try {
    const { title } = req.body;
    const categories = parseIfString(req.body.categories, []);
    const tags = parseIfString(req.body.tags, []);
    const content = parseIfString(req.body.content, null);

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Blog title cannot be empty!" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a thumbnail!" });
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one category!",
      });
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please add at least one tag!" });
    }
    if (
      !content ||
      !Array.isArray(content.blocks) ||
      content.blocks.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Blog content cannot be empty!" });
    }

    const slug = await generateUniqueSlug(title);
    const thumbnailUrl = toPublicUrl("thumbnails", req.file.filename);

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      thumbnail: thumbnailUrl,
      categories,
      tags,
      content,
      author: req.user?._id, // set by your auth middleware, if present
    });

    return res.status(201).json({
      success: true,
      message: "Blog published successfully!",
      data: blog,
    });
  } catch (error) {
    // Clean up the orphaned thumbnail if DB insert failed
    if (req.file) removeFileByUrl(toPublicUrl("thumbnails", req.file.filename));
    console.error("createBlog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/* READ - list with pagination / filter / search                       */
/* ------------------------------------------------------------------ */
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search, status } = req.query;

    const filter = {};
    if (category) filter.categories = category;
    if (tag) filter.tags = tag.toLowerCase();
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("author", "name email"),
      Blog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("getAllBlogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/* READ - single blog by id or slug                                    */
/* ------------------------------------------------------------------ */
const getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const blog = await Blog.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "name email");

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("getBlogByIdOrSlug error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/* UPDATE                                                              */
/* ------------------------------------------------------------------ */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog id" });
    }

    const existing = await Blog.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const updates = {};

    if (req.body.title && req.body.title.trim()) {
      updates.title = req.body.title.trim();
      updates.slug = await generateUniqueSlug(req.body.title, id);
    }

    if (req.body.categories !== undefined) {
      const categories = parseIfString(req.body.categories, []);
      if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please select at least one category!",
        });
      }
      updates.categories = categories;
    }

    if (req.body.tags !== undefined) {
      const tags = parseIfString(req.body.tags, []);
      if (!Array.isArray(tags) || tags.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Please add at least one tag!" });
      }
      updates.tags = tags;
    }

    if (req.body.content !== undefined) {
      const content = parseIfString(req.body.content, null);
      if (
        !content ||
        !Array.isArray(content.blocks) ||
        content.blocks.length === 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Blog content cannot be empty!" });
      }
      updates.content = content;
    }

    if (req.body.status && ["draft", "published"].includes(req.body.status)) {
      updates.status = req.body.status;
    }

    // Replace thumbnail only if a new file was uploaded
    if (req.file) {
      updates.thumbnail = toPublicUrl("thumbnails", req.file.filename);
    }

    const blog = await Blog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // Remove the old thumbnail from disk after a successful swap
    if (req.file) removeFileByUrl(existing.thumbnail);

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully!",
      data: blog,
    });
  } catch (error) {
    if (req.file) removeFileByUrl(toPublicUrl("thumbnails", req.file.filename));
    console.error("updateBlog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/* DELETE                                                              */
/* ------------------------------------------------------------------ */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blog id" });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    removeFileByUrl(blog.thumbnail);

    return res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully!" });
  } catch (error) {
    console.error("deleteBlog error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/* IMAGE UPLOAD - matches EditorJS ImageTool's expected response shape */
/* used by uploadBlogImage() -> { success: 1, data: "<path>" } on the  */
/* frontend, which the AddBlog component prefixes with BACKEND_URL.   */
/* ------------------------------------------------------------------ */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: 0, message: "No image file provided" });
    }

    const relativePath = `/uploads/blogs/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      data: relativePath, // frontend prepends BACKEND_URL if not absolute
    });
  } catch (error) {
    console.error("uploadImage error:", error);
    return res.status(500).json({
      success: 0,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Blog status updated successfully!",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("updateBlogStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog status",
      error: error.message,
    });
  }
};

const getAllBlogsCategory = async (req, res) => {
  try {
    const blogCategories = await BlogCategoryModel.find({ status: true })
      .sort({
        createdAt: -1,
      })
      .select("_id blogCategoryName");
    return res.status(200).json({
      success: true,
      message: "ব্লগ ক্যাটেগরি সফলভাবে প্রদর্শিত হয়েছে।",
      data: blogCategories,
    });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogByIdOrSlug,
  updateBlog,
  deleteBlog,
  uploadImage,
  updateBlogStatus,
  getAllBlogsCategory,
};
