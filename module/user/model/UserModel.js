const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    userRole: {
      type: String,
      required: true,
      enum: ["user", "admin","superadmin"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: false, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Users", UserSchema);
