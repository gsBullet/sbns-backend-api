const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema(
  {
    blogCategoryName: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true },
);


module.exports =  mongoose.model("blogcategories", blogCategorySchema);