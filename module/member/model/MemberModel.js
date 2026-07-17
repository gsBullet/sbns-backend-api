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
  organizationalValue: {
    type: String,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Members", memberSchema);
