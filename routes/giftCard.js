const express = require('express');
const router = express.Router();
const giftCardsRoutes = require('../controllers/giftCard.controller');
const multer = require('multer')
const multerS3 = require('multer-s3')
const {fileFilter} = require('../global_functions/check_image_type')

const {s3} = require('../global_functions/connectS3')


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
      cb(null, 'giftCardIcons/' + Date.now().toString() + r + file.originalname.substring(file.originalname.indexOf('.'), file.originalname.length))
    }
  })
})
/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/


router.post('/addGiftCard',upload.single('icon'), giftCardsRoutes.addGiftCard);
router.post('/getGiftCards', giftCardsRoutes.getGiftCards);
router.put('/updateOneGiftCard',upload.single('icon') ,giftCardsRoutes.updateOneGiftCard);
router.delete('/deleteOneGiftCard', giftCardsRoutes.deleteOneGiftCard);

module.exports = router;
