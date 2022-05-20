const express = require('express')
const router = express.Router()

const {
  addProduct,
  allProducts,
  deleteOneProduct,
  updateOneProduct,
  allProductsByCategories,
  getProductsByGameId,
  getProductById,
  searchProduct
} = require('../../controllers/giftCard.controller')

router.post('/addgiftcard', addProduct)
router.get('/allgiftcards', allProducts)
router.put('/updateOnegiftcard/:id', updateOneProduct)
router.get('/deleteOnegiftcard/:id', deleteOneProduct)
// Body: categories:[]
router.post('/filtredgiftcard', allProductsByCategories)
router.get('/gameProducts/:gameId', getProductsByGameId)
router.get('/getProductById/:id', getProductById)
router.post('/searchProduct', searchProduct)

module.exports = router
