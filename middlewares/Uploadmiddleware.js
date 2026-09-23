const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Make sure upload folders exist
const pdfDir = path.join(__dirname, '..', 'uploads', 'pdfs');
const thumbDir = path.join(__dirname, '..', 'uploads', 'pdf-thumbnails');
[pdfDir, thumbDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Decide destination folder based on the field name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'pdf') {
            cb(null, pdfDir);
        } else if (file.fieldname === 'pdfThumbnail') {
            cb(null, thumbDir);
        } else {
            cb(new Error('Unexpected field'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// Restrict file types per field
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
        return cb(new Error('pdf field must be a PDF file'), false);
    }
    if (file.fieldname === 'pdfThumbnail' && !file.mimetype.startsWith('image/')) {
        return cb(new Error('pdfThumbnail field must be an image file'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

// Use in routes: upload.fields([{ name: 'pdf' }, { name: 'pdfThumbnail' }])
module.exports = upload;