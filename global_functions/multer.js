const multer = require('multer')
const multerS3 = require('multer-s3')
const {s3} = require('../global_functions/connectS3')
const { fileFilter } = require('../global_functions/check_image_type')

exports.upload = (backetFolderName) => {
return multer({
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
      cb(null, backetFolderName + Date.now().toString() + r + file.originalname.substring(file.originalname.indexOf('.'), file.originalname.length))
    }
  })
})

}



