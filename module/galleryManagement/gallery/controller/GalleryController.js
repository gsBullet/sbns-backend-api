const mongoose = require("mongoose");
const { uploadFile } = require("../../../../middlewares/updloadHandler");
const GalleryCategoryModel = require("../../galleryCategory/model/GalleryCategoryModel");
const GalleryModel = require("../model/GalleryModel");
const path = require("path");
const fs = require("fs");

module.exports = {
  createGalleryImage: async (req, res) => {
    try {
      const { caption, description, category, isFeatured } = req.body;

      let image = [];

      // Process image
      if (req.files?.image) {
        image = await uploadFile(req.files.image, "uploads");
        console.log("image saved at:", image);
      }

      const newGallery = await GalleryModel.create({
        caption,
        category,
        description,
        image,
        isFeatured,
      });

      const gallery = await GalleryModel.findById(newGallery._id).populate({
        path: "category",
        select: "_id categoryName",
      });

      return res.status(201).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  getAllGalleyImages: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search?.trim() || "";
      const category = req.query.category?.trim() || "";
      const rawFilterFeatured = req.query.filterFeatured?.trim() ?? "";
      const filterFeatured = ["null", "undefined"].includes(rawFilterFeatured)
        ? ""
        : rawFilterFeatured;

      const skip = (page - 1) * limit;

      // Validate category ObjectId
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category id",
        });
      }

      const filter = {};

      // Search filter
      if (search) {
        filter.$or = [
          { caption: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Category filter
      if (category) {
        filter.category = category;
      }

      // Featured filter
      if (filterFeatured !== "") {
        if (filterFeatured === "true") {
          filter.isFeatured = true;
        } else if (filterFeatured === "false") {
          filter.isFeatured = false;
        } else {
          return res.status(400).json({
            success: false,
            message: "filterFeatured must be 'true' or 'false'",
          });
        }
      }

      const [galleries, count] = await Promise.all([
        GalleryModel.find(filter)
          .populate("category")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        GalleryModel.countDocuments(filter),
      ]);

      return res.status(200).json({
        success: true,
        data: galleries,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        message: "Galleries retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getGalleryImageById: async (req, res) => {
    try {
      const gallery = await GalleryModel.findById(req.params.id);
      if (!gallery) {
        return res
          .status(404)
          .json({ success: false, message: "Gallery not found" });
      }
      return res.status(200).json({
        success: true,
        data: gallery,
        message: "Gallery retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  updateGalleryImage: async (req, res) => {
    let newImagePath = null; // only set if a new file was actually uploaded

    try {
      const { caption, description, category, isFeatured } = req.body;

      const gallery = await GalleryModel.findById(req.params.id);
      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: "Gallery not found",
        });
      }

      const oldImagePath = gallery.image;
      let finalImagePath = oldImagePath;

      // Step 1: upload the new image first, don't touch the old one yet
      if (req.files?.image) {
        finalImagePath = await uploadFile(req.files.image, "uploads");
        newImagePath = finalImagePath;
        console.log("image saved at:", newImagePath);
      }

      // Step 2: update the record
      await GalleryModel.findByIdAndUpdate(req.params.id, {
        caption,
        category,
        description,
        image: finalImagePath,
        isFeatured,
      });

      // Step 3: fetch back populated, same shape as create returns
      const updatedGallery = await GalleryModel.findById(
        req.params.id,
      ).populate({
        path: "category",
        select: "_id categoryName",
      });

      // Step 4: only delete the OLD image once everything above succeeded
      if (newImagePath && oldImagePath) {
        const oldImageFullPath = path.join(__dirname, "..", oldImagePath);
        if (fs.existsSync(oldImageFullPath)) fs.unlinkSync(oldImageFullPath);
      }

      return res.status(200).json({
        success: true,
        data: updatedGallery,
        message: "Gallery updated successfully",
      });
    } catch (error) {
      console.log(error);
      // Roll back: only the NEW file, old image is left untouched
      if (newImagePath) {
        const uploadedImageFullPath = path.join(__dirname, "..", newImagePath);
        if (fs.existsSync(uploadedImageFullPath))
          fs.unlinkSync(uploadedImageFullPath);
      }

      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  deleteGalleryImage: async (req, res) => {
    try {
      const deletedGallery = await GalleryModel.findByIdAndDelete(
        req.params.id,
      );

      if (!deletedGallery) {
        return res
          .status(404)
          .json({ success: false, message: "Gallery not found" });
      }

      // Remove the associated image file now that the DB record is gone
      if (deletedGallery.image) {
        const imageFullPath = path.join(__dirname, "..", deletedGallery.image);
        if (fs.existsSync(imageFullPath)) fs.unlinkSync(imageFullPath);
      }

      return res
        .status(200)
        .json({ success: true, message: "Gallery deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  updateGalleryImagesForFeatured: async (req, res) => {
    try {
      const featuredGalleries = await GalleryModel.find(
        req.params.id,
        {
          featured: req.params.featured,
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
        data: featuredGalleries,
        message: "Image Featured successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  updateGalleryImageStatus: async (req, res) => {
    try {
      const updatedGallery = await GalleryModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!updatedGallery) {
        return res
          .status(404)
          .json({ success: false, message: "Gallery not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Gallery status updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  updateGalleryFeaturedStatus: async (req, res) => {
    try {
      const updatedGalleryFeatured = await GalleryModel.findByIdAndUpdate(
        req.params.id,
        { isFeatured: req.body.isFeatured },
        { new: true },
      );
      if (!updatedGalleryFeatured) {
        return res
          .status(404)
          .json({ success: false, message: "Gallery Featured not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Gallery Featured updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  getAllGalleyCetogories: async (req, res) => {
    try {
      const galleryCategories = await GalleryCategoryModel.find({
        status: true,
      }).sort({
        createdAt: -1,
      });
      return res.status(200).json({
        success: true,
        data: galleryCategories,
        message: "Gallery Categories fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};
