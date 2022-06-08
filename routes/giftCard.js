const express = require('express');
const router = express.Router();
const giftCardsRoutes = require('../controllers/giftCard.controller');
const { upload } = require('../global_functions/multer')
const check_auth = require('../middleware/check_auth')

router.post('/addGiftCard',upload('giftCardIcons').single('icon'), giftCardsRoutes.addGiftCard);
router.post('/getGiftCards', giftCardsRoutes.getGiftCards);
router.put('/updateOneGiftCard',upload('giftCardIcons').single('icon') ,giftCardsRoutes.updateOneGiftCard);
router.delete('/deleteOneGiftCard', giftCardsRoutes.deleteOneGiftCard);
router.post('/getHotDeals',check_auth, giftCardsRoutes.getHotDeals);

module.exports = router;
