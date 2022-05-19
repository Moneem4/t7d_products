const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const multer = require('multer')
var multerS3 = require('multer-s3')


let AWS = require('aws-sdk');


const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "me-south-1",
    correctClockSkew: true
});
const fileFilter = (req, file, cb) => {
    if( file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==="application/pdf"){
        cb(null,true)
    } else {
        req.error='Invalid file type, only JPEG and PNG is allowed!'
        cb(null,true)
    }
}
var upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: "t7d-galactech",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
      key: function (req, file, cb) {
      let r = (Math.random() + 1).toString(36).substring(7);
      cb(null, "productsImages/"+Date.now().toString()+r+file.originalname.substring(file.originalname.indexOf("."),file.originalname.length))
      }
  })
})
/*********************************************************************************/
/*********************************************************************************/
/*********************************************************************************/


router.post("/addproduct",upload.fields([{ name: "banner", maxCount: 1 }, { name:"coverImage",maxCount:1},{ name: "logo", maxCount: 1 }]), productController.addproduct);
router.get("/getProductById/:id", productController.getProductById);
router.post("/getproducts", productController.getproducts);
router.put("/updateOneProduct",upload.fields([{ name: "banner", maxCount: 1 }, { name:"coverImage",maxCount:1},{ name: "logo", maxCount: 1 }]), productController.updateOneProduct);
router.delete("/deleteOneProduct", productController.deleteOneProduct);
module.exports = router;
