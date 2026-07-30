const mongoose = require("mongoose");
const VideoCategoryModel = require("../../videoCategory/model/VideoCategoryModel");
const VideoModel = require("../model/VideoModel");

module.exports = {
  getAllVideos: async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit) || 10, 1);
      const search = req.query.search?.trim() || "";
      const category = req.query.category?.trim() || "";

      // Build the filter conditionally so an absent category doesn't
      // turn into `videoCategory: ""`, which matches nothing.
      const filter = {};

      if (search) {
        filter.$or = [
          { videoUrl: { $regex: search, $options: "i" } },
          { videoId: { $regex: search, $options: "i" } },
          { caption: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ];
      }

      if (category) {
        if (!mongoose.Types.ObjectId.isValid(category)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid category id" });
        }
        filter.videoCategory = category;
      }

      const [videos, totalVideos] = await Promise.all([
        VideoModel.find(filter)
          .populate("videoCategory", "categoryName") // adjust fields to whatever videoCategories actually has
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit),
        VideoModel.countDocuments(filter),
      ]);

      const totalPages = Math.max(Math.ceil(totalVideos / limit), 1);

      return res.status(200).json({
        success: true,
        data: videos,
        currentPage: page,
        totalPages,
        totalVideos,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  createVideo: async (req, res) => {
    try {
      const { videoUrl, videoId, caption, author, videoCategory, isFeatured } =
        req.body;

      if (!videoUrl || !videoId || !caption || !author || !videoCategory) {
        return res.status(400).json({
          success: false,
          error:
            "videoUrl, videoId, caption, author, and videoCategory are required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(videoCategory)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid videoCategory id" });
      }

      // Avoid saving obvious duplicates of the same YouTube video
      const existing = await VideoModel.findOne({ videoId: videoId.trim() });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, error: "This video has already been added" });
      }

      const video = await VideoModel.create({
        videoUrl: videoUrl.trim(),
        videoId: videoId.trim(),
        caption: caption.trim(),
        author: author.trim(),
        videoCategory,
        isFeatured: Boolean(isFeatured),
      });

      const populated = await video.populate("videoCategory", "categoryName");

      return res.status(201).json({ success: true, data: populated });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  updateVideo: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid video id" });
      }

      const { videoUrl, videoId, caption, author, videoCategory, isFeatured } =
        req.body;

      if (!videoUrl || !videoId || !caption || !author || !videoCategory) {
        return res.status(400).json({
          success: false,
          error:
            "videoUrl, videoId, caption, author, and videoCategory are required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(videoCategory)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid videoCategory id" });
      }

      // If another document already owns this videoId, block the update
      const duplicate = await VideoModel.findOne({
        videoId: videoId.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          error: "Another video already uses this videoId",
        });
      }

      const updated = await VideoModel.findByIdAndUpdate(
        id,
        {
          videoUrl: videoUrl.trim(),
          videoId: videoId.trim(),
          caption: caption.trim(),
          author: author.trim(),
          videoCategory,
          isFeatured: Boolean(isFeatured),
        },
        { new: true, runValidators: true },
      ).populate("videoCategory", "name");

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, error: "Video not found" });
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid video id" });
      }

      const deleted = await VideoModel.findByIdAndDelete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, error: "Video not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Video deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  updateVideoStatus: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid video id" });
      }

      const video = await VideoModel.findById(id);
      if (!video) {
        return res
          .status(404)
          .json({ success: false, error: "Video not found" });
      }

      // Toggle if no explicit status is sent; otherwise use the sent boolean
      const nextStatus =
        typeof req.body.status === "boolean" ? req.body.status : !video.status;

      video.status = nextStatus;
      await video.save();

      return res
        .status(200)
        .json({
          success: true,
          data: video,
          message: "Video status updated successfully",
        });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  getAllVideoCategory: async (req, res) => {
    try {
      const response = await VideoCategoryModel.find({ status: true });
      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
};
