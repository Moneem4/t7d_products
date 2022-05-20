const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const multer = require('multer')
const multerS3 = require('multer-s3')
const {s3} = require('../global_functions/connectS3')
const { fileFilter } = require('../global_functions/check_image_type')
const {upload} = require('../global_functions/multer')



router.post('/addproduct', upload('productsImages/').fields([{ name: 'banner', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), productController.addproduct)
router.get('/getProductById/:id', productController.getProductById)
router.post('/getproducts', productController.getproducts)
router.put('/updateOneProduct', upload('productsImages/').fields([{ name: 'banner', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), productController.updateOneProduct)
router.delete('/deleteOneProduct', productController.deleteOneProduct)
module.exports = router
