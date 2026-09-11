const mongoose = require("mongoose");

const MartyredLeadersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    initial: {
      type: String,
      trim: true,
      required: true,
      maxlength: 3,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      trim: true,
      default: [],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    gradient: {
      type: String,
      trim: true,
      default: "linear-gradient(135deg, #0f766e, #14b8a6)",
    },
    accent: {
      type: String,
      trim: true,
      default: "#5eead4",
    },
    order: {
      type: Number,
      default: 0, // controls display sequence on the public page
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true },
);

MartyredLeadersSchema.index({ order: 1 });

module.exports = mongoose.model("martyredleaders", MartyredLeadersSchema);
