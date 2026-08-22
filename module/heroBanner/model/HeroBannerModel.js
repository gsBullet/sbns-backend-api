const mongoose = require("mongoose");

const heroBannerSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    highlight: {
      type: String,
      trim: true,
      default: "",
    },
    titleEnd: {
      type: String,
      trim: true,
      default: "",
    },
    desc: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String, // stored URL / path of the uploaded image
      required: true,
      trim: true,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("herobanners", heroBannerSchema);