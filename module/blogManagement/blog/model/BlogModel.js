const mongoose = require("mongoose");
const { Schema } = mongoose;


const editorContentSchema = new Schema(
  {
    time: { type: Number },
    version: { type: String },
    blocks: { type: Array, default: [] },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    thumbnail: {
      type: String, // stored relative/absolute URL path
      required: [true, "Thumbnail is required"],
    },

    categories: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one category is required",
      },
    },

    tags: {
      type: [String],
      default: [],
      set: (tags) => tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
    },

    content: {
      type: editorContentSchema,
      required: [true, "Blog content is required"],
      validate: {
        validator: (val) => val && Array.isArray(val.blocks) && val.blocks.length > 0,
        message: "Blog content cannot be empty",
      },
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("blogs", blogSchema);