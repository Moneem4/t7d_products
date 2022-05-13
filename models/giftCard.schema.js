const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GiftCardSchema = new Schema(
  {
    product_id: {
      ref: "Products",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    catecoryId: {type: String},
    sku: {type: String},
    description: {type: String},
    fullDescription: {type: String},
    provider: {type: String},
    regions: [],
    icon: {type: String},
    price: {type: Number},
    originalPrice: {type: String},
    discount: {type: Number},
    discountPremium: {type: Number},
    rating: {type: Number},
    tag: {type: String},
    activationSteps: {type: String},
    maxPurchase: {type: String},
    available: {type: String},
    categoryId: {type:mongoose.Schema.Types.ObjectId,ref:'Games' },
    platformId: {type:mongoose.Schema.Types.ObjectId,ref:'Platform' }

  },
  { timestamps: true }
);



module.exports = mongoose.model("GiftCard", GiftCardSchema);
