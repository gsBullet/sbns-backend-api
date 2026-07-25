const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "galleryCategories",
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("gallery", GallerySchema);
