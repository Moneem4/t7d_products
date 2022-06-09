const express = require('express')
const router = express.Router()
const {upload} = require('../global_functions/multer')

const platfromController = require('../controllers/platform.controller')

router.post('/addPlatform',upload('platformIconForProdcustAndGiftCards').single('icon'), platfromController.addPlatform)
router.put('/updatePlatform',upload('platformIconForProdcustAndGiftCards').single('icon'), platfromController.updatePlatform)
router.delete('/deletePlatform', platfromController.deletePlatform)
router.get('/getAllPlatform', platfromController.getAllPlatform)
module.exports = router
