const mongoose = require("mongoose");

const GalleryCategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: [true, "Gallery category name is required"],
            trim: true,
        },
        status: {
            type: Boolean,
            enum: [true, false],
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("galleryCategories", GalleryCategorySchema);