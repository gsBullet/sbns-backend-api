const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsLetterSchema = new Schema({
    month: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: String,
        required: true,
    },
    // pdfThumbnail: {
    //     type: String,
    //     required: true,
    // },
    pdf: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('newsletters', newsLetterSchema);