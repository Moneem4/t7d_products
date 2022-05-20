const express = require('express');
const router = express.Router();
const giftCardsRoutes = require('../controllers/giftCard.controller');

const multer = require('multer')
const multerS3 = require('multer-s3')

const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'me-south-1',
  correctClockSkew: true
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    req.error = 'Invalid file type, only JPEG and PNG is allowed!'
    cb(null, true)
  }
}
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
