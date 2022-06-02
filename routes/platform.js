const express = require('express')
const router = express.Router()

const platfromController = require('../controllers/platform.controller')

router.post('/addPlatform', platfromController.addPlatform)
router.put('/updatePlatform', platfromController.updatePlatform)
router.delete('/deletePlatform', platfromController.deletePlatform)
router.get('/getAllPlatform', platfromController.getAllPlatform)
module.exports = router
