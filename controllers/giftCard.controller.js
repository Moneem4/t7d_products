const ProductModel = require('../models/product.schema.js');
const PlatformModel = require('../models/platform.schema');
const categoryModel = require('../models/category.schema');
const GiftCardModel = require('../models/giftCard.schema');
const {display_costume_error} = require('../global_functions/display_costume_error');
const {display_error_message} = require('../global_functions/display_error_message');
const validator = require('../middleware/validatorRequiredData');
const {s3delete} = require('../global_functions/s3delete')

const mongoose = require('mongoose');

exports.addGiftCard = async (req, res) =>  {

  try {
  if (validator(req.body, ['productId', 'sku', 'description', 'fullDescription', 'provider', 'regions', 'price',
    'originalPrice', 'discount', 'discountPremium', 'rating', 'tag', 'activationSteps', 'maxPurchase', 'available', 'categoryId', 'platformId'], res)) {
    return;
    }
      if (req.file === undefined) {
      display_costume_error(res, 'icon was required', 404);
      return
    }
      const { productId, sku, description, fullDescription, provider, regions, price,
      originalPrice, discount, discountPremium, rating, tag, activationSteps, maxPurchase, available, categoryId, platformId } = req.body;
      const findCat =  await categoryModel.findOne({_id: mongoose.Types.ObjectId(categoryId)});
      const findPlat =  await PlatformModel.findOne({_id: mongoose.Types.ObjectId(platformId)});
      const findProd =  await ProductModel.findOne({_id: mongoose.Types.ObjectId(productId)});

    if (findCat === null) {
      display_costume_error(res, 'Category id not found', 404);
      return;
    }
    if (findPlat === null) {
      display_costume_error(res, 'platfrom id not found', 404);
      return;
    }
    if (findProd === null) {
      display_costume_error(res, 'Product id not found', 404);
      return;
    }
    if ((typeof JSON.parse(regions) !== 'object') && regions !== undefined) {
     display_costume_error(res, 'regions need to an  array');
     return
    }
    const Platform = new GiftCardModel({
      productId,
      sku,
      description,
      fullDescription,
      provider,
      regions: JSON.parse(req.body.regions),
      price,
      originalPrice,
      discount,
      discountPremium,
      rating,
      tag,
      activationSteps,
      maxPurchase,
      available,
      categoryId,
      platformId,
      icon: req.file.location
    });
    Platform.save()
      .then(() => {
        res.status(res.statusCode).json({
          message: 'giftCard Platform added successfully !',
        });
      })
      .catch((error) => {
        display_error_message(res, error);
      });

  } catch (error) {
          display_error_message(res, error);
  }
};
exports.getGiftCards = (req, res) => {
  if (validator(req.body, ['skip', 'limit'], res)) {
    return;
  }
  const {  description ,fullDescription ,provider ,regions ,tag ,rating ,discount ,originalPrice ,available ,productId,categoryId ,platformId } = req.body;
  const params = { productId ,description ,fullDescription ,provider ,regions ,tag ,rating ,discount ,originalPrice ,available ,categoryId ,platformId };
  const newParamsSearch = [];
  let sortParams = undefined;
  if (typeof regions !== 'object' && regions !== undefined) {
    display_costume_error(res, 'regions need to an  array');
    return
  }

  if (req.body.discountSort !== undefined && (req.body.discountSort !== 'ASC' && req.body.discountSort !== 'DESC')) {
    display_costume_error(res, 'discountSort need to be  ASC or DESC');
  } else if (req.body.discountSort !== undefined) {
    sortParams = req.body.discountSort === 'ASC' ? {discount: 1} : {discount: -1};
  }
  if (req.body.ratingSort !== undefined && (req.body.ratingSort !== 'ASC' && req.body.ratingSort !== 'DESC')) {
    display_costume_error(res, 'ratingSort need to be  ASC or DESC');
  } else if (req.body.ratingSort !== undefined) {
    sortParams = req.body.ratingSort === 'ASC' ? {rating: 1} : {rating: -1};
  }
  for (const prop in params) {
    if (!params[prop]) {
      delete params[prop];
    } else {
      if (prop === 'platformId' || prop === 'categoryId' || prop === 'productId') {
        newParamsSearch.push({ [prop]: params[prop] });
      } else if (prop === 'regions') {
        newParamsSearch.push({ regions:  {$in: req.body.regions}  })
      } else {
        newParamsSearch.push({
          [prop]: {
            $regex: '.*' + params[prop].toLowerCase() + '.*',
            $options: 'i',
          },
        });
      }
    }
  }

  GiftCardModel.find(
    Object.keys(params).length === 0 ? {} : { $and: newParamsSearch }
    ) 
    .sort(sortParams !== undefined ? { ...sortParams } : { createdAt: 1 })
    .select('-createdAt -updatedAt -categoryId -platformId -originalPrice -provider -sku -productId')
    .skip(req.body.skip - 0)
    .limit(req.body.limit - 0)
    .then((data) => {
      if (data.length === 0) {
        display_costume_error(res, 'no data was found', 404);
      } else {
        
        res.status(res.statusCode).json({
          message: 'products data',
          data,
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });

};
exports.updateOneGiftCard = (req, res) => {

  if (validator(req.body, ['_id'], res)) {
    return;
  }
    const { _id,productId, sku, description, fullDescription, provider, regions, price,
    originalPrice, discount, discountPremium, rating, tag, activationSteps, maxPurchase, available, categoryId, platformId } = req.body;
    const params = { _id, productId, sku, description, fullDescription, provider, regions, price,
      originalPrice, discount, discountPremium, rating, tag, activationSteps, maxPurchase, available, categoryId, platformId,
      icon: req.file !== undefined ? req.file.location : undefined 
  };
      if (typeof regions !== 'object' && regions !== undefined) {
      display_costume_error(res, 'regions need to an  array');
      return
    }
  for (const prop in params) if (!params[prop]) delete params[prop];
  GiftCardModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body._id) },
    { $set: params },
  )
    .exec()
    .then((data) => {
      if (data === null) {
        display_costume_error(res, 'Platform id not found', 404);
      } else {
        if (params.icon !== undefined) {
          s3delete(data.icon)
        }
        res.status(res.statusCode).json({
          message: 'giftCard  data was updated',
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });

};
exports.deleteOneGiftCard = (req, res) => {

  if (validator(req.body, ['_id'], res)) {
    return;
  }

  GiftCardModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.body._id) })
    .exec()
    .then((data) => {
      if (data === null) {
        display_costume_error(res, 'giftCard _id not found', 404);
      } else {
        s3delete(data.icon);
        res.status(res.statusCode).json({
          message: 'giftCard was deleted',
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });

};



exports.getHotDeals = (req, res) => {
    if (validator(req.body, ['skip', 'limit','discountSort'], res)) {
    return;
  }
  if (req.body.discountSort !== 'ASC' && req.body.discountSort !== 'DESC') {
    display_costume_error(res, 'discountSort need to be ASC OR DESC', 400);
    return
  }
    let sortParams = undefined;
    sortParams = req.body.discountSort === 'ASC' ? {discount: 1} : {discount: -1};
    sortParamsPremuim = req.body.discountSort === 'ASC' ? { discountPremium: 1 } : { discountPremium: -1 };
     GiftCardModel.find({})
    .sort(req.verified.premium === true ? { ...sortParamsPremuim } : { ...sortParams })
    .select('-createdAt -updatedAt -categoryId -platformId -originalPrice -provider -sku -productId')
    .skip(req.body.skip - 0)
    .limit(req.body.limit - 0)
    .then((data) => {
      if (data.length === 0) {
        display_costume_error(res, 'no data was found', 404);
      } else {
        
        res.status(res.statusCode).json({
          message: 'products data',
          data,
        });
      }
    })
    .catch((error) => {
      display_error_message(res, error);
    });


}