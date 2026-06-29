const mongoose = require("mongoose");

const ResponsibilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "দায়িত্বের শিরোনাম দিন"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Responsibilities", ResponsibilitySchema);