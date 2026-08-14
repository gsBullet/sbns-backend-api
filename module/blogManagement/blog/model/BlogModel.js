const mongoose = require("mongoose");
const { Schema } = mongoose;

const editorContentSchema = new Schema(
  {
    time: { type: Number },
    version: { type: String },
    blocks: { type: Array, default: [] },
  },
  { _id: false },
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
      type: String,
      required: [true, "Thumbnail is required"],
    },

    categories: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "blogcategories",
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
        validator: (val) =>
          val && Array.isArray(val.blocks) && val.blocks.length > 0,
        message: "Blog content cannot be empty",
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    isPublished: {
      type: String,
      enum: ["draft", "published", "pending", ],
      default: "pending",
    },

    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

blogSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("blogs", blogSchema);
