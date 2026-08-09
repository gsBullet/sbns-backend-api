const BlogCategoryModel = require("../model/BlogCategoryModel");

module.exports = {
  createBlogCategory: async (req, res) => {
    try {
      const { blogCategoryName } = req.body;
      const newCategory = await BlogCategoryModel.create({ blogCategoryName });
      return res.status(201).json({
        success: true,
        message: "ব্লগ ক্যাটেগরি সফলভাবে তৈরি হয়েছে।",
        data: newCategory,
      });
    } catch (error) {
        console.error("Error creating blog category:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getAllBlogCategories: async (req, res) => {
    try {
      const blogCategories = await BlogCategoryModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        message: "ব্লগ ক্যাটেগরি সফলভাবে প্রদর্শিত হয়েছে।",
        data: blogCategories,
      });
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

    updateBlogCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { blogCategoryName } = req.body;

      const updatedCategory = await BlogCategoryModel.findByIdAndUpdate(
        id,
        { blogCategoryName },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "ব্লগ ক্যাটেগরি পাওয়া যায়নি।",
        });
      }

      return res.status(200).json({
        success: true,
        message: "ব্লগ ক্যাটেগরি সফলভাবে আপডেট হয়েছে।",
        data: updatedCategory,
      });
    } catch (error) {
        console.error("Error updating blog category:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  
  deleteBlogCategory: async (req, res) => {
    try {
      const { id } = req.params;    
      const deletedCategory = await BlogCategoryModel.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({
          success: false,
          message: "ব্লগ ক্যাটেগরি পাওয়া যায়নি।",
        });
      }
      return res.status(200).json({
        success: true,
        message: "ব্লগ ক্যাটেগরি সফলভাবে ডিলিট হয়েছে।",
        data: deletedCategory,
      });
    } catch (error) {
        console.error("Error deleting blog category:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

    updateBlogCategoryStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedCategory = await BlogCategoryModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "ব্লগ ক্যাটেগরি পাওয়া যায়নি।",
        });
      }

      return res.status(200).json({
        success: true,
        message: "ব্লগ ক্যাটেগরি স্ট্যাটাস সফলভাবে আপডেট হয়েছে।",
        data: updatedCategory,
      });
    } catch (error) {
        console.error("Error updating blog category status:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
