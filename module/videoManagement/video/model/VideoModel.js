const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videoId: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    videoCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'videoCategories',
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
   
  },
  { timestamps: true }
)

module.exports = mongoose.model('videos', videoSchema)