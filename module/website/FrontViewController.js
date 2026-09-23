const BlogModel = require("../blogManagement/blog/model/BlogModel");
const GalleryModel = require("../galleryManagement/gallery/model/GalleryModel");
const HeroBannerModel = require("../heroBanner/model/HeroBannerModel");
const CounterModel = require("../ManpowerCount/model/CounterModel");
const MartyredLeaderModel = require("../martyredleaders/model/MartyredLeaderModel");
const MemberModel = require("../member/model/MemberModel");
const NewsLetterModel = require("../newsLetter/model/NewsLetterModel");
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
  imageGalleryListPage: async (req, res) => {
    try {
      const imageGalleryList = await GalleryModel.find({
        status: true,
      })
        .populate("category")
        .select("-__v ")
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
        .select("-__v")
        .sort({ createdAt: -1 })
        .limit(6)
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
  videoGalleryListPage: async (req, res) => {
    try {
      const videoGalleryList = await VideoModel.find({
        status: true,
      })
        .populate("videoCategory")
        .select("-__v")
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
  blogList: async (req, res) => {
    try {
      const blogList = await BlogModel.find({
        status: true,
      })
        .populate("categories")
        .populate("author")
        .select("-__v")
        .sort({ createdAt: -1 })
        .limit(6)
        .exec();

      return res.status(200).json({
        success: true,
        message: "Blog list fetched successfully",
        data: blogList,
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
  blogListPage: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      const blogList = await BlogModel.find({
        status: true,
        ...(search && { title: { $regex: search, $options: "i" } }),
        ...(category && { categories: { $in: category } }),
      })
        .populate("categories")
        .populate("author")
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await BlogModel.find({
        status: true,
        ...(search && { title: { $regex: search, $options: "i" } }),
        ...(category && { categories: { $in: category } }),
      }).countDocuments();

      const featuredBlogList = await BlogModel.findOne({
        status: true,
        isFeatured: true,
        ...(search && { title: { $regex: search, $options: "i" } }),
        ...(category && { categories: { $in: category } }),
      })
        .populate("categories")
        .populate("author")
        .select("-__v")
        .sort({ createdAt: -1 })
        .limit(1)
        .exec();

      return res.status(200).json({
        success: true,
        message: "Blog list fetched successfully",
        data: { blogs: blogList, featured: featuredBlogList },
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
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

  blogForRead: async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await BlogModel.findOne({
        _id: id,
        status: true,
      })
        .populate("categories")
        .populate("author")
        .select("-__v")
        .exec();

      return res.status(200).json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
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

  blogCategoriesForFrontView: async (req, res) => {
    try {
      const categories = await BlogModel.aggregate([
        // categories array থেকে প্রতিটি category আলাদা করা
        {
          $unwind: "$categories",
        },

        // Category collection থেকে category information আনা
        {
          $lookup: {
            from: "blogcategories",
            localField: "categories",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },

        {
          $unwind: "$categoryInfo",
        },

        // একই category অনুযায়ী count
        {
          $group: {
            _id: "$categories",
            blogCategoryName: {
              $first: "$categoryInfo.blogCategoryName",
            },
            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Blog categories fetched successfully",
        data: categories,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  categoryWiseBlogListPage: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      const blogList = await BlogModel.find({
        status: true,
        ...(search && { title: { $regex: search, $options: "i" } }),
        ...(category && { categories: { $in: category } }),
      })
        .populate("categories")
        .populate("author")
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await BlogModel.find({
        status: true,
        ...(search && { title: { $regex: search, $options: "i" } }),
        ...(category && { categories: { $in: category } }),
      }).countDocuments();

      return res.status(200).json({
        success: true,
        message: "Blog list fetched successfully",
        data: blogList,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
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
  newsLetterList: async (req, res) => {
    try {
      const newsLetterList = await NewsLetterModel.find({status: true}).exec();
      return res.status(200).json({ success: true, data: newsLetterList, message: "News letter list fetched successfully" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message , error });
    }
  },
};
