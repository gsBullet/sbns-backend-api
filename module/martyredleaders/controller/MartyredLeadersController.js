const fs = require("fs");
const path = require("path");
const MartyredLeaderModel = require("../model/MartyredLeaderModel");

// helper: build a public URL for an uploaded file
const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/our-hero/${filename}`;

// helper: safely remove an old image file when replacing/deleting
const removeImageFile = (imageUrl) => {
  if (!imageUrl) return;
  try {
    const filename = imageUrl.split("/uploads/our-hero/")[1];
    if (!filename) return;
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "our-hero",
      filename,
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove old banner image:", err.message);
  }
};

module.exports = {
  getOurAllHeroes: async (req, res) => {
    try {
      const response = await MartyredLeaderModel.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: response,
        message: "Martyred leaders fetched successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createOurHero: async (req, res) => {
    const { initial, name, role, bio, tags, order } = req.body;
    try {
      const newOurHero = await MartyredLeaderModel.create({
        initial,
        name,
        role,
        bio,
        tags,
        order,
        image: req.file ? buildImageUrl(req, req.file.filename) : "",
      });
      return res.status(201).json({
        success: true,
        data: newOurHero,
        message: "Martyred leader created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  updateOurHeros: async (req, res) => {
    const { initial, name, role, bio, tags, order } = req.body;
    try {
      const existing = await MartyredLeaderModel.findById(req.params.id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Martyred leader not found" });
      }

      const update = { initial, name, role, bio, tags, order };

      if (req.file) {
        update.image = buildImageUrl(req, req.file.filename);
        removeImageFile(existing.image);
      }

      const updatedOurHero = await MartyredLeaderModel.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: updatedOurHero,
        message: "Martyred leader updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
  },

  updateOurHerosStatus: async (req, res) => {
    try {
      const updatedOurHero = await MartyredLeaderModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true },
      );
      if (!updatedOurHero) {
        return res
          .status(404)
          .json({ success: false, message: "Martyred leader not found" });
      }
      return res.status(200).json({
        success: true,
        data: updatedOurHero,
        message: "Martyred leader status updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
  },

  deleteOurHero: async (req, res) => {
    try {
      const deletedOurHero = await MartyredLeaderModel.findByIdAndDelete(
        req.params.id,
      );
      if (!deletedOurHero) {
        return res
          .status(404)
          .json({ success: false, message: "Martyred leader not found" });
      }
      removeImageFile(deletedOurHero.image);
      return res.status(200).json({
        success: true,
        data: deletedOurHero,
        message: "Martyred leader deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ success: false, error, message: error.message });
    }
  },
};
