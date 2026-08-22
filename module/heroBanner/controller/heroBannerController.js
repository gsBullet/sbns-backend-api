const fs = require("fs");
const path = require("path");
const HeroBannerModel = require("../model/HeroBannerModel");

// helper: build a public URL for an uploaded file
const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/hero-banners/${filename}`;

// helper: safely remove an old image file when replacing/deleting
const removeImageFile = (imageUrl) => {
  if (!imageUrl) return;
  try {
    const filename = imageUrl.split("/uploads/hero-banners/")[1];
    if (!filename) return;
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "hero-banners",
      filename,
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove old banner image:", err.message);
  }
};

// helper: safely parse the tags field (sent as a JSON string from the client)
const parseTags = (rawTags) => {
  if (!rawTags) return [];
  try {
    const parsed = JSON.parse(rawTags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ── GET /hero-banners ──
exports.getHeroBannerList = async (req, res) => {
  try {
    const banners = await HeroBannerModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Hero banners fetched successfully",
      data: banners,
    });
  } catch (error) {
    console.error("getHeroBannerList error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch hero banners",
    });
  }
};

// ── GET /hero-banners/:id ──
exports.getHeroBannerById = async (req, res) => {
  try {
    const banner = await HeroBannerModel.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Hero banner not found" });
    }
    return res.status(200).json({ success: true, data: banner });
  } catch (error) {
    console.error("getHeroBannerById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch hero banner",
    });
  }
};

// ── POST /hero-banners ──
exports.createHeroBanner = async (req, res) => {
    console.log(req.file);
    
  try {
    const { badge, title, highlight, titleEnd, desc, tags } = req.body;

    if (!title?.trim() && !highlight?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title / Highlight cannot be empty!",
      });
    }

    const banner = await HeroBannerModel.create({
      badge: badge?.trim() || "",
      title: title?.trim() || "",
      highlight: highlight?.trim() || "",
      titleEnd: titleEnd?.trim() || "",
      desc: desc?.trim() || "",
      tags: parseTags(tags),
      image: req.file ? buildImageUrl(req, req.file.filename) : "",
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error("createHeroBanner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create hero banner",
    });
  }
};

// ── PUT /hero-banners/:id ──
exports.updateHeroBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await HeroBannerModel.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Hero banner not found" });
    }

    // mirror the frontend rule: a disabled banner cannot be edited
    if (existing.status === false) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit a disabled banner",
      });
    }

    const { badge, title, highlight, titleEnd, desc, tags } = req.body;

    if (!title?.trim() && !highlight?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title / Highlight cannot be empty!",
      });
    }

    const update = {
      badge: badge?.trim() || "",
      title: title?.trim() || "",
      highlight: highlight?.trim() || "",
      titleEnd: titleEnd?.trim() || "",
      desc: desc?.trim() || "",
      tags: parseTags(tags),
    };

    if (req.file) {
      update.image = buildImageUrl(req, req.file.filename);
      removeImageFile(existing.image);
    }

    const banner = await HeroBannerModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("updateHeroBanner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update hero banner",
    });
  }
};

// ── PATCH /hero-banners/:id/status ──
exports.updateHeroBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "status must be a boolean",
      });
    }

    const banner = await HeroBannerModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Hero banner not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Banner status updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("updateHeroBannerStatus error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update banner status",
    });
  }
};

// ── DELETE /hero-banners/:id ──
exports.deleteHeroBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await HeroBannerModel.findById(id);

    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Hero banner not found" });
    }

    // mirror the frontend rule: an active banner cannot be deleted
    if (banner.status === true) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an active banner",
      });
    }

    await HeroBannerModel.findByIdAndDelete(id);
    removeImageFile(banner.image);

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("deleteHeroBanner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete hero banner",
    });
  }
};
