module.exports = {
  createGalleryImage: async (req, res) => {
    try {
      const newGallery = await Gallery.create(req.body);
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
      const galleries = await Gallery.find().sort({ createdAt: -1 });
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
      const gallery = await Gallery.findById(req.params.id);
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
    try {
      const updatedGallery = await Gallery.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!updatedGallery) {
        return res
          .status(404)
          .json({ success: false, message: "Gallery not found" });
      }
      return res.status(200).json({
        success: true,
        data: updatedGallery,
        message: "Gallery updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  },
  deleteGalleryImage: async (req, res) => {
    try {
      const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);
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
  getGalleryImagesForFeatured: async (req, res) => {
    try {
      const featuredGalleries = await Gallery.find(
        req.params.id,
        {
          featured: req.params.featured,
        },
        {
          new: true,
        },
      );
      return res
        .status(200)
        .json({
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
      const updatedGallery = await Gallery.findByIdAndUpdate(
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
};
