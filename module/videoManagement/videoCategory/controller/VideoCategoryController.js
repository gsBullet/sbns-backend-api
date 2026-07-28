const VideoCategoryModel = require("../model/VideoCategoryModel");

module.exports = {
  getAllVideoCategories: async (req, res) => {
    try {
      const videoCategories = await VideoCategoryModel.find();
      return res.status(200).json({
        success: true,
        data: videoCategories,
        message: "Video categories retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  createVideoCategory: async (req, res) => {
    try {
      const newVideoCategory = await VideoCategoryModel.create(req.body);
      return res.status(201).json({
        success: true,
        data: newVideoCategory,
        message: "Video category created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  updateVideoCategory: async (req, res) => {
    try {
      const updatedVideoCategory = await VideoCategoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedVideoCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Video category not found" });
      }
      return res.status(200).json({
        success: true,
        data: updatedVideoCategory,
        message: "Video category updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  deleteVideoCategory: async (req, res) => {
    try {
      const deletedVideoCategory = await VideoCategoryModel.findByIdAndDelete(
        req.params.id,
      );
      if (!deletedVideoCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Video category not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Video category deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  updateVideoCategoryStatus: async (req, res) => {
    try {
      const updatedVideoCategoryStatus = await VideoCategoryModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!updatedVideoCategoryStatus) {
        return res
          .status(404)
          .json({ success: false, message: "Video category not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Video category status updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
};
