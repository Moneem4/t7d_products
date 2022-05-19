const productModel = require("../models/Product.schema.js");
const PlatformModel = require("../models/Platform.schema");
const categoryModel = require("../models/Category.schema");
const {display_costume_error} = require('../global_functions/display_costume_error')
const {display_error_message} = require('../global_functions/display_error_message')
const validator = require('../middleware/validatorRequiredData')
const mongoose = require('mongoose');
 const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // CommonJS import


let AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "me-south-1",
    correctClockSkew: true
});

exports.addproduct = async (req, res) => {
   try {
  if (validator(req.body, ["description", "company","title", "categoryId", "platformId"], res)) { return }
  if (req.error != undefined) {display_costume_error(res, req.error);return}
  if (req.files == undefined) { display_costume_error(res, "product need Images logo coverImage banner");return}
  if (req.files.logo == undefined) {display_costume_error(res, "logo Image was required");return}
  if (req.files.coverImage == undefined) {display_costume_error(res, "coverImage Image was required");return}
  if (req.files.banner == undefined) { display_costume_error(res, "banner Image was required"); return }
  
  const { description ,company,categoryId ,title,platformId } = req.body
  const findCat = await categoryModel.findOne({ _id: mongoose.Types.ObjectId(categoryId) })
  const findPlat = await PlatformModel.findOne({ _id: mongoose.Types.ObjectId(platformId) })

  if (findCat == null) {display_costume_error(res, "Category id not found", 404); return}
  if (findPlat == null) {display_costume_error(res, "platfrom id not found", 404); return}

    const product = new productModel({
    description,
    company,
    logo:req.files.logo[0].location,
    coverImage:req.files.coverImage[0].location,
    banner:req.files.banner[0].location,
    categoryId,
    platformId,
    title
    });
    product.save().then(() => {
      res.status(res.statusCode).json({
      message: "product added successfully !",
    });
    }).catch(error => {
      display_error_message(res,error)
    });
  } catch (error) {
      display_error_message(res,error)
  }
} 
exports.getProductById = (req,res) => {
  if (req.params.id == undefined || req.params.id.length == 0) {
    display_costume_error(res, "id was required")
    return
  }
  productModel.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
    if (data == null) {
      display_costume_error(res, "product not found",404)
    } else {
      res.status(res.statusCode).json({
        message: "product data",
        data
      });
    }
  }).catch(error => {
          display_error_message(res,error)
  })
} 
exports.getproducts = (req,res) => {
    if (validator(req.body, ["skip", "limit"], res)) { return }
    const { company, categoryId, platformId, description, title} = req.body
      let params = { company, categoryId, platformId, description, title };
      let newparamsSearch=[]
      for (let prop in params) {
          if (!params[prop])
          {
            delete params[prop];
          } else {
            if (prop == "platformId" || prop == "categoryId") {
              newparamsSearch.push({[prop]:params[prop]})
            } else {
              newparamsSearch.push({[prop]:{ $regex: '.*' + params[prop].toLowerCase() + '.*', $options: 'i' }})
            }
          }
  }
  
    productModel.find(Object.keys(params).length==0?{}:{$and:newparamsSearch}).sort({createdAt: 1}).skip(req.body.skip-0).limit(req.body.limit-0).then(data => {
      if (data.length == 0) {
        display_costume_error(res, "no data was found",404)
      } else {
        res.status(res.statusCode).json({
          message: "products data",
          data
        });
      }
    }).catch(error => {
            display_error_message(res,error)
    })
} 
exports.updateOneProduct=(req,res)=>{
     if (validator(req.body, ["_id"], res)) { return }
        var { _id, title, description,categoryId,platformId } = req.body;
        let params = { _id, categoryId, platformId, description, title,
          logo: (req.files != undefined &&  req.files.logo) ? req.files.logo[0].location : undefined ,
          coverImage: (req.files != undefined && req.files.coverImage) ? req.files.coverImage[0].location : undefined ,
          banner:(req.files != undefined && req.files.banner) ? req.files.banner[0].location : undefined 
        };

  for (let prop in params) if (!params[prop]) delete params[prop];
        productModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, { $set: params }).exec()
            .then(data => {
            if (data == null) {
                display_costume_error(res, "productModel id not found", 404); return
            } else {
                for (let propsa in params) if (params[propsa]) {
                  if (propsa == "logo" || propsa == "coverImage" || propsa == "banner") {
                    s3delete(params[propsa])
                  }
                };
                res.status(res.statusCode).json({
                message: "productModel  data was updated",
                }) 
            }
  
        }).catch(error => {
        display_error_message(res,error)  
        })
} 
exports.deleteOneProduct = (req,res) => {
       if (validator(req.body, ["_id"], res)) { return }

  productModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body._id) }).exec().then(data => {
          if (data.deletedCount == 0) {
            display_costume_error(res, "product _id not found", 404); return
          } else {
            s3delete(data.logo)
            s3delete(data.coverImage)
            s3delete(data.banner)
            res.status(res.statusCode).json({
            message:"product was deleted",
            })
        }
    }).catch(error => {
        display_error_message(res,error)
    })
} 




async function s3delete(imageKeys) {
    s3.deleteObject(
    {
      Bucket: 't7d-galactech',
      Key:imageKeys ,
    },
    function (err, data) {
      if (err) console.log('err ==>', err.message);
      console.log('delete successfully', data);
    }
  );
}