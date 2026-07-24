module.exports={
    createGallery: async (req, res) => {    
        try {
          const newGallery = await Gallery.create(req.body);
          res.status(201).json({ success: true, data: newGallery });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      }, 
      getAllGalleries: async (req, res) => {
        try {
          const galleries = await Gallery.find();
          res.status(200).json({ success: true, data: galleries });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
      getGalleryById: async (req, res) => {
        try {
          const gallery = await Gallery.findById(req.params.id);
          if (!gallery) {
            return res.status(404).json({ success: false, message: "Gallery not found" });
          }
          res.status(200).json({ success: true, data: gallery });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
      updateGallery: async (req, res) => {
        try {
          const updatedGallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!updatedGallery) {
            return res.status(404).json({ success: false, message: "Gallery not found" });
          }
          res.status(200).json({ success: true, data: updatedGallery });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
      deleteGallery: async (req, res) => {
        try {
          const deletedGallery = await Gallery.findByIdAndDelete(req.params.id);
          if (!deletedGallery) {
            return res.status(404).json({ success: false, message: "Gallery not found" });
          }
          res.status(200).json({ success: true, message: "Gallery deleted successfully" });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
      getAllGalleriesForFeatured: async (req, res) => {
        try {
          const featuredGalleries = await Gallery.find({ isFeatured: true });
          res.status(200).json({ success: true, data: featuredGalleries });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },  

}