const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: { 
        type: String, 
        required: true 
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("gallery", GallerySchema);
