const GalleryModel = require("../galleryManagement/gallery/model/GalleryModel");
const HeroBannerModel = require("../heroBanner/model/HeroBannerModel");
const CounterModel = require("../ManpowerCount/model/CounterModel");
const MartyredLeaderModel = require("../martyredleaders/model/MartyredLeaderModel");
const MemberModel = require("../member/model/MemberModel");
const VideoModel = require("../videoManagement/video/model/VideoModel");

module.exports = {
  heroBannerList: async (req, res) => {
    try {
      const heroBannerList = await HeroBannerModel.find({
        status: true,
      })
        .select("-__v -_id")
        .sort({ createdAt: -1 })
        .exec();

      const sbnsCounter = await CounterModel.findOne({})
        .sort({ createdAt: -1 })
        .select("-__v -_id")
        .exec();

      return res.status(200).json({
        success: true,
        data: {
          heroBannerList,
          sbnsCounter,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        error,
        error: error.message,
      });
    }
  },
  ourHeroList: async (req, res) => {
    try {
      const ourHeroList = await MartyredLeaderModel.find({
        status: true,
      })
        .select("-__v -_id")
        .sort({ createdAt: -1 })
        .exec();

      return res.status(200).json({
        success: true,
        data: ourHeroList,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        error,
        error: error.message,
      });
    }
  },
  imageGalleryList: async (req, res) => {
    try {
      const imageGalleryList = await GalleryModel.find({
        status: true,
      })
        .populate("category")
        .limit(9)
        .select("-__v -_id")
        .sort({ createdAt: -1 })
        .exec();

      return res.status(200).json({
        success: true,
        data: imageGalleryList,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        error,
        error: error.message,
      });
    }
  },
  videoGalleryList: async (req, res) => {
    try {
      const videoGalleryList = await VideoModel.find({
        status: true,
      })
        .populate("videoCategory")
        .limit(6)
        .select("-__v -_id")
        .sort({ createdAt: -1 })
        .exec();

      return res.status(200).json({
        success: true,
        message: "Video gallery fetched successfully",
        data: videoGalleryList,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error,
        error: error.message,
      });
    }
  },
};
