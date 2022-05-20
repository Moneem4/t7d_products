const express = require('express');
const router = express.Router();
const giftCardsRoutes = require('../controllers/giftCard.controller');
const {upload} = require('../global_functions/multer')
router.post('/addGiftCard',upload('giftCardIcons').single('icon'), giftCardsRoutes.addGiftCard);
router.post('/getGiftCards', giftCardsRoutes.getGiftCards);
router.put('/updateOneGiftCard',upload('giftCardIcons').single('icon') ,giftCardsRoutes.updateOneGiftCard);
router.delete('/deleteOneGiftCard', giftCardsRoutes.deleteOneGiftCard);

module.exports = router;
