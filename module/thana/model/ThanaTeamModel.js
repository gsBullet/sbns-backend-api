const mongoose = require("mongoose");
const { Schema } = mongoose;

// প্রতিটি পদের সদস্যের জন্য: সদস্য + সংক্ষিপ্ত বাণী + জীবনী (সবই বাধ্যতামূলক)
const roleEntrySchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "members",
      required: [true, "সদস্য নির্বাচন করা বাধ্যতামূলক"],
    },
    shortSpeech: {
      type: String,
      trim: true, // শুধু স্পেস দিলে ফাঁকা ধরা হবে, ফলে required ফেল করবে
      required: [true, "সংক্ষিপ্ত বাণী দেওয়া বাধ্যতামূলক"],
    },
    bio: {
      type: String,
      trim: true,
      required: [true, "জীবনী দেওয়া বাধ্যতামূলক"],
    },
  },
  { _id: false },
);

// Mongoose 5+ এ অ্যারের required ফাঁকা অ্যারেও পাস করে দেয়,
// তাই কমপক্ষে একজন সদস্য আছে কিনা আলাদা validator দিয়ে নিশ্চিত করা হলো
const atLeastOne = {
  validator: (value) => Array.isArray(value) && value.length > 0,
  message: "কমপক্ষে একজন সদস্য নির্বাচন করা বাধ্যতামূলক",
};

const thanaSchema = new Schema({
  amir: {
    type: roleEntrySchema,
    required: true,
  },
  nayebeAmir: {
    type: [roleEntrySchema],
    validate: atLeastOne,
  },
  secretary: {
    type: roleEntrySchema,
    required: true,
  },
  officeSecretary: {
    type: roleEntrySchema,
    required: true,
  },
  bm: {
    type: roleEntrySchema,
    required: true,
  },
  mediaSecretary: {
    type: roleEntrySchema,
    required: true,
  },
  teamMembers: {
    type: [roleEntrySchema],
    validate: atLeastOne,
  },
  status: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
});

const ThanaTeamModel = mongoose.model("thanateams", thanaSchema);
module.exports = ThanaTeamModel;