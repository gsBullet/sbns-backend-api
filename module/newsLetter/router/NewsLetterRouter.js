const express = require('express');
const router = express.Router();
const newsLetterController = require('../controller/NewsLetterController');
const {protect} = require('../../../middlewares/auth');
const upload = require('../../../middlewares/Uploadmiddleware');

// upload.fields expects both files sent under these exact field names
const fileFields = upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'pdfThumbnail', maxCount: 1 },
]);

router.get('/list', protect, newsLetterController.getNewsLetters);
router.post('/create', protect,  fileFields, newsLetterController.createNewsLetter);
router.get('/news-letter/:id', protect, newsLetterController.getNewsLetterById);
router.post('/update-news-letter/:id', protect, fileFields, newsLetterController.updateNewsLetter);
router.delete('/delete-news-letter/:id', protect, newsLetterController.deleteNewsLetter);
router.post('/update-news-letter-status/:id', protect, newsLetterController.updateNewsLetterStatus);

module.exports =()=> router;