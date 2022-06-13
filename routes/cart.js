const express = require('express')
const router = express.Router()

const carController = require('../controllers/cart.controller')
const check_auth = require('../middleware/check_auth')

router.post('/addToCart',check_auth, carController.addToCart)
router.get('/getFromCart', check_auth,carController.getFromCart)
router.delete('/deleteFromCart', check_auth, carController.deleteFromCart)
router.delete('/emptyCart', check_auth ,carController.emptyCart)

module.exports = router


