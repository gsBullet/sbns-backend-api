
const mongoose = require("mongoose");

const CouterSchema = new mongoose.Schema(
    {
        member: {
            type: Number,
            default: 0,
        },
        totalManpower: {
            type: Number,
            default: 0,
        },
        totalWard : {
            type: Number,
            default: 0,
        },
        totalUnit : {
            type: Number,
            default: 0,
        },
        status: {
            type: Boolean,
            enum: [true, false],
            default: true,
        },
    },
    { timestamps: true },
);
module.exports = mongoose.model("couters", CouterSchema);