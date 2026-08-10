const express = require('express');
const { uploadImage } = require('../controller/BlogImageController');
const { protect } = require('../../../../middlewares/auth');
const router = express.Router();


router.post('/upload', protect,  uploadImage);
// router.get('/:imageName', BlogImageController.getImage);

module.exports =()=> router;