const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const multer = require('multer')
const multerS3 = require('multer-s3')
const {s3} = require('../global_functions/connectS3')
const {fileFilter} = require('../global_functions/check_image_type')



const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 't7d-galactech',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      const r = (Math.random() + 1).toString(36).substring(7)
      cb(null, 'productsImages/' + Date.now().toString() + r + file.originalname.substring(file.originalname.indexOf('.'), file.originalname.length))
    }
  })
})
/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/

router.post('/addproduct', upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), productController.addproduct)
router.get('/getProductById/:id', productController.getProductById)
router.post('/getproducts', productController.getproducts)
router.put('/updateOneProduct', upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), productController.updateOneProduct)
router.delete('/deleteOneProduct', productController.deleteOneProduct)
module.exports = router
