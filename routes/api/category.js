const express = require('express');
const router = express.Router();

const {
  addCategory,
  allCategories,
  updateOneCategory,
  deleteOneCategory,
  findCategoryById,
} = require('../../controllers/categories.controller');

router.post('/addCategory', addCategory);
router.get('/allCategories', allCategories);
router.put('/updateOneCategory/:id', updateOneCategory);
router.get('/deleteOneCategory/:id', deleteOneCategory);
router.get('/findCategoryById/:id', findCategoryById);
module.exports = router;
