exports.fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'  || file.mimetype === 'image/svg+xml') {
    cb(null, true)
  } else {
    req.error = 'Invalid file type, only JPEG and PNG is allowed!'
    cb(null, true)
    }
}