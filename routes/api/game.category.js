const express = require('express');
const router = express.Router();

const {
  addGameCategory,
  allGamesCategories,
  updateOneGameCategory,
  deleteOneGameCategory,
} = require('../../controllers/games.categories.controller');

router.post('/addGameCategory', addGameCategory);
router.get('/allGamesCategories', allGamesCategories);
router.put('/updateOneGameCategory/:id', updateOneGameCategory);
router.get('/deleteOneGameCategory/:id', deleteOneGameCategory);
module.exports = router;
