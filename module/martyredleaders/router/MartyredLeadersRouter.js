const express = require('express');
const router = express.Router();
const {
  getOurAllHeroes,
  createOurHero,
  updateOurHeros,
  updateOurHerosStatus,
  deleteOurHero
} = require('../controllers/teamMemberController');
const { protect } = require('../../../middlewares/auth');


router.get('/list', protect, getOurAllHeroes);
router.post('/create', protect, createOurHero);
router.post('/update-our-hero/:id', protect, updateOurHeros);
router.post('/update-our-hero-status/:id', protect, updateOurHerosStatus);
router.delete('/delete/:id', protect, deleteOurHero);