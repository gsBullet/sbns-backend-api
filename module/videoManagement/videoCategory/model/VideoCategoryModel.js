const mongoose = require("mongoose");

const VideoCategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
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

module.exports = mongoose.model("videoCategories", VideoCategorySchema);