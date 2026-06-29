const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  presentAddress: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Responsibilities",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Members", memberSchema);
