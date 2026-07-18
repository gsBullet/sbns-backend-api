const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
    {
        unitName: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            enum: [true, false],
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("units", UnitSchema);