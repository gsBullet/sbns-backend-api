const { uploadFile } = require("../../../../middlewares/updloadHandler");
const GalleryCategoryModel = require("../../galleryCategory/model/GalleryCategoryModel");
const GalleryModel = require("../model/GalleryModel");

module.exports = {
  createGalleryImage: async (req, res) => {
    console.log(req.body);

    try {
      const { caption, description, category, isFeatured } = req.body;

      let image = [];

      // Process image
      if (req.files?.image) {
        image = uploadFile(req.files.image, "uploads");
        console.log("image saved at:", image);
      }

      const newGallery = await GalleryModel.create({
        caption,
        category,
        description,
        image: image,
        isFeatured,
      });
      return res.status(201).json({
        success: true,
        data: newGallery,
        message: "Gallery created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  getAllGalleyImages: async (req, res) => {
    try {
      const galleries = await GalleryModel.find()
      .populate("category")
      .sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: galleries,
        message: "Galleries retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
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
    let imagePath = "";

    try {
      const { caption, description, category, isFeatured } = req.body;

      const gallery = await GalleryModel.findById(req.params.id);

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: "Gallery not found",
        });
      }

      imagePath = gallery.image;

      if (req.files?.image) {
        if (imagePath) {
          const oldImage = path.join(__dirname, "..", imagePath);
          if (fs.existsSync(oldImage)) fs.unlinkSync(oldImage);
        }

        imagePath = uploadFile(req.files.image, "uploads");
      }

      const updatedGallery = await GalleryModel.findByIdAndUpdate(
        req.params.id,
        {
          caption,
          category,
          description,
          image: imagePath,
          isFeatured,
        },
        { new: true },
      );

      return res.status(200).json({
        success: true,
        data: updatedGallery,
        message: "Gallery updated successfully",
      });
    } catch (error) {
      if (req.files?.image && imagePath) {
        const uploadedImage = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(uploadedImage)) fs.unlinkSync(uploadedImage);
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
      res.status(200).json({ success: true, data: updatedGallery });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
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
