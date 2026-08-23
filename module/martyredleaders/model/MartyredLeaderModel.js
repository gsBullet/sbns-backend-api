const mongoose = require('mongoose');

const MartyredLeadersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'নাম আবশ্যক'],
      trim: true,
      maxlength: [120, 'নাম সর্বোচ্চ ১২০ ক্যারেক্টার হতে পারবে'],
    },
    role: {
      type: String,
      required: [true, 'পদবি/দায়িত্ব আবশ্যক'],
      trim: true,
      maxlength: [150, 'পদবি সর্বোচ্চ ১৫০ ক্যারেক্টার হতে পারবে'],
    },
    initial: {
      type: String,
      trim: true,
      maxlength: [3, 'ইনিশিয়াল সর্বোচ্চ ৩ ক্যারেক্টার হতে পারবে'],
      // auto-generated from name if not provided — see pre-save hook below
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'বায়ো সর্বোচ্চ ১০০০ ক্যারেক্টার হতে পারবে'],
      default: '',
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    gradient: {
      type: String,
      trim: true,
      default: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    },
    accent: {
      type: String,
      trim: true,
      default: '#5eead4',
    },
    order: {
      type: Number,
      default: 0, // controls display sequence on the public page
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true }
);



MartyredLeadersSchema.index({ order: 1 });

module.exports = mongoose.model('martyredleaders', MartyredLeadersSchema);