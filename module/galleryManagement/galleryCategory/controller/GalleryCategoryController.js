const GalleryCategoryModel = require("../model/GalleryCategoryModel");

module.exports = {
  createGalleryCategory: async (req, res) => {
    try {
      const newGalleryCategory = await GalleryCategoryModel.create(req.body);
      return res.status(201).json({
        success: true,
        data: newGalleryCategory,
        message: "Gallery Category created successfully",
      });
    } catch (error) {
      cosole.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  getAllGalleryCategories:async(req,res) => {
    try {
      const galleryCategories = await GalleryCategoryModel.find();
      return res.status(200).json({
        success: true,
        data: galleryCategories,
        message: "Gallery Categories fetched successfully",
      });
    } catch (error) {
      cosole.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  updateGalleryCategory: async(req,res) => {
    try {
      const updatedGalleryCategory = await GalleryCategoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedGalleryCategory,
        message: "Gallery Category updated successfully",
      });
    } catch (error) {
      cosole.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteGalleryCategory: async(req,res) => {
    try {
      const deletedGalleryCategory = await GalleryCategoryModel.findByIdAndDelete(
        req.params.id
      );
      return res.status(200).json({
        success: true,
        data: deletedGalleryCategory,
        message: "Gallery Category deleted successfully",
      });
    } catch (error) {
      cosole.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  updateGalleryCategoryStatus: async(req,res)=> {
    try {
      const updatedGalleryCategory = await GalleryCategoryModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedGalleryCategory,
        message: "Gallery Category status updated successfully",
      });
    } catch (error) {
      cosole.log(error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};
