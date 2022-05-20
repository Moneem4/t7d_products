const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/category.controller')

router.post('/addCategory', categoryController.addCategory)
router.put('/updateCategory', categoryController.updateCategory)
router.delete('/deleteCategory', categoryController.deleteCategory)
router.get('/getAllCategory', categoryController.getAllCategory)
module.exports = router
