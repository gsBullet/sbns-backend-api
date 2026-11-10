const mongoose = require("mongoose");

const thanaSchema = new mongoose.Schema({
  amir: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "members",
  },
  nayebeAmir: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "members",
  },
  secretary: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "members",
  },
  officeSecretary: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "members",
  },
  bm: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "members",
    },
    mediaSecretary: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "members",
  },
  teamMembers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "members",
  },
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
});

const ThanaTeamModel = mongoose.model("thanateams", thanaSchema);
module.exports = ThanaTeamModel;
