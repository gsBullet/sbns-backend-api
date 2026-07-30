const express = require("express");
const router = express.Router();
const VideoController = require("../controller/VideoController");
const { protect } = require("../../../../middlewares/auth");

router.get("/list", protect, VideoController.getAllVideos);
router.post("/create", protect, VideoController.createVideo);
router.post("/update-video/:id", protect, VideoController.updateVideo);
router.delete("/:id", protect, VideoController.deleteVideo);
router.post(
    "/update-video-status/:id",
    protect,
    VideoController.updateVideoStatus,
);
router.get("/video-category/list", protect, VideoController.getAllVideoCategory);

module.exports = () => router;