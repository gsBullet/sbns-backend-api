const mongoose = require("mongoose");
const WardManagementSchema = new mongoose.Schema(
  {
    wardName: {
      type: mongoose.Schema.ObjectId,
      ref: "wards",
      required: true,
    },
    unitName: {
      type: mongoose.Schema.ObjectId,
      ref: "units",
      required: true,
    },
    president: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
      required: true,
    },
    vicePresident: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
      required: true,
    },
    secretary: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
      required: true,
    },
    officeSecretary: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
    },
    treasurer: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
    },
    mediaSecretary: {
      type: mongoose.Schema.ObjectId,
      ref: "members",
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("unitManagements", WardManagementSchema);
