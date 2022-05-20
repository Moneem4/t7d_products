const mongoose = require('mongoose')

const GiftCardSchema = mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId,ref: 'Products',required: true },
    sku: { type: String },
    description: { type: String },
    fullDescription: { type: String },
    provider: { type: String },
    regions: [],
    icon: { type: String },
    price: { type: Number },
    originalPrice: { type: String },
    discount: { type: Number },
    discountPremium: { type: Number },
    rating: { type: Number },
    tag: { type: String },
    activationSteps: { type: String },
    maxPurchase: { type: Number },
    available: { type: Boolean },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Games' },
    platformId: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GiftCard', GiftCardSchema)
